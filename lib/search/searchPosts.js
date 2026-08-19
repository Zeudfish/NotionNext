import { getDataFromCache } from '@/lib/cache/cache_manager'
import { getPageContentText } from '@/lib/db/notion/getPageContentText'
import { getPageBlockCacheKey } from '@/lib/db/notion/getPostBlocks'

const normalizeText = value => {
  if (Array.isArray(value)) return value.map(normalizeText).filter(Boolean).join(' ')
  if (value && typeof value === 'object') {
    return normalizeText(value.name || value.title || value.label || '')
  }
  return value == null ? '' : String(value)
}

export const normalizeSearchKeyword = value => {
  const rawValue = Array.isArray(value) ? value[0] : value
  const text = String(rawValue || '')
  try {
    return decodeURIComponent(text).trim()
  } catch (error) {
    return text.trim()
  }
}

const createExcerpt = (text, keyword, radius = 88) => {
  const source = normalizeText(text).replace(/\s+/g, ' ').trim()
  if (!source) return ''

  const index = source.toLowerCase().indexOf(keyword.toLowerCase())
  if (index < 0) return source.slice(0, radius * 2)

  const start = Math.max(0, index - radius)
  const end = Math.min(source.length, index + keyword.length + radius)
  return `${start > 0 ? '…' : ''}${source.slice(start, end)}${end < source.length ? '…' : ''}`
}

const findFirstHit = (candidates, keyword) => {
  const needle = keyword.toLowerCase()
  for (const candidate of candidates) {
    const text = normalizeText(candidate.text)
    if (text.toLowerCase().includes(needle)) {
      return {
        ...candidate,
        text
      }
    }
  }
  return null
}

const getBodyText = async post => {
  try {
    const cacheKey = getPageBlockCacheKey(post.id, post.lastEditedDate)
    const pageBlockMap = await getDataFromCache(cacheKey, true)
    if (!pageBlockMap) return ''
    return getPageContentText(post, pageBlockMap) || ''
  } catch (error) {
    console.warn('[search] failed to read cached page content:', post?.id, error)
    return ''
  }
}

export async function searchPublishedPosts(allPosts = [], rawKeyword) {
  const keyword = normalizeSearchKeyword(rawKeyword)
  if (!keyword) return []

  const matches = []

  for (let index = 0; index < allPosts.length; index++) {
    const post = allPosts[index]
    const metadataCandidates = [
      { source: '标题', score: 100, text: post?.title },
      { source: '摘要', score: 70, text: post?.summary },
      { source: '分类', score: 45, text: post?.category },
      { source: '标签', score: 35, text: post?.tags }
    ]

    let hit = findFirstHit(metadataCandidates, keyword)
    if (!hit) {
      const bodyText = await getBodyText(post)
      hit = findFirstHit(
        [{ source: '正文', score: 25, text: bodyText }],
        keyword
      )
    }

    if (!hit) continue

    const searchHit = createExcerpt(hit.text, keyword)
    matches.push({
      ...post,
      searchHit,
      searchMatchSource: hit.source,
      results: searchHit ? [searchHit] : [],
      _searchScore: hit.score,
      _searchOrder: index
    })
  }

  return matches
    .sort(
      (left, right) =>
        right._searchScore - left._searchScore ||
        left._searchOrder - right._searchOrder
    )
    .map(({ _searchScore, _searchOrder, ...post }) => post)
}
