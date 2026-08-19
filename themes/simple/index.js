import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import ArticleInfo from './components/ArticleInfo'
import BlogArchiveItem from './components/BlogArchiveItem'
import BlogListPage from './components/BlogListPage'
import BlogListScroll from './components/BlogListScroll'
import BlogPostBar from './components/BlogPostBar'
import Breadcrumb from './components/Breadcrumb'
import Footer from './components/Footer'
import Header from './components/Header'
import HomeOverview from './components/HomeOverview'
import JumpToTopButton from './components/JumpToTopButton'
import NavBar from './components/NavBar'
import SearchInput from './components/SearchInput'
import CONFIG from './config'
import { ThemeGlobalSimple } from './context'
import { Style } from './style'

export { useSimpleGlobal } from './context'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)
const ArticleLock = dynamic(() => import('./components/ArticleLock'), {
  ssr: false
})
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleAround = dynamic(() => import('./components/ArticleAround'), {
  ssr: false
})
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })
const TopBar = dynamic(() => import('./components/TopBar'))
const SideBar = dynamic(() => import('./components/SideBar'), { ssr: false })
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), {
  ssr: false
})

const getLabel = value => {
  if (Array.isArray(value)) return getLabel(value[0])
  if (value && typeof value === 'object') {
    return getLabel(value.name || value.title || value.label)
  }
  return value ? String(value) : ''
}

const toBoolean = value =>
  value === true || String(value || '').toLowerCase() === 'true'

const backButtonClassName = 'zeurd-back-button zeurd-control'

const ArticleBackButton = ({ post }) => {
  const category = getLabel(post?.category)
  const listHref = category
    ? `/category/${encodeURIComponent(category)}`
    : '/'

  return (
    <SmartLink
      href={listHref}
      className={backButtonClassName}
      aria-label='返回文章列表'>
      <i className='fas fa-arrow-left' aria-hidden='true' />
      <span>返回文章列表</span>
    </SmartLink>
  )
}

const getListBreadcrumb = ({ category, tag, keyword }) => {
  if (category) {
    return [
      { label: '首页', href: '/' },
      { label: '分类', href: '/category' },
      { label: category, current: true }
    ]
  }
  if (tag) {
    return [
      { label: '首页', href: '/' },
      { label: '标签', href: '/tag' },
      { label: tag, current: true }
    ]
  }
  if (keyword) {
    return [
      { label: '首页', href: '/' },
      { label: '搜索', href: '/search' },
      { label: keyword, current: true }
    ]
  }
  return []
}

const LayoutBase = props => {
  const { children, slotTop, post } = props
  const { onLoading, fullWidth } = useGlobal()
  const router = useRouter()
  const searchModal = useRef(null)
  const cleanPath = router.asPath.split(/[?#]/)[0].replace(/\/$/, '') || '/'
  const showHeroHeader = cleanPath === '/' || cleanPath === '/zh-CN'
  const showRightSidebar = !showHeroHeader && !fullWidth
  const reverseSidebar = toBoolean(siteConfig('LAYOUT_SIDEBAR_REVERSE'))

  return (
    <ThemeGlobalSimple.Provider value={{ searchModal }}>
      <div
        id='theme-simple'
        className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col`}>
        <Style />
        <a className='zeurd-skip-link' href='#main-content'>
          跳到主要内容
        </a>

        {siteConfig('SIMPLE_TOP_BAR', null, CONFIG) && <TopBar {...props} />}
        {showHeroHeader && <Header {...props} />}
        <NavBar {...props} />

        <div
          id='container-wrapper'
          className={reverseSidebar ? 'is-reversed' : ''}>
          <main
            id='main-content'
            tabIndex='-1'
            aria-busy={onLoading}
            className='zeurd-main-content'>
            <Transition
              show={!onLoading}
              appear
              enter='transition-opacity ease-out duration-200'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-in duration-150'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
              unmount={false}>
              {slotTop}
              {children}
            </Transition>
            <AdSlot type='native' />
          </main>

          {showRightSidebar && (
            <aside
              id='right-sidebar'
              className={post ? 'is-article' : 'is-list'}
              aria-label='辅助导航'>
              <SideBar {...props} />
            </aside>
          )}
        </div>

        <div className='zeurd-jump-wrapper'>
          <JumpToTopButton />
        </div>

        <AlgoliaSearchModal cRef={searchModal} {...props} />
        <Footer />
      </div>
    </ThemeGlobalSimple.Provider>
  )
}

const LayoutIndex = props => <HomeOverview {...props} />

const LayoutPostList = props => {
  const listStyle = String(
    siteConfig('POST_LIST_STYLE', 'page', props.NOTION_CONFIG)
  ).toLowerCase()
  const breadcrumb = getListBreadcrumb(props)

  return (
    <>
      <Breadcrumb items={breadcrumb} />
      <BlogPostBar {...props} />
      {listStyle === 'page' ? (
        <BlogListPage {...props} />
      ) : (
        <BlogListScroll {...props} />
      )}
    </>
  )
}

const LayoutSearch = props => {
  const { keyword } = props

  useEffect(() => {
    if (!isBrowser || !keyword) return
    const frame = window.requestAnimationFrame(() => {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'zeurd-search-highlight'
        }
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [keyword, props.posts])

  return (
    <>
      {!siteConfig('ALGOLIA_APP_ID') && (
        <div className='zeurd-search-page-box'>
          <SearchInput {...props} />
        </div>
      )}
      <LayoutPostList {...props} />
    </>
  )
}

const LayoutArchive = ({ archivePosts = {} }) => (
  <>
    <Breadcrumb
      items={[
        { label: '首页', href: '/' },
        { label: '归档', current: true }
      ]}
    />
    <header className='zeurd-list-header'>
      <div className='zeurd-list-eyebrow'>
        <i className='fas fa-archive' aria-hidden='true' />
        <span>ARCHIVE</span>
      </div>
      <h1>文章归档</h1>
      <p>按时间回看已经发布的记录。</p>
    </header>
    <div className='zeurd-archive-list'>
      {Object.keys(archivePosts).map(archiveTitle => (
        <BlogArchiveItem
          key={archiveTitle}
          archiveTitle={archiveTitle}
          archivePosts={archivePosts}
        />
      ))}
    </div>
  </>
)

const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props
  const { fullWidth } = useGlobal()
  const category = getLabel(post?.category)
  const breadcrumb = post
    ? [
        { label: '首页', href: '/' },
        ...(category
          ? [
              { label: '分类', href: '/category' },
              {
                label: category,
                href: `/category/${encodeURIComponent(category)}`
              }
            ]
          : []),
        { label: post.title, current: true }
      ]
    : []

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div className={fullWidth ? '' : 'zeurd-article-page'}>
          <Breadcrumb items={breadcrumb} />
          <ArticleBackButton post={post} />

          <article className={fullWidth ? '' : 'zeurd-reading-surface'}>
            <ArticleInfo post={post} />
            <WWAds orientation='horizontal' className='w-full' />
            <div id='article-wrapper'>
              <NotionPage post={post} />
            </div>
          </article>

          <ShareBar post={post} />
          <AdSlot type='in-article' />

          {post.type === 'Post' && (
            <>
              <ArticleAround prev={prev} next={next} />
              <RecommendPosts recommendPosts={recommendPosts} />
            </>
          )}

          <Comment frontMatter={post} />
        </div>
      )}
    </>
  )
}

const Layout404 = () => (
  <section className='zeurd-404'>
    <div className='zeurd-list-eyebrow'>ERROR 404</div>
    <h1>这篇内容可能被移动或删除了</h1>
    <p>页面不会自动跳转。可以回到首页，或者从主要内容分类继续浏览。</p>
    <div className='zeurd-404-actions'>
      <SmartLink href='/' className={backButtonClassName}>
        <i className='fas fa-home' aria-hidden='true' />
        <span>回到首页</span>
      </SmartLink>
      <SmartLink href='/search' className={backButtonClassName}>
        <i className='fas fa-search' aria-hidden='true' />
        <span>搜索文章</span>
      </SmartLink>
      <SmartLink
        href='/category/%E8%AE%BA%E6%96%87%E5%AF%BC%E8%AF%BB'
        className={backButtonClassName}>
        <i className='fas fa-book-open' aria-hidden='true' />
        <span>论文导读</span>
      </SmartLink>
      <SmartLink
        href='/category/%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB'
        className={backButtonClassName}>
        <i className='fas fa-screwdriver-wrench' aria-hidden='true' />
        <span>技术分享</span>
      </SmartLink>
    </div>
  </section>
)

const LayoutCategoryIndex = ({ categoryOptions = [] }) => (
  <>
    <Breadcrumb
      items={[
        { label: '首页', href: '/' },
        { label: '分类', current: true }
      ]}
    />
    <header className='zeurd-list-header'>
      <div className='zeurd-list-eyebrow'>
        <i className='fas fa-folder-open' aria-hidden='true' />
        <span>CATEGORIES</span>
      </div>
      <h1>内容分类</h1>
      <p>从研究、工程与生活主题进入站内内容。</p>
    </header>
    <div id='category-list' className='zeurd-taxonomy-grid'>
      {categoryOptions.map(category => (
        <SmartLink
          key={category.name}
          href={`/category/${encodeURIComponent(category.name)}`}
          className='zeurd-taxonomy-card zeurd-control'>
          <i className='fas fa-folder' aria-hidden='true' />
          <span>{category.name}</span>
          <small>{category.count || 0} 篇</small>
        </SmartLink>
      ))}
    </div>
  </>
)

const LayoutTagIndex = ({ tagOptions = [] }) => (
  <>
    <Breadcrumb
      items={[
        { label: '首页', href: '/' },
        { label: '标签', current: true }
      ]}
    />
    <header className='zeurd-list-header'>
      <div className='zeurd-list-eyebrow'>
        <i className='fas fa-tags' aria-hidden='true' />
        <span>TAGS</span>
      </div>
      <h1>文章标签</h1>
      <p>用更细的主题线索查找相关文章。</p>
    </header>
    <div id='tags-list' className='zeurd-tag-index'>
      {tagOptions.map(tag => (
        <SmartLink
          key={tag.name}
          href={`/tag/${encodeURIComponent(tag.name)}`}
          className='zeurd-tag-index-item zeurd-control'>
          <i className='fas fa-tag' aria-hidden='true' />
          <span>{tag.name}</span>
          {tag.count ? <small>{tag.count}</small> : null}
        </SmartLink>
      ))}
    </div>
  </>
)

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
