import Head from 'next/head'
import { useRouter } from 'next/router'
import { siteConfig } from '@/lib/config'
import {
  getCanonicalPathForPage,
  isIndexableContentPage,
  normalizePathname,
  resolveMigratedPath
} from '@/lib/site/publication'

const INDEX_ROBOTS =
  'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'

const buildCanonicalUrl = (baseUrl, pathname) => {
  const base = String(baseUrl || '').replace(/\/+$/, '')
  if (!base) return null
  return pathname === '/' ? `${base}/` : `${base}${pathname}`
}

const hasIndexableCategoryContent = pageProps => {
  const postCount = Number(pageProps?.postCount)
  const hasPosts = Number.isFinite(postCount)
    ? postCount > 0
    : Array.isArray(pageProps?.posts) && pageProps.posts.length > 0
  const hasIntroduction = Boolean(
    String(pageProps?.categoryDescription || '').trim()
  )
  return hasPosts && hasIntroduction
}

const IndexingPolicy = pageProps => {
  const router = useRouter()
  const pathname = normalizePathname(router.asPath)
  const route = String(router.route || '')
  const post = pageProps?.post
  const isSearch = pathname === '/search' || pathname.startsWith('/search/')
  const isNotFound = route === '/404' || pathname === '/404'
  const isNonIndexableContent = Boolean(post) && !isIndexableContentPage(post)
  const isCategoryIndex = pathname === '/category'
  const isCategoryRoute =
    route.startsWith('/category/') || pathname.startsWith('/category/')
  const isCategoryPagination =
    isCategoryRoute && pageProps?.page !== undefined && pageProps?.page !== null
  const isNonIndexableCategory =
    isCategoryRoute &&
    (isCategoryPagination || !hasIndexableCategoryContent(pageProps))
  const noIndex =
    isSearch ||
    isNotFound ||
    isNonIndexableContent ||
    isCategoryIndex ||
    isNonIndexableCategory
  const robots = isNotFound
    ? 'noindex, nofollow'
    : noIndex
      ? 'noindex, follow'
      : INDEX_ROBOTS
  const canonicalPath = noIndex
    ? null
    : post
      ? getCanonicalPathForPage(post)
      : resolveMigratedPath(pathname)
  const link = siteConfig(
    'LINK',
    pageProps?.siteInfo?.link,
    pageProps?.NOTION_CONFIG
  )
  const canonicalUrl = canonicalPath
    ? buildCanonicalUrl(link, canonicalPath)
    : null

  return (
    <Head>
      <meta key='robots' name='robots' content={robots} />
      {canonicalUrl && (
        <>
          <link key='canonical' rel='canonical' href={canonicalUrl} />
          <meta key='og:url' property='og:url' content={canonicalUrl} />
        </>
      )}
    </Head>
  )
}

export default IndexingPolicy
