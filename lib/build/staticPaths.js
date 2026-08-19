import BLOG from '@/blog.config'
import { getOrSetDataWithCache } from '@/lib/cache/cache_manager'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { getPriorityPages, prefetchAllBlockMaps } from '@/lib/build/prefetch'
import { isExport } from '@/lib/utils/buildMode'
import { assertBuildContentIsValid } from '@/lib/site/buildContentGuard'
import { isPublishedRoutePage } from '@/lib/site/publication'

const inProcessAllPagesPromises = new Map()

function getStaticPathsCacheKey({ pageId = BLOG.NOTION_PAGE_ID, locale }) {
  const safePageId = String(pageId || BLOG.NOTION_PAGE_ID).replace(
    /[^a-z0-9,_:-]/gi,
    '_'
  )
  const safeLocale = String(locale || 'default').replace(/[^a-z0-9_-]/gi, '_')
  return `build_static_paths_all_pages_${safeLocale}_${safePageId}`
}

export function getSharedAllPages({
  from = 'slug-paths',
  pageId = BLOG.NOTION_PAGE_ID,
  locale
} = {}) {
  const cacheKey = getStaticPathsCacheKey({ pageId, locale })

  if (!inProcessAllPagesPromises.has(cacheKey)) {
    const promise = getOrSetDataWithCache(cacheKey, async () => {
      const { allPages = [] } = await fetchGlobalAllData({
        pageId,
        from,
        locale
      })
      return Array.isArray(allPages) ? allPages : []
    })
    promise.catch(() => {
      inProcessAllPagesPromises.delete(cacheKey)
    })
    inProcessAllPagesPromises.set(cacheKey, promise)
  }

  return inProcessAllPagesPromises.get(cacheKey)
}

export async function getStaticPathsBase({
  filterFn = () => true,
  mapPageToParams,
  from = 'slug-paths',
  pageId = BLOG.NOTION_PAGE_ID,
  locale
}) {
  await assertBuildContentIsValid({ pageId, from: `${from}-validation` })

  const allPages = await getSharedAllPages({ from, pageId, locale })
  const publishedPages = allPages.filter(isPublishedRoutePage)

  if (isExport()) {
    await prefetchAllBlockMaps(publishedPages)
    return {
      paths: publishedPages.filter(filterFn).map(mapPageToParams),
      fallback: false
    }
  }

  const priorityPages = getPriorityPages(publishedPages) || []
  return {
    paths: priorityPages.filter(filterFn).map(mapPageToParams),
    fallback: 'blocking'
  }
}
