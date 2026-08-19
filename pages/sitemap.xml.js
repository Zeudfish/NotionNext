// pages/sitemap.xml.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import {
  getCanonicalPathForPage,
  getPublishedCategoryNames,
  isIndexableContentPage
} from '@/lib/site/publication'
import {
  buildSitemapLoc,
  normalizeSitemapBaseUrl,
  normalizeSitemapLocale,
  toSitemapDateString
} from '@/lib/sitemap-utils'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'
import { getServerSideSitemap } from 'next-sitemap'

const EXPLICIT_PUBLIC_ROUTES = ['food']

export const getServerSideProps = async ctx => {
  let fields = []
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')

  for (let index = 0; index < siteIds.length; index++) {
    const siteId = siteIds[index]
    const id = extractLangId(siteId)
    const locale = extractLangPrefix(siteId)
    const siteData = await fetchGlobalAllData({
      pageId: id,
      from: 'sitemap.xml'
    })
    const link = siteConfig(
      'LINK',
      siteData?.siteInfo?.link,
      siteData.NOTION_CONFIG
    )
    const localeFields = generateLocalesSitemap(
      link,
      siteData.allPages,
      locale
    )
    fields = fields.concat(localeFields)
  }

  fields = getUniqueFields(fields)

  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  return getServerSideSitemap(ctx, fields)
}

function generateLocalesSitemap(link, allPages = [], locale) {
  const normalizedLink = normalizeSitemapBaseUrl(link)
  const normalizedLocale = normalizeSitemapLocale(locale)
  const dateNow = toSitemapDateString(new Date())

  const defaultFields = [
    {
      loc: buildSitemapLoc({ baseUrl: normalizedLink, locale: normalizedLocale }),
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.8'
    },
    ...EXPLICIT_PUBLIC_ROUTES.map(slug => ({
      loc: buildSitemapLoc({
        baseUrl: normalizedLink,
        locale: normalizedLocale,
        slug
      }),
      lastmod: dateNow,
      changefreq: 'weekly',
      priority: '0.7'
    }))
  ].filter(field => Boolean(field?.loc))

  const categoryFields = getPublishedCategoryNames(allPages)
    .map(category => ({
      loc: buildSitemapLoc({
        baseUrl: normalizedLink,
        locale: normalizedLocale,
        slug: `category/${encodeURIComponent(category)}`
      }),
      lastmod: dateNow,
      changefreq: 'weekly',
      priority: '0.6'
    }))
    .filter(field => Boolean(field?.loc))

  const contentFields = allPages
    .filter(isIndexableContentPage)
    .map(page => {
      const canonicalPath = getCanonicalPathForPage(page)
      const loc = buildSitemapLoc({
        baseUrl: normalizedLink,
        locale: normalizedLocale,
        slug: canonicalPath?.replace(/^\//, '')
      })
      if (!loc) return null

      return {
        loc,
        lastmod: toSitemapDateString(
          page?.lastEditedDay || page?.publishDay,
          dateNow
        ),
        changefreq: 'weekly',
        priority: page?.type === 'Post' ? '0.7' : '0.6'
      }
    })
    .filter(Boolean)

  return defaultFields.concat(categoryFields, contentFields)
}

function getUniqueFields(fields) {
  const uniqueFieldsMap = new Map()

  fields.forEach(field => {
    const existingField = uniqueFieldsMap.get(field.loc)

    if (
      !existingField ||
      new Date(field.lastmod) > new Date(existingField.lastmod)
    ) {
      uniqueFieldsMap.set(field.loc, field)
    }
  })

  return Array.from(uniqueFieldsMap.values())
}

export default () => {}
