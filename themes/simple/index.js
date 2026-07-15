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
import { createContext, useContext, useEffect, useRef } from 'react'
import BlogPostBar from './components/BlogPostBar'
import HomeOverview from './components/HomeOverview'
import CONFIG from './config'
import { Style } from './style'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)
const BlogListScroll = dynamic(() => import('./components/BlogListScroll'), {
  ssr: false
})
const BlogArchiveItem = dynamic(() => import('./components/BlogArchiveItem'), {
  ssr: false
})
const ArticleLock = dynamic(() => import('./components/ArticleLock'), {
  ssr: false
})
const ArticleInfo = dynamic(() => import('./components/ArticleInfo'), {
  ssr: false
})
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleAround = dynamic(() => import('./components/ArticleAround'), {
  ssr: false
})
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })
const TopBar = dynamic(() => import('./components/TopBar'), { ssr: false })
const Header = dynamic(() => import('./components/Header'), { ssr: false })
const NavBar = dynamic(() => import('./components/NavBar'), { ssr: false })
const SideBar = dynamic(() => import('./components/SideBar'), { ssr: false })
const JumpToTopButton = dynamic(() => import('./components/JumpToTopButton'), {
  ssr: false
})
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })
const SearchInput = dynamic(() => import('./components/SearchInput'), {
  ssr: false
})
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })
const BlogListPage = dynamic(() => import('./components/BlogListPage'), {
  ssr: false
})
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), {
  ssr: false
})
const backButtonClassName =
  'mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-black dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300'

const HomeBackButton = () => (
  <a href='/' className={backButtonClassName} aria-label='返回首页'>
    <i className='fas fa-home' />
    <span>返回首页</span>
  </a>
)

const ArticleBackButton = ({ post }) => {
  const listHref = post?.category
    ? `/category/${encodeURIComponent(post.category)}`
    : '/'

  return (
    <SmartLink
      href={listHref}
      className={backButtonClassName}
      aria-label='返回文章列表'>
      <i className='fas fa-arrow-left' />
      <span>返回文章列表</span>
    </SmartLink>
  )
}

const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

const LayoutBase = props => {
  const { children, slotTop, post } = props
  const { onLoading, fullWidth } = useGlobal()
  const router = useRouter()
  const searchModal = useRef(null)
  const cleanPath = router.asPath.split('?')[0].replace(/\/$/, '') || '/'
  const showHeroHeader = cleanPath === '/' || cleanPath === '/zh-CN'
  const showRightSidebar = !showHeroHeader && !fullWidth

  return (
    <ThemeGlobalSimple.Provider value={{ searchModal }}>
      <div
        id='theme-simple'
        className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col bg-white scroll-smooth dark:bg-black dark:text-gray-300`}>
        <Style />

        {siteConfig('SIMPLE_TOP_BAR', null, CONFIG) && <TopBar {...props} />}
        {showHeroHeader && <Header {...props} />}
        <NavBar {...props} />

        <div
          id='container-wrapper'
          className={`${
            JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
              ? 'flex-row-reverse'
              : ''
          } mx-auto flex w-full max-w-9/10 flex-1 items-start pt-12`}>
          <div id='container-inner' className='min-h-fit w-full flex-grow'>
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
          </div>

          {showRightSidebar && (
            <div
              id='right-sidebar'
              className={`sticky top-8 hidden flex-none border-l border-gray-100 dark:border-gray-800 xl:block ${
                post ? 'w-60 pl-8' : 'w-96 pl-12'
              }`}>
              <SideBar {...props} />
            </div>
          )}
        </div>

        <div className='fixed bottom-4 right-4 z-20'>
          <JumpToTopButton />
        </div>

        <AlgoliaSearchModal cRef={searchModal} {...props} />
        <Footer {...props} />
      </div>
    </ThemeGlobalSimple.Provider>
  )
}

const LayoutIndex = props => <HomeOverview {...props} />

const LayoutPostList = props => {
  const showHomeBack = Boolean(props?.category || props?.tag || props?.keyword)
  return (
    <>
      {showHomeBack && <HomeBackButton />}
      <BlogPostBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
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
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'border-b border-dashed text-red-500'
        }
      })
    }
  }, [keyword])

  const slotTop = siteConfig('ALGOLIA_APP_ID') ? null : (
    <SearchInput {...props} />
  )

  return <LayoutPostList {...props} slotTop={slotTop} />
}

const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <>
      <HomeBackButton />
      <div className='mb-10 min-h-screen w-full p-3 pb-20 md:py-12'>
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
}

const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props
  const { fullWidth } = useGlobal()

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div
          className={`px-2 ${
            fullWidth
              ? ''
              : 'zeurd-article-page xl:max-w-4xl 2xl:max-w-6xl'
          }`}>
          <ArticleBackButton post={post} />

          <article className={fullWidth ? '' : 'zeurd-reading-surface'}>
            <ArticleInfo post={post} />
            <WWAds orientation='horizontal' className='w-full' />

            <div id='article-wrapper'>
              {!lock && <NotionPage post={post} />}
            </div>
          </article>

          <ShareBar post={post} />
          <AdSlot type='in-article' />

          {post?.type === 'Post' && (
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

const Layout404 = props => {
  const { post } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000

  useEffect(() => {
    if (post) return

    const timeoutId = setTimeout(() => {
      if (isBrowser) {
        const article = document.querySelector(
          '#article-wrapper #notion-article'
        )
        if (!article) {
          router.push('/404').then(() => {
            console.warn('找不到页面', router.asPath)
          })
        }
      }
    }, waiting404)

    return () => clearTimeout(timeoutId)
  }, [post, router, waiting404])

  return <>404 Not found.</>
}

const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
    <>
      <HomeBackButton />
      <div id='category-list' className='flex flex-wrap duration-200'>
        {categoryOptions?.map(category => (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            passHref
            legacyBehavior>
            <div className='cursor-pointer px-5 py-2 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'>
              <i className='fas fa-folder mr-4' />
              {category.name}({category.count})
            </div>
          </SmartLink>
        ))}
      </div>
    </>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <>
      <HomeBackButton />
      <div id='tags-list' className='flex flex-wrap duration-200'>
        {tagOptions.map(tag => (
          <div key={tag.name} className='p-2'>
            <SmartLink
              href={`/tag/${encodeURIComponent(tag.name)}`}
              passHref
              className={`notion-${tag.color}_background mr-2 inline-block cursor-pointer whitespace-nowrap rounded px-2 py-1 text-xs text-gray-600 duration-200 hover:bg-gray-500 hover:text-white hover:shadow-xl dark:border-gray-400 dark:bg-gray-800 dark:hover:text-white`}>
              <div className='font-light dark:text-gray-400'>
                <i className='fas fa-tag mr-1' />
                {tag.name + (tag.count ? `(${tag.count})` : '')}
              </div>
            </SmartLink>
          </div>
        ))}
      </div>
    </>
  )
}

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
