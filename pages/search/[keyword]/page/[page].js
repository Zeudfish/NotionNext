import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import {
  normalizeSearchKeyword,
  searchPublishedPosts
} from '@/lib/search/searchPosts'
import { DynamicLayout } from '@/themes/theme'

const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...props} />
}

export async function getStaticProps({ params: { keyword, page }, locale }) {
  const currentPage = Number(page)
  if (!Number.isInteger(currentPage) || currentPage < 1) {
    return { notFound: true }
  }

  const props = await fetchGlobalAllData({
    from: 'search-props',
    locale
  })
  const allPosts = props.allPages?.filter(
    item => item.type === 'Post' && item.status === 'Published'
  )
  const normalizedKeyword = normalizeSearchKeyword(keyword)
  const results = await searchPublishedPosts(allPosts, normalizedKeyword)
  const postsPerPage =
    Number(siteConfig('POSTS_PER_PAGE', 12, props.NOTION_CONFIG)) || 12
  const totalPages = Math.max(1, Math.ceil(results.length / postsPerPage))

  if (currentPage > totalPages) {
    return { notFound: true }
  }

  const start = postsPerPage * (currentPage - 1)
  props.posts = results.slice(start, start + postsPerPage)
  props.postCount = results.length
  props.keyword = normalizedKeyword
  props.page = currentPage
  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export function getStaticPaths() {
  return {
    paths: [{ params: { keyword: 'NotionNext', page: '1' } }],
    fallback: process.env.EXPORT ? false : 'blocking'
  }
}

export default Index
