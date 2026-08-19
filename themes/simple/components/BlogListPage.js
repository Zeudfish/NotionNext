import SmartLink from '@/components/SmartLink'
import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import CONFIG from '../config'
import { BlogItem } from './BlogItem'

const buildPageHref = (prefix, targetPage) => {
  if (targetPage <= 1) return prefix || '/'
  const normalizedPrefix = prefix === '/' ? '' : prefix
  return `${normalizedPrefix}/page/${targetPage}`
}

const PageControl = ({ href, disabled, direction, children }) => {
  const className = `zeurd-page-control zeurd-control ${
    disabled ? 'is-disabled' : ''
  }`

  if (disabled) {
    return (
      <span className={className} aria-disabled='true'>
        {direction === 'left' && (
          <i className='fa-solid fa-arrow-left' aria-hidden='true' />
        )}
        <span>{children}</span>
        {direction === 'right' && (
          <i className='fa-solid fa-arrow-right' aria-hidden='true' />
        )}
      </span>
    )
  }

  return (
    <SmartLink href={href} preserveQuery className={className}>
      {direction === 'left' && (
        <i className='fa-solid fa-arrow-left' aria-hidden='true' />
      )}
      <span>{children}</span>
      {direction === 'right' && (
        <i className='fa-solid fa-arrow-right' aria-hidden='true' />
      )}
    </SmartLink>
  )
}

export default function BlogListPage({
  page = 1,
  posts = [],
  postCount = 0,
  disablePagination = false
}) {
  const router = useRouter()
  const { NOTION_CONFIG } = useGlobal()
  const postsPerPage =
    Number(siteConfig('POSTS_PER_PAGE', 12, NOTION_CONFIG)) || 12
  const totalPage = Math.max(1, Math.ceil(postCount / postsPerPage))
  const currentPage = Math.max(1, Number(page) || 1)
  const showPrev = currentPage > 1
  const showNext = currentPage < totalPage
  const path = router.asPath.split(/[?#]/)[0].replace(/\.html$/, '')
  const pagePrefix = path.replace(/\/page\/[1-9]\d*$/, '').replace(/\/$/, '') || '/'

  const adEnabled = siteConfig('SIMPLE_POST_AD_ENABLE', false, CONFIG)

  return (
    <section className='zeurd-post-list' aria-label='文章列表'>
      <div id='posts-wrapper' aria-live='polite'>
        {posts.map((post, index) => (
          <div className='zeurd-post-slot' key={post.id}>
            {adEnabled && (index + 1) % 3 === 0 && (
              <AdSlot type='in-article' />
            )}
            {adEnabled && index + 1 === 4 && <AdSlot type='flow' />}
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

      {!disablePagination && postCount > postsPerPage && (
        <nav className='zeurd-pagination' aria-label='文章分页'>
          <PageControl
            href={buildPageHref(pagePrefix, currentPage - 1)}
            disabled={!showPrev}
            direction='left'>
            较新文章
          </PageControl>
          <span className='zeurd-page-status' aria-current='page'>
            {currentPage} / {totalPage}
          </span>
          <PageControl
            href={buildPageHref(pagePrefix, currentPage + 1)}
            disabled={!showNext}
            direction='right'>
            更早文章
          </PageControl>
        </nav>
      )}
    </section>
  )
}
