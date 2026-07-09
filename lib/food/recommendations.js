const RECOMMENDATION_SCORE = {
  夯: 100,
  顶级: 88,
  人上人: 70,
  npc: 35,
  拉完了: 0,
  必吃: 100,
  N刷: 96,
  三刷: 92,
  推荐: 82,
  可去: 66,
  已吃: 45,
  一般: 35,
  避雷: 0
}

const LEGACY_STAR_LABELS = {
  5: '夯',
  4: '顶级',
  3: '人上人',
  2: 'npc',
  1: '拉完了'
}

const DEFAULT_VISIBLE_RECOMMENDATIONS = new Set(['夯', '顶级', '人上人'])
const FOOD_TYPES = new Set(['Food', 'Restaurant', 'Shop', 'Place', '美食', '店铺'])
const FOOD_COLLECTION_NAME = '上海美食点位'

const STATUS_PRIORITY = {
  复访: 'N刷',
  必吃: '必吃',
  推荐: '推荐',
  可去: '可去',
  已吃: '已吃',
  一般: '一般',
  避雷: '避雷'
}

const toNumber = value => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeText = value => String(value || '').trim()

const toTextArray = value => {
  if (value == null || value === '') return []
  if (Array.isArray(value)) {
    return value
      .flatMap(item => toTextArray(item))
      .map(item => normalizeText(item))
      .filter(Boolean)
  }
  return String(value)
    .split(/[、,，/|]+/)
    .map(item => normalizeText(item))
    .filter(Boolean)
}

const normalizeRecommendation = value => {
  const text = normalizeText(value)
  if (!text) return ''
  if (RECOMMENDATION_SCORE[text] !== undefined) return text
  const numeric = toNumber(text)
  if (numeric) return LEGACY_STAR_LABELS[Math.max(1, Math.min(Math.round(numeric), 5))] || text
  return text
}

const textFromNotionProperty = value => {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (!Array.isArray(value)) return ''
  return value
    .map(part => {
      if (typeof part === 'string') return part
      if (Array.isArray(part)) return part[0] || ''
      return ''
    })
    .join('')
}

const unwrapValue = entry => entry?.value?.value || entry?.value || entry

const collectionName = collection => textFromNotionProperty(unwrapValue(collection)?.name)

const pick = (item, keys) => {
  for (const key of keys) {
    const value = item?.[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return undefined
}

export const getFoodScore = item => {
  const priorityScore = RECOMMENDATION_SCORE[normalizeText(item.priority)] ?? 0
  const recommendationScore =
    RECOMMENDATION_SCORE[normalizeRecommendation(item.recommendation || item.stars || item.rating)] ?? 50
  const price = toNumber(item.price)
  const pricePenalty = Math.min(price / 18, 16)
  return Math.round((recommendationScore + priorityScore * 0.1 - pricePenalty) * 10) / 10
}

export const normalizeFoodItem = item => {
  const name = normalizeText(pick(item, ['name', 'title', 'Name', '店名', '名称']))
  const rawPriority = normalizeText(pick(item, ['priority', 'Priority', '状态']))
  const rawRecommendation = pick(item, [
    'recommendation',
    'Recommendation',
    '星级',
    '推荐等级',
    'stars',
    'rating',
    'Rating',
    '评分'
  ])
  const cuisines = toTextArray(pick(item, ['cuisines', 'cuisine', 'Cuisine', '菜系']))
  const normalized = {
    ...item,
    name,
    displayName:
      normalizeText(pick(item, ['canonical_name', 'canonicalName', '标准店名'])) || name,
    district: normalizeText(pick(item, ['district', 'District', '区', '区域'])) || '未知',
    area: normalizeText(pick(item, ['area', 'Area', '商圈'])),
    cuisines: cuisines.length ? cuisines : ['未分类'],
    cuisine: cuisines.length ? cuisines.join(' / ') : '未分类',
    priority: STATUS_PRIORITY[rawPriority] || rawPriority || '可去',
    recommendation: normalizeRecommendation(rawRecommendation) || '人上人',
    note: normalizeText(pick(item, ['note', 'comment', 'Comment', '评价', '备注', 'summary'])),
    address: normalizeText(pick(item, ['address', 'Address', '地址'])),
    map_link: normalizeText(pick(item, ['map_link', 'mapUrl', 'Map URL', '地图链接'])),
    price: toNumber(pick(item, ['price', 'Price', '人均', '人均价格'])),
    stars: toNumber(pick(item, ['stars', 'rating', 'Rating', '评分']))
  }
  return {
    ...normalized,
    score: getFoodScore(normalized)
  }
}

export const getFoodItemsFromPages = pages => {
  if (!Array.isArray(pages)) return []

  return pages
    .filter(page => page?.status === 'Published')
    .filter(page => FOOD_TYPES.has(page?.type))
    .map(normalizeFoodItem)
    .filter(item => item.name)
}

export const getFoodItemsFromBlockMap = (blockMap, targetCollectionName = FOOD_COLLECTION_NAME) => {
  const collections = blockMap?.collection || {}
  const blocks = blockMap?.block || {}
  const collectionQuery = blockMap?.collection_query || {}
  const collectionEntry = Object.entries(collections).find(
    ([, collection]) => collectionName(collection) === targetCollectionName
  )

  if (!collectionEntry) return []

  const [collectionId, collection] = collectionEntry
  const schema = unwrapValue(collection)?.schema || {}
  const propNamesByKey = Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [key, value?.name]).filter(([, name]) => name)
  )
  const queryIds = Object.values(collectionQuery?.[collectionId] || {})
    .flatMap(query => query?.collection_group_results?.blockIds || [])
  const fallbackIds = Object.entries(blocks)
    .filter(([, block]) => unwrapValue(block)?.parent_id === collectionId)
    .map(([id]) => id)
  const rowIds = [...new Set([...queryIds, ...fallbackIds])]

  return rowIds
    .map(id => unwrapValue(blocks[id]))
    .filter(row => row?.properties)
    .map(row => {
      const item = { id: row.id }
      Object.entries(row.properties || {}).forEach(([propKey, propValue]) => {
        const propName = propNamesByKey[propKey]
        if (propName) item[propName] = textFromNotionProperty(propValue)
      })
      return normalizeFoodItem(item)
    })
    .filter(item => item.name)
}

export const sortFoodItems = items => {
  return [...items]
    .map(normalizeFoodItem)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (RECOMMENDATION_SCORE[b.recommendation] ?? 0) -
          (RECOMMENDATION_SCORE[a.recommendation] ?? 0) ||
        a.price - b.price
    )
}

export const getDefaultFoodItems = (items, limit = 10) => {
  return sortFoodItems(items)
    .filter(item => DEFAULT_VISIBLE_RECOMMENDATIONS.has(item.recommendation))
    .slice(0, limit)
}

export const filterFoodItems = (items, filters = {}) => {
  const district = normalizeText(filters.district)
  const cuisine = normalizeText(filters.cuisine)
  const priority = normalizeText(filters.priority)
  const priceRange = normalizeText(filters.priceRange)

  return sortFoodItems(items).filter(item => {
    if (district && item.district !== district) return false
    if (cuisine && !item.cuisines.includes(cuisine)) return false
    if (priority && item.recommendation !== priority) return false

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number)
      if (Number.isFinite(min) && item.price < min) return false
      if (Number.isFinite(max) && item.price > max) return false
    }

    return true
  })
}

export const getFoodOptions = items => {
  const normalized = items.map(normalizeFoodItem)
  const unique = key => [...new Set(normalized.map(item => item[key]).filter(Boolean))]
  return {
    districts: unique('district'),
    cuisines: [...new Set(normalized.flatMap(item => item.cuisines).filter(Boolean))],
    priorities: unique('recommendation').sort(
      (a, b) => (RECOMMENDATION_SCORE[b] ?? 0) - (RECOMMENDATION_SCORE[a] ?? 0)
    )
  }
}
