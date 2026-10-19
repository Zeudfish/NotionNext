import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { isExport } from '@/lib/utils/buildMode'
import {
  isExternalOrActionSlug,
  isPublishedContentPage,
  isUuidLike,
  normalizeUuid,
  resolveMigratedPath
} from '@/lib/site/publication'

export async function getLegacyUuidRedirect({ segments, locale }) {
  const pathSegments = (segments || []).filter(Boolean)
  const legacyId = pathSegments.at(-1)

  if (!isUuidLike(legacyId)) return null

  const { allPages = [] } = await fetchGlobalAllData({
    from: `uuid-redirect-${legacyId}`,
    locale
  })
  const normalizedLegacyId = normalizeUuid(legacyId)
  const page = allPages.find(
    item =>
      isPublishedContentPage(item) &&
      normalizeUuid(item?.id) === normalizedLegacyId
  )

  if (!page || isExternalOrActionSlug(page.slug)) return null

  return {
    destination: resolveMigratedPath(page.slug),
    permanent: true
  }
}

export function getPostVisibilityResult(props) {
  if (!isPublishedContentPage(props?.post)) {
    if (isExport()) return { notFound: true }

    const interval = siteConfig(
      'NEXT_REVALIDATE_SECOND',
      BLOG.NEXT_REVALIDATE_SECOND,
      props?.NOTION_CONFIG
    )
    return {
      notFound: true,
      // Missing/draft pages can be published later; do not cache their 404 forever.
      revalidate: Number.isInteger(interval) && interval > 0 ? interval : 60
    }
  }
  return null
}
