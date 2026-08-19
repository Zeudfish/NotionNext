import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { resolvePostProps } from '@/lib/db/SiteDataApi'
import Slug from '..'
import { getStaticPathsBase } from '@/lib/build/staticPaths'
import { isExport } from '@/lib/utils/buildMode'
import { checkSlugHasOneSlash } from '@/lib/utils/post'
import {
  getLegacyUuidRedirect,
  getPostVisibilityResult
} from '@/lib/site/postRoute'

const isStaticExport = process.env.EXPORT === 'true'

/**
 * 根据notion的slug访问页面
 * 解析二级目录 /article/about
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}

export async function getStaticPaths() {
  return getStaticPathsBase({
    from: 'slug-paths',
    filterFn: row => checkSlugHasOneSlash(row),
    mapPageToParams: row => ({
      params: {
        prefix: row.slug.split('/')[0],
        slug: row.slug.split('/')[1]
      }
    })
  })
}

export async function getStaticProps({ params: { prefix, slug }, locale }) {
  const uuidRedirect = await getLegacyUuidRedirect({
    segments: [prefix, slug],
    locale
  })
  if (uuidRedirect) return { redirect: uuidRedirect }

  const props = await resolvePostProps({
    prefix,
    slug,
    locale
  })
  const visibilityResult = getPostVisibilityResult(props)
  if (visibilityResult) return visibilityResult

  return {
    props,
    revalidate: isStaticExport
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default PrefixSlug
