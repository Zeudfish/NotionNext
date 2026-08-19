import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

const normalizeText = value => {
  if (Array.isArray(value)) return value.map(normalizeText).join(' ')
  if (value && typeof value === 'object') {
    return normalizeText(value.name || value.title || value.label || '')
  }
  return value == null ? '' : String(value)
}

const normalizeKeyword = value => {
  const source = Array.isArray(value) ? value[0] : value
  try {
    return decodeURIComponent(String(source || '')).trim()
  } catch (error) {
    return String(source || '').trim()
  }
}

const Search = props => {
  const router = useRouter()
  const keyword = normalizeKeyword(router.query.s)

  const filteredPosts = useMemo(() => {
    if (!keyword) return []
    const needle = keyword.toLowerCase()

    return (props.posts || []).flatMap(post => {
      const fields = [
        ['标题', post.title],
        ['摘要', post.summary],
        ['标签', post.tags],
        ['分类', post.category]
      ]
      const hit = fields.find(([, value]) =>
        normalizeText(value).toLowerCase().includes(needle)
      )
      if (!hit) return []

      return [
        {
          ...post,
          searchMatchSource: hit[0],
          searchHit: normalizeText(hit[1])
        }
      ]
    })
  }, [keyword, props.posts])

  const layoutProps = {
    ...props,
    posts: filteredPosts,
    postCount: filteredPosts.length,
    disablePagination: true,
    keyword
  }
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...layoutProps} />
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({
    from: 'search-props',
    locale
  })
  const { allPages } = props
  props.posts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
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

export default Search
