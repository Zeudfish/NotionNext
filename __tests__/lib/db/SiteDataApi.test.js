jest.mock('@/blog.config', () => ({
  ...jest.requireActual('@/blog.config'),
  ENABLE_CACHE: true,
  isProd: true,
  REDIS_URL: '',
  BUNDLE_ANALYZER: false,
  NOTION_INDEX: 0,
  NEXT_REVALIDATE_SECOND: 60
}))
jest.mock('@/lib/global', () => ({ getGlobalSnapshot: () => ({}) }))
jest.mock('notion-utils', () => ({
  idToUuid: id =>
    String(id)
      .replace(/-/g, '')
      .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5'),
  getTextContent: value =>
    Array.isArray(value) ? value.map(item => item?.[0] || '').join('') : ''
}))
jest.mock('@/lib/db/notion/getNotionAPI', () => ({}))
jest.mock('@/lib/db/notion/getNotionPost', () => ({
  fetchPageFromNotion: jest.fn()
}))
jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  fetchNotionPageBlocks: jest.fn(),
  fetchInBatches: jest.fn(),
  formatNotionBlock: blocks => blocks
}))
jest.mock('@/lib/db/notion/getNotionConfig', () => ({
  getConfigMapFromConfigPage: jest.fn()
}))
jest.mock('@/lib/db/notion/memberDataSource', () => ({
  fetchMembersFromOfficialAPI: jest.fn().mockResolvedValue([])
}))
jest.mock('@/lib/utils/post', () => ({
  processPostData: jest.fn().mockResolvedValue(undefined)
}))

import BLOG from '@/blog.config'
import memoryCache from 'memory-cache'
import {
  fetchGlobalAllData,
  getSiteDataByPageId,
  resolvePostProps
} from '@/lib/db/SiteDataApi'
import {
  fetchInBatches,
  fetchNotionPageBlocks
} from '@/lib/db/notion/getPostBlocks'
import { getConfigMapFromConfigPage } from '@/lib/db/notion/getNotionConfig'
import {
  getLegacyUuidRedirect,
  getPostVisibilityResult
} from '@/lib/site/postRoute'

const DATABASE_ID = '774104f9-eb3c-497e-9199-4f6807887aa8'
const OTHER_DATABASE_ID = '22222222-2222-4222-8222-222222222222'
const COLLECTION_ID = '33333333-3333-4333-8333-333333333333'
const VIEW_ID = '44444444-4444-4444-8444-444444444444'
const OTHER_VIEW_ID = '55555555-5555-4555-8555-555555555555'
const POST_ID = '39f37eae-c0b1-81fa-b7ed-f617cc9a0be8'
const PRIVATE_POST_ID = '66666666-6666-4666-8666-666666666666'
const originalPageId = BLOG.NOTION_PAGE_ID
const originalExport = process.env.EXPORT

function databaseRecord({
  databaseId = DATABASE_ID,
  status = 'Published',
  title = 'Existing article'
} = {}) {
  return {
    block: {
      [databaseId]: {
        value: {
          id: databaseId,
          type: 'collection_view_page',
          collection_id: COLLECTION_ID,
          view_ids: [VIEW_ID]
        }
      },
      [POST_ID]: {
        value: {
          id: POST_ID,
          type: 'page',
          parent_id: COLLECTION_ID,
          created_time: 1782172800000,
          last_edited_time: 1782172800000,
          properties: {
            title: [[title]],
            type: [['Post']],
            status: [[status]],
            slug: [['test-post']]
          }
        }
      }
    },
    collection: {
      [COLLECTION_ID]: {
        value: {
          id: COLLECTION_ID,
          name: [['Test site']],
          schema: {
            title: { name: 'title', type: 'title' },
            type: { name: 'type', type: 'select' },
            status: { name: 'status', type: 'select' },
            slug: { name: 'slug', type: 'text' }
          }
        }
      }
    },
    collection_query: {
      [COLLECTION_ID]: {
        [VIEW_ID]: {
          reducerResults: { collection_group_results: { blockIds: [POST_ID] } }
        }
      }
    },
    collection_view: {
      [VIEW_ID]: { value: { value: { page_sort: [POST_ID] } } }
    }
  }
}

beforeEach(() => {
  memoryCache.clear()
  BLOG.NOTION_PAGE_ID = DATABASE_ID
  BLOG.BUNDLE_ANALYZER = false
  delete process.env.EXPORT
  getConfigMapFromConfigPage.mockResolvedValue({
    POST_URL_PREFIX: 'article',
    NEXT_REVALIDATE_SECOND: 120
  })
  fetchInBatches.mockReset()
  fetchInBatches.mockResolvedValue({})
  fetchNotionPageBlocks.mockReset()
  fetchNotionPageBlocks.mockImplementation(id => {
    const record = databaseRecord()
    return Promise.resolve(
      id === DATABASE_ID
        ? record
        : { block: { [POST_ID]: record.block[POST_ID] } }
    )
  })
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  memoryCache.clear()
  BLOG.NOTION_PAGE_ID = originalPageId
  BLOG.BUNDLE_ANALYZER = false
  if (originalExport === undefined) delete process.env.EXPORT
  else process.env.EXPORT = originalExport
})

describe('Notion source failure and recovery', () => {
  it.each([
    ['missing response', () => null],
    ['missing database block', record => ({ ...record, block: {} })],
    [
      'non-database root',
      record => {
        record.block[DATABASE_ID].value.type = 'page'
        return record
      }
    ],
    ['missing collection', record => ({ ...record, collection: {} })],
    [
      'missing schema',
      record => {
        delete record.collection[COLLECTION_ID].value.schema
        return record
      }
    ],
    [
      'empty schema',
      record => {
        record.collection[COLLECTION_ID].value.schema = {}
        return record
      }
    ],
    [
      'missing selected view data',
      record => {
        record.collection_query[COLLECTION_ID] = {
          [OTHER_VIEW_ID]: { blockIds: [POST_ID] }
        }
        record.collection_view = {}
        return record
      }
    ],
    [
      'malformed selected query',
      record => {
        record.collection_query[COLLECTION_ID][VIEW_ID] = {}
        return record
      }
    ]
  ])(
    'rejects %s without caching it, then recovers',
    async (_name, malformed) => {
      fetchNotionPageBlocks.mockResolvedValueOnce(malformed(databaseRecord()))

      await expect(
        resolvePostProps({ prefix: 'article', slug: 'test-post' })
      ).rejects.toThrow(/Notion/)
      expect(memoryCache.keys()).toEqual([])

      const props = await resolvePostProps({
        prefix: 'article',
        slug: 'test-post'
      })
      expect(props.post).toMatchObject({
        id: POST_ID,
        title: 'Existing article',
        status: 'Published',
        type: 'Post'
      })
      expect(getPostVisibilityResult(props)).toBeNull()
      expect(
        fetchNotionPageBlocks.mock.calls.filter(([id]) => id === DATABASE_ID)
      ).toHaveLength(2)
    }
  )

  it('propagates thrown source errors through both cache layers', async () => {
    const sourceError = new Error('upstream temporarily unavailable')
    fetchNotionPageBlocks.mockRejectedValueOnce(sourceError)

    await expect(fetchGlobalAllData({})).rejects.toBe(sourceError)
    expect(memoryCache.keys()).toEqual([])
    const recovered = await fetchGlobalAllData({})
    expect(recovered.allPages).toEqual([
      expect.objectContaining({ id: POST_ID, slug: 'article/test-post' })
    ])
  })

  it('rejects a known row that is still missing after the batch fetch', async () => {
    const incomplete = databaseRecord()
    delete incomplete.block[POST_ID]
    fetchNotionPageBlocks.mockResolvedValueOnce(incomplete)

    await expect(getSiteDataByPageId({ pageId: DATABASE_ID })).rejects.toThrow(
      `missing page ${POST_ID}`
    )
    expect(fetchInBatches).toHaveBeenCalledWith([POST_ID])
    expect(memoryCache.keys()).toEqual([])

    const recovered = await getSiteDataByPageId({ pageId: DATABASE_ID })
    expect(recovered.allPages).toEqual([
      expect.objectContaining({ id: POST_ID })
    ])
  })

  it('does not substitute the default site when the requested locale fails', async () => {
    const sourceError = new Error('translated database temporarily unavailable')
    fetchNotionPageBlocks
      .mockResolvedValueOnce(databaseRecord())
      .mockRejectedValueOnce(sourceError)
      .mockResolvedValueOnce(
        databaseRecord({
          databaseId: OTHER_DATABASE_ID,
          title: 'Translated article'
        })
      )
    const request = {
      pageId: `${DATABASE_ID},en:${OTHER_DATABASE_ID}`,
      locale: 'en'
    }

    await expect(fetchGlobalAllData(request)).rejects.toBe(sourceError)
    const recovered = await fetchGlobalAllData(request)
    expect(recovered.allPages[0].title).toBe('Translated article')
    expect(fetchNotionPageBlocks).toHaveBeenCalledTimes(3)
  })

  it('keeps the analyzer placeholder independent of Notion access', async () => {
    BLOG.BUNDLE_ANALYZER = true
    const data = await fetchGlobalAllData({})

    expect(data.allPages[0].slug).toBe('oops')
    expect(fetchNotionPageBlocks).not.toHaveBeenCalled()
    expect(memoryCache.keys()).toEqual([])
  })
})

describe('authoritative empty and unpublished results', () => {
  it('respects an empty filtered view even when other views and page_sort contain posts', async () => {
    const record = databaseRecord()
    record.collection_query[COLLECTION_ID][VIEW_ID] = {
      reducerResults: { collection_group_results: { blockIds: [] } }
    }
    record.collection_query[COLLECTION_ID][OTHER_VIEW_ID] = {
      blockIds: [POST_ID]
    }
    fetchNotionPageBlocks.mockResolvedValue(record)

    const data = await fetchGlobalAllData({})
    expect(data.allPages).toEqual([])
    expect(data.postCount).toBe(0)
    expect(data.siteInfo.title).toBe('Test site')
    expect(fetchInBatches).not.toHaveBeenCalled()
  })

  it.each([{ ids: [] }, { ids: [POST_ID] }])(
    'retains the legacy page_sort fallback for $ids',
    async ({ ids }) => {
      const record = databaseRecord()
      delete record.collection_query
      record.collection_view[VIEW_ID].value.value.page_sort = ids
      fetchNotionPageBlocks.mockResolvedValue(record)

      const data = await fetchGlobalAllData({})
      expect(data.allPages.map(post => post.id)).toEqual(ids)
    }
  )

  it.each([
    { role: 'none' },
    { value: { role: 'none' } },
    { role: 'none', value: {} },
    { value: { value: { role: 'none' } } }
  ])('excludes an explicitly inaccessible row: %j', async deniedRecord => {
    const record = databaseRecord()
    record.collection_query[COLLECTION_ID][VIEW_ID] = {
      blockIds: [POST_ID, PRIVATE_POST_ID]
    }
    record.block[PRIVATE_POST_ID] = deniedRecord
    fetchNotionPageBlocks.mockResolvedValue(record)

    const data = await fetchGlobalAllData({})
    expect(data.allPages.map(post => post.id)).toEqual([POST_ID])
    expect(fetchInBatches).not.toHaveBeenCalled()
  })

  it('excludes a row whose batch response explicitly denies access', async () => {
    const record = databaseRecord()
    record.collection_query[COLLECTION_ID][VIEW_ID] = {
      blockIds: [POST_ID, PRIVATE_POST_ID]
    }
    fetchNotionPageBlocks.mockResolvedValue(record)
    fetchInBatches.mockResolvedValue({ [PRIVATE_POST_ID]: { role: 'none' } })

    const data = await fetchGlobalAllData({})
    expect(data.allPages.map(post => post.id)).toEqual([POST_ID])
    expect(fetchInBatches).toHaveBeenCalledWith([PRIVATE_POST_ID])
  })

  it.each(['Draft', 'Invisible'])(
    'keeps %s articles private with a retryable 404',
    async status => {
      fetchNotionPageBlocks.mockResolvedValue(databaseRecord({ status }))

      const props = await resolvePostProps({
        prefix: 'article',
        slug: 'test-post'
      })
      expect(getPostVisibilityResult(props)).toEqual({
        notFound: true,
        revalidate: 120
      })
      expect(
        await getLegacyUuidRedirect({ segments: ['article', POST_ID] })
      ).toBeNull()
    }
  )

  it('returns a retryable 404 for a missing post and resolves it after publication', async () => {
    const record = databaseRecord()
    record.collection_query[COLLECTION_ID][VIEW_ID] = { blockIds: [] }
    fetchNotionPageBlocks.mockResolvedValueOnce(record)

    const missing = await resolvePostProps({
      prefix: 'article',
      slug: 'test-post'
    })
    expect(missing.post).toBeNull()
    expect(getPostVisibilityResult(missing)).toEqual({
      notFound: true,
      revalidate: 120
    })

    memoryCache.clear()
    const published = await resolvePostProps({
      prefix: 'article',
      slug: 'test-post'
    })
    expect(published.post.id).toBe(POST_ID)
    expect(getPostVisibilityResult(published)).toBeNull()
    expect(
      await getLegacyUuidRedirect({ segments: ['article', POST_ID] })
    ).toEqual({
      destination: '/article/test-post',
      permanent: true
    })
  })

  it('uses the configured numeric string for 404 revalidation', () => {
    expect(
      getPostVisibilityResult({
        post: null,
        NOTION_CONFIG: { NEXT_REVALIDATE_SECOND: '180' }
      })
    ).toEqual({ notFound: true, revalidate: 180 })
  })

  it.each([undefined, false, 0, -1, 1.5, Infinity, 'invalid'])(
    'keeps a finite positive 404 retry interval for %s',
    interval => {
      expect(
        getPostVisibilityResult({
          post: null,
          NOTION_CONFIG: { NEXT_REVALIDATE_SECOND: interval }
        })
      ).toEqual({ notFound: true, revalidate: 60 })
    }
  )

  it('omits revalidation during static export', () => {
    process.env.EXPORT = 'true'
    expect(getPostVisibilityResult({ post: null })).toEqual({ notFound: true })
  })
})
