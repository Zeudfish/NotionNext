import {
  filterFoodItems,
  getDefaultFoodItems,
  getFoodItemsFromBlockMap,
  getFoodItemsFromPages,
  getFoodOptions,
  sortFoodItems
} from '@/lib/food/recommendations'

const items = [
  { name: '一般店', district: '静安', cuisine: '本帮菜', price: '80', priority: '已吃', recommendation: 'npc' },
  { name: '复刷店', district: '闵行', cuisine: ['重庆菜', '火锅'], price: '100', priority: '复访', recommendation: '夯' },
  { name: '顶级店', district: '静安', cuisine: '火锅', price: '200', priority: '复访', recommendation: '顶级' },
  { name: '避雷店', district: '静安', cuisine: '西餐', price: '120', priority: '避雷', recommendation: '拉完了' }
]

describe('food recommendations', () => {
  it('sorts by recommendation score without mutating input', () => {
    const sorted = sortFoodItems(items)

    expect(sorted.map(item => item.name)).toEqual(['复刷店', '顶级店', '一般店', '避雷店'])
    expect(items.map(item => item.price)).toEqual(['80', '100', '200', '120'])
  })

  it('uses recommended stores for the default top list', () => {
    const defaults = getDefaultFoodItems(items, 10)

    expect(defaults.map(item => item.name)).toEqual(['复刷店', '顶级店'])
  })

  it('filters by district, multi cuisine, recommendation level and price range', () => {
    const filtered = filterFoodItems(items, {
      district: '闵行',
      cuisine: '火锅',
      priority: '夯',
      priceRange: '80-150'
    })

    expect(filtered).toHaveLength(1)
    expect(filtered[0].name).toBe('复刷店')
    expect(filtered[0].cuisine).toBe('重庆菜 / 火锅')
  })

  it('builds unique filter options from multi-select cuisines and recommendation levels', () => {
    expect(getFoodOptions(items)).toEqual({
      districts: ['静安', '闵行'],
      cuisines: ['本帮菜', '重庆菜', '火锅', '西餐'],
      priorities: ['夯', '顶级', 'npc', '拉完了']
    })
  })

  it('extracts published food rows from Notion pages', () => {
    const pages = [
      {
        title: 'Notion 店',
        type: 'Food',
        status: 'Published',
        区域: '徐汇',
        菜系: ['日料', '自助'],
        人均: '180',
        状态: '复访',
        星级: '顶级',
        评价: '适合约饭'
      },
      { title: '草稿店', type: 'Food', status: 'Invisible' },
      { title: '文章', type: 'Post', status: 'Published' }
    ]

    expect(getFoodItemsFromPages(pages)).toEqual([
      expect.objectContaining({
        name: 'Notion 店',
        district: '徐汇',
        cuisine: '日料 / 自助',
        cuisines: ['日料', '自助'],
        price: 180,
        priority: 'N刷',
        recommendation: '顶级',
        note: '适合约饭'
      })
    ])
  })

  it('extracts rows from the embedded Shanghai food Notion collection', () => {
    const blockMap = {
      collection: {
        foodCollection: {
          value: {
            name: [['上海美食点位']],
            schema: {
              title: { name: 'Name' },
              area: { name: '区域' },
              cuisine: { name: '菜系' },
              status: { name: '状态' },
              stars: { name: '星级' },
              price: { name: '人均' },
              note: { name: '备注' },
              address: { name: '地址' },
              map: { name: '地图链接' }
            }
          }
        }
      },
      collection_query: {
        foodCollection: {
          view: {
            collection_group_results: {
              blockIds: ['row1', 'row2']
            }
          }
        }
      },
      block: {
        row1: {
          value: {
            id: 'row1',
            parent_id: 'foodCollection',
            properties: {
              title: [['龙门阵']],
              area: [['闵行']],
              cuisine: [['重庆菜、火锅']],
              status: [['复访']],
              stars: [['夯']],
              price: [['100']],
              note: [['尖椒肥肠鸡绝绝子']],
              address: [['龙茗路2781号']],
              map: [['https://uri.amap.com/marker', [['a', 'https://uri.amap.com/marker']]]]
            }
          }
        },
        row2: { value: { id: 'row2', parent_id: 'foodCollection' } }
      }
    }

    expect(getFoodItemsFromBlockMap(blockMap)).toEqual([
      expect.objectContaining({
        name: '龙门阵',
        district: '闵行',
        cuisine: '重庆菜 / 火锅',
        cuisines: ['重庆菜', '火锅'],
        priority: 'N刷',
        recommendation: '夯',
        price: 100,
        note: '尖椒肥肠鸡绝绝子'
      })
    ])
  })
})
