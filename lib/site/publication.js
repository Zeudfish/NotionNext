import CATEGORY_INTRODUCTIONS from '@/conf/category-introductions.json'
import URL_MIGRATIONS from '@/conf/url-migrations.json'

const PUBLIC_CONTENT_TYPES = new Set(['Post', 'Page'])
const NON_ROUTE_TYPES = new Set(['Menu', 'SubMenu', 'Config', 'Notice'])
const EXCLUDED_INDEX_PREFIXES = [
  '/404',
  '/api',
  '/archive',
  '/rss',
  '/search',
  '/tag'
]

export function normalizePathname(value = '/') {
  const raw = String(value || '/')
    .split('?')[0]
    .split('#')[0]
    .trim()
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, '/')
  return collapsed.length > 1 ? collapsed.replace(/\/+$/, '') : '/'
}

export function normalizeRouteSlug(value = '') {
  return normalizePathname(value).replace(/^\//, '')
}

export function isExternalOrActionSlug(value) {
  const slug = String(value || '').trim().toLowerCase()
  return (
    !slug ||
    slug === '#' ||
    slug.startsWith('http://') ||
    slug.startsWith('https://') ||
    slug.startsWith('mailto:') ||
    slug.startsWith('tel:')
  )
}

export function isPublishedRoutePage(page) {
  return (
    page?.status === 'Published' &&
    Boolean(page?.type) &&
    !NON_ROUTE_TYPES.has(page.type)
  )
}

export function isPublishedContentPage(page) {
  return (
    page?.status === 'Published' && PUBLIC_CONTENT_TYPES.has(page?.type)
  )
}

export function resolveMigratedPath(value) {
  let path = normalizePathname(value)
  const visited = new Set()

  while (URL_MIGRATIONS[path] && !visited.has(path)) {
    visited.add(path)
    path = normalizePathname(URL_MIGRATIONS[path])
  }

  return path
}

export function isIndexableContentPage(page) {
  if (!isPublishedContentPage(page) || isExternalOrActionSlug(page?.slug)) {
    return false
  }

  const canonicalPath = resolveMigratedPath(page.slug)
  return !EXCLUDED_INDEX_PREFIXES.some(
    prefix => canonicalPath === prefix || canonicalPath.startsWith(`${prefix}/`)
  )
}

export function getCanonicalPathForPage(page) {
  if (!isIndexableContentPage(page)) return null
  return resolveMigratedPath(page.slug)
}

export function getCategoryIntroduction(category) {
  const name = String(category || '').trim()
  return CATEGORY_INTRODUCTIONS[name] || ''
}

export function getPublishedCategoryNames(allPages) {
  const categories = new Set()

  for (const page of allPages || []) {
    if (
      page?.type === 'Post' &&
      page?.status === 'Published' &&
      typeof page?.category === 'string' &&
      page.category.trim()
    ) {
      categories.add(page.category.trim())
    }
  }

  return Array.from(categories)
}

export function getIndexableCategoryNames(allPages) {
  return getPublishedCategoryNames(allPages).filter(category =>
    Boolean(getCategoryIntroduction(category))
  )
}

export function normalizeUuid(value) {
  return String(value || '')
    .replace(/-/g, '')
    .toLowerCase()
}

export function isUuidLike(value) {
  return /^[a-f0-9]{32}$/i.test(normalizeUuid(value))
}
