const PRIORITY_SCORE = {
  必吃: 100,
  N刷: 96,
  三刷: 92,
  推荐: 82,
  可去: 66,
  已吃: 45,
  一般: 35,
  避雷: 0
}

const DEFAULT_VISIBLE_PRIORITIES = new Set(['必吃', 'N刷', '三刷', '推荐'])
const FOOD_TYPES = new Set(['Food', 'Restaurant', 'Shop', 'Place', '美食', '店铺'])

const toNumber = value => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeText = value => String(value || '').trim()

const pick = (item, keys) => {
  for (const key of keys) {
    const value = item?.[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return undefined
}

export const getFoodScore = item => {
  const priorityScore = PRIORITY_SCORE[normalizeText(item.priority)] ?? 50
  const starScore = toNumber(item.stars || item.rating) * 14
  const price = toNumber(item.price)
  const pricePenalty = Math.min(price / 18, 16)
  return Math.round((priorityScore + starScore - pricePenalty) * 10) / 10
}

export const normalizeFoodItem = item => {
  const name = normalizeText(pick(item, ['name', 'title', 'Name', '店名', '名称']))
  const normalized = {
    ...item,
    name,
    displayName:
      normalizeText(pick(item, ['canonical_name', 'canonicalName', '标准店名'])) || name,
    district: normalizeText(pick(item, ['district', 'District', '区', '区域'])) || '未知',
    area: normalizeText(pick(item, ['area', 'Area', '商圈'])),
    cuisine: normalizeText(pick(item, ['cuisine', 'Cuisine', '菜系'])) || '未分类',
    priority: normalizeText(pick(item, ['priority', 'Priority', '推荐等级'])) || '可去',
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

export const sortFoodItems = items => {
  return [...items]
    .map(normalizeFoodItem)
    .sort((a, b) => b.score - a.score || b.stars - a.stars || a.price - b.price)
}

export const getDefaultFoodItems = (items, limit = 10) => {
  return sortFoodItems(items)
    .filter(item => DEFAULT_VISIBLE_PRIORITIES.has(item.priority))
    .slice(0, limit)
}

export const filterFoodItems = (items, filters = {}) => {
  const district = normalizeText(filters.district)
  const cuisine = normalizeText(filters.cuisine)
  const priority = normalizeText(filters.priority)
  const priceRange = normalizeText(filters.priceRange)

  return sortFoodItems(items).filter(item => {
    if (district && item.district !== district) return false
    if (cuisine && item.cuisine !== cuisine) return false
    if (priority && item.priority !== priority) return false

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
    cuisines: unique('cuisine'),
    priorities: unique('priority').sort(
      (a, b) => (PRIORITY_SCORE[b] ?? 0) - (PRIORITY_SCORE[a] ?? 0)
    )
  }
}
