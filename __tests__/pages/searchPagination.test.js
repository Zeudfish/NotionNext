jest.mock('@/blog.config', () => ({
  ...jest.requireActual('@/blog.config'),
  NEXT_REVALIDATE_SECOND: 60
}))
jest.mock('@/lib/global', () => ({ getGlobalSnapshot: () => ({}) }))
jest.mock('@/themes/theme', () => ({ DynamicLayout: () => null }))
jest.mock('@/lib/db/SiteDataApi', () => ({ fetchGlobalAllData: jest.fn() }))
jest.mock('@/lib/cache/cache_manager', () => ({
  getDataFromCache: jest.fn().mockResolvedValue(null)
}))
jest.mock('@/lib/db/notion/getPageContentText', () => ({
  getPageContentText: jest.fn()
}))
jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  getPageBlockCacheKey: id => `page_block_${id}`
}))

import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { getStaticProps } from '@/pages/search/[keyword]/page/[page]'

const originalExport = process.env.EXPORT
const request = {
  params: { keyword: encodeURIComponent('量化'), page: '2' },
  locale: 'zh-CN'
}

function siteData(count, interval = 90) {
  return {
    NOTION_CONFIG: {
      POSTS_PER_PAGE: 2,
      NEXT_REVALIDATE_SECOND: interval
    },
    allPages: [
      ...Array.from({ length: count }, (_, index) => ({
        id: `post-${index + 1}`,
        title: `量化研究 ${index + 1}`,
        slug: `article/post-${index + 1}`,
        type: 'Post',
        status: 'Published'
      })),
      {
        id: 'draft',
        title: '量化草稿',
        type: 'Post',
        status: 'Draft'
      }
    ]
  }
}

beforeEach(() => {
  delete process.env.EXPORT
  fetchGlobalAllData.mockReset()
  fetchGlobalAllData.mockImplementation(() => Promise.resolve(siteData(2)))
})

afterEach(() => {
  if (originalExport === undefined) delete process.env.EXPORT
  else process.env.EXPORT = originalExport
})

describe('search pagination revalidation', () => {
  it('allows an out-of-range URL to recover when published results grow', async () => {
    const missing = await getStaticProps(request)
    expect(missing).toEqual({ notFound: true, revalidate: 90 })

    // ISR must be allowed to call this same URL again after the interval.
    fetchGlobalAllData.mockResolvedValueOnce(siteData(3))
    const recovered = await getStaticProps(request)

    expect(recovered.notFound).toBeUndefined()
    expect(recovered.revalidate).toBe(90)
    expect(recovered.props).toMatchObject({
      page: 2,
      keyword: '量化',
      postCount: 3,
      posts: [expect.objectContaining({ id: 'post-3', status: 'Published' })]
    })
    expect(recovered.props.allPages).toBeUndefined()
    expect(fetchGlobalAllData).toHaveBeenLastCalledWith({
      from: 'search-props',
      locale: 'zh-CN'
    })
  })

  it.each(['0', '-1', '1.5', 'not-a-page'])(
    'keeps the invalid page number %s as a stable 404',
    async page => {
      expect(
        await getStaticProps({
          ...request,
          params: { ...request.params, page }
        })
      ).toEqual({ notFound: true })
      expect(fetchGlobalAllData).not.toHaveBeenCalled()
    }
  )

  it('accepts a configured numeric string for the temporary 404', async () => {
    fetchGlobalAllData.mockResolvedValueOnce(siteData(2, '180'))
    expect(await getStaticProps(request)).toEqual({
      notFound: true,
      revalidate: 180
    })
  })

  it.each([null, false, 0, -1, 1.5, Infinity, 'invalid'])(
    'uses a positive fallback for an invalid interval: %s',
    async interval => {
      fetchGlobalAllData.mockResolvedValueOnce(siteData(2, interval))
      expect(await getStaticProps(request)).toEqual({
        notFound: true,
        revalidate: 60
      })
    }
  )

  it('omits revalidation for an out-of-range page during static export', async () => {
    process.env.EXPORT = 'true'
    expect(await getStaticProps(request)).toEqual({ notFound: true })
  })

  it('treats EXPORT=false as a dynamic site for the temporary 404', async () => {
    process.env.EXPORT = 'false'
    expect(await getStaticProps(request)).toEqual({
      notFound: true,
      revalidate: 90
    })
  })

  it('retains the first page as a normal empty result', async () => {
    fetchGlobalAllData.mockResolvedValueOnce(siteData(0))
    const result = await getStaticProps({
      ...request,
      params: { ...request.params, page: '1' }
    })
    expect(result.notFound).toBeUndefined()
    expect(result.props).toMatchObject({ page: 1, postCount: 0, posts: [] })
  })

  it('does not turn an upstream error into a missing result page', async () => {
    const sourceError = new Error('Notion temporarily unavailable')
    fetchGlobalAllData.mockRejectedValueOnce(sourceError)
    await expect(getStaticProps(request)).rejects.toBe(sourceError)
  })
})
