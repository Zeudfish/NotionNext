jest.mock('@/lib/db/SiteDataApi', () => ({ fetchGlobalAllData: jest.fn() }))
jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  fetchNotionPageBlocks: jest.fn()
}))
jest.mock('@/lib/global', () => ({ getGlobalSnapshot: () => ({}) }))

import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { fetchNotionPageBlocks } from '@/lib/db/notion/getPostBlocks'
import { getStaticProps } from '@/pages/food'

const originalApiKey = process.env.NOTION_API_KEY
const privatePost = {
  id: 'draft-post',
  title: 'PRIVATE-POST-SENTINEL',
  type: 'Post',
  status: 'Draft'
}

function siteData(allPages) {
  return {
    siteInfo: {
      title: 'Zeurd',
      description: '工作、研究与生活',
      pageCover: '/site-cover.jpg'
    },
    NOTION_CONFIG: { TITLE: 'Zeurd', LINK: 'https://www.zeurd.com' },
    customNav: [{ name: '上海美食', href: '/food' }],
    customMenu: [{ name: '历史归档', href: '/archive' }],
    allNavPages: [{ id: 'food-page', title: '上海美食', slug: 'food' }],
    allLinkPages: [{ id: 'github', slug: 'https://github.com/Zeudfish' }],
    categoryOptions: [{ name: '金融思考', count: 2 }],
    tagOptions: [{ name: '思考', count: 4 }],
    allPages
  }
}

async function buildFoodPage(pages) {
  const data = siteData(pages)
  const sharedProps = { ...data }
  delete sharedProps.allPages
  fetchGlobalAllData.mockResolvedValueOnce(data)

  const result = await getStaticProps({ locale: 'zh-CN' })

  expect(fetchGlobalAllData).toHaveBeenCalledWith({
    from: 'food',
    locale: 'zh-CN'
  })
  // The shared layout and SEO still need all public site and navigation data.
  expect(result.props).toMatchObject(sharedProps)
  expect(result.props).not.toHaveProperty('allPages')
  expect(JSON.stringify(result.props)).not.toContain('PRIVATE-POST-SENTINEL')
  expect(result.revalidate).toBe(60)
  return result.props
}

beforeEach(() => {
  delete process.env.NOTION_API_KEY
  fetchGlobalAllData.mockReset()
  fetchNotionPageBlocks.mockReset()
  fetch.mockReset()
})

afterEach(() => {
  if (originalApiKey === undefined) delete process.env.NOTION_API_KEY
  else process.env.NOTION_API_KEY = originalApiKey
})

describe('food page static props', () => {
  it('retains site props while extracting only published food rows and building the recommendations', async () => {
    const props = await buildFoodPage([
      { title: '普通文章', type: 'Post', status: 'Published' },
      {
        title: '一般小馆',
        type: 'Restaurant',
        status: 'Published',
        区域: '静安',
        菜系: '本帮菜',
        人均: '80',
        星级: 'npc'
      },
      {
        title: '顶级日料',
        type: 'Food',
        status: 'Published',
        区域: '徐汇',
        菜系: '日料',
        人均: '180',
        星级: '顶级'
      },
      {
        title: '复刷火锅',
        type: 'Food',
        status: 'Published',
        区域: '闵行',
        菜系: ['重庆菜', '火锅'],
        人均: '100',
        状态: '复访',
        星级: '夯'
      },
      { title: 'PRIVATE-FOOD-SENTINEL', type: 'Food', status: 'Draft', 星级: '夯' },
      privatePost
    ])

    expect(props.allItems.map(item => item.name)).toEqual([
      '复刷火锅', '顶级日料', '一般小馆'
    ])
    expect(props.allItems[0]).toMatchObject({
      price: 100,
      cuisines: ['重庆菜', '火锅'],
      priority: 'N刷',
      recommendation: '夯'
    })
    expect(props.defaultItems.map(item => item.name)).toEqual(['复刷火锅', '顶级日料'])
    expect(props.options).toEqual({
      districts: ['闵行', '徐汇', '静安'],
      cuisines: ['重庆菜', '火锅', '日料', '本帮菜'],
      priorities: ['夯', '顶级', 'npc']
    })
    expect(JSON.stringify(props)).not.toContain('PRIVATE-FOOD-SENTINEL')
    expect(fetch).not.toHaveBeenCalled()
    expect(fetchNotionPageBlocks).not.toHaveBeenCalled()
  })

  it('retains site props when food comes from the Notion API fallback', async () => {
    process.env.NOTION_API_KEY = 'food-regression-test-token'
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        results: [{
          properties: {
            Name: { type: 'title', title: [{ plain_text: 'API 火锅店' }] },
            区域: { type: 'select', select: { name: '闵行' } },
            菜系: { type: 'multi_select', multi_select: [{ name: '火锅' }] },
            星级: { type: 'select', select: { name: '顶级' } },
            人均: { type: 'number', number: 120 }
          }
        }],
        has_more: false
      })
    })

    const props = await buildFoodPage([privatePost])

    expect(props.allItems).toEqual([
      expect.objectContaining({ name: 'API 火锅店', price: 120, recommendation: '顶级' })
    ])
    expect(props.defaultItems.map(item => item.name)).toEqual(['API 火锅店'])
    expect(props.options).toEqual({
      districts: ['闵行'], cuisines: ['火锅'], priorities: ['顶级']
    })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetchNotionPageBlocks).not.toHaveBeenCalled()
  })

  it('retains site props when food comes from the embedded collection fallback', async () => {
    fetchNotionPageBlocks.mockResolvedValueOnce({
      collection: {
        food: {
          value: {
            name: [['上海美食点位']],
            schema: {
              title: { name: 'Name' },
              district: { name: '区域' },
              cuisine: { name: '菜系' },
              rating: { name: '星级' },
              price: { name: '人均' }
            }
          }
        }
      },
      collection_query: {
        food: { view: { collection_group_results: { blockIds: ['restaurant'] } } }
      },
      block: {
        restaurant: {
          value: {
            id: 'restaurant',
            parent_id: 'food',
            properties: {
              title: [['点位本帮菜']],
              district: [['静安']],
              cuisine: [['本帮菜']],
              rating: [['人上人']],
              price: [['90']]
            }
          }
        }
      }
    })

    const props = await buildFoodPage([privatePost])

    expect(props.allItems).toEqual([
      expect.objectContaining({ name: '点位本帮菜', price: 90, recommendation: '人上人' })
    ])
    expect(props.defaultItems.map(item => item.name)).toEqual(['点位本帮菜'])
    expect(props.options).toEqual({
      districts: ['静安'], cuisines: ['本帮菜'], priorities: ['人上人']
    })
    expect(fetchNotionPageBlocks).toHaveBeenCalledTimes(1)
    expect(fetch).not.toHaveBeenCalled()
  })
})
