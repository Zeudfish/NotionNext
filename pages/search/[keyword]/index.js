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

export async function getStaticProps({ params: { keyword }, locale }) {
  const props = await fetchGlobalAllData({
    from: 'search-props',
    locale
  })
  const allPosts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  const normalizedKeyword = normalizeSearchKeyword(keyword)
  const results = await searchPublishedPosts(allPosts, normalizedKeyword)
  const postCount = results.length
  const listStyle = String(
    siteConfig('POST_LIST_STYLE', 'page', props.NOTION_CONFIG)
  ).toLowerCase()
  const postsPerPage =
    Number(siteConfig('POSTS_PER_PAGE', 12, props.NOTION_CONFIG)) || 12

  props.posts = listStyle === 'scroll' ? results : results.slice(0, postsPerPage)
  props.postCount = postCount
  props.keyword = normalizedKeyword
  props.page = 1

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
    paths: [{ params: { keyword: 'NotionNext' } }],
    fallback: 'blocking'
  }
}

export default Index
