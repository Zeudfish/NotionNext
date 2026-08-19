import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BlogItem } from './BlogItem'

export default function BlogListScroll({ posts = [] }) {
  const { locale, NOTION_CONFIG } = useGlobal()
  const [page, setPage] = useState(1)
  const sentinelRef = useRef(null)
  const postsPerPage =
    Number(siteConfig('POSTS_PER_PAGE', 12, NOTION_CONFIG)) || 12
  const postsToShow = posts.slice(0, postsPerPage * page)
  const hasMore = postsToShow.length < posts.length

  useEffect(() => {
    setPage(1)
  }, [posts])

  const handleGetMore = useCallback(() => {
    if (!hasMore) return
    setPage(current => current + 1)
  }, [hasMore])

  useEffect(() => {
    const target = sentinelRef.current
    if (!target || !hasMore || !window.IntersectionObserver) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) handleGetMore()
      },
      { rootMargin: '280px 0px' }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [handleGetMore, hasMore])

  return (
    <section className='zeurd-post-list' aria-label='文章列表'>
      <div id='posts-wrapper' aria-live='polite'>
        {postsToShow.map(post => (
          <div className='zeurd-post-slot' key={post.id}>
            <BlogItem post={post} />
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className='zeurd-empty-state' role='status'>
          <i className='fa-regular fa-compass' aria-hidden='true' />
          <h2>暂时没有匹配的文章</h2>
          <p>可以换一个关键词，或者从分类与标签继续浏览。</p>
        </div>
      )}

      <div ref={sentinelRef} className='zeurd-scroll-sentinel' aria-hidden='true' />
      <button
        type='button'
        onClick={handleGetMore}
        disabled={!hasMore}
        className='zeurd-load-more zeurd-control'>
        {hasMore ? locale.COMMON.MORE : locale.COMMON.NO_MORE}
      </button>
    </section>
  )
}
