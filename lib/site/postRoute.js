import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
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
    return { notFound: true }
  }
  return null
}
