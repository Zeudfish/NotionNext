import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSimpleGlobal } from '..'
import { MenuList } from './MenuList'

/**
 * 菜单导航
 */
export default function NavBar(props) {
  const [showSearchInput, changeShowSearchInput] = useState(false)
  const router = useRouter()
  const { searchModal } = useSimpleGlobal()

  const toggleShowSearchInput = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      changeShowSearchInput(!showSearchInput)
    }
  }

  const onKeyUp = event => {
    if (event.key === 'Enter') {
      const search = document.getElementById('simple-search').value
      if (search) {
        router.push({ pathname: `/search/${search}` })
      }
    }
  }

  return (
    <nav className='relative z-20 w-full border-t border-gray-100 bg-white shadow dark:border-hexo-black-gray dark:bg-black md:pt-0'>
      <div
        id='nav-bar-inner'
        className='mx-auto flex h-14 max-w-9/10 items-center gap-5 text-sm md:text-base'>
        {!showSearchInput && (
          <SmartLink
            href='/'
            className='hidden shrink-0 items-center gap-2 font-serif text-lg font-extrabold tracking-tight text-slate-900 no-underline transition hover:text-blue-600 dark:text-slate-100 md:inline-flex'
            aria-label='返回 Zeurd 首页'>
            <span className='h-2 w-2 rounded-full bg-gradient-to-br from-blue-600 to-orange-600' />
            Zeurd
          </SmartLink>
        )}

        <div className='flex h-full min-w-0 flex-1 items-stretch'>
          {showSearchInput ? (
            <input
              autoFocus
              id='simple-search'
              onKeyUp={onKeyUp}
              className='h-full w-full bg-transparent px-1 outline-none'
              aria-label='搜索文章'
              type='search'
              name='s'
              autoComplete='off'
              placeholder='输入关键词后按回车搜索'
            />
          ) : (
            <MenuList {...props} />
          )}
        </div>

        <button
          type='button'
          onClick={toggleShowSearchInput}
          className='grid h-9 w-9 shrink-0 place-items-center rounded-full text-blue-500 transition hover:bg-blue-50 hover:text-orange-700 dark:hover:bg-slate-900'
          aria-label={showSearchInput ? '关闭搜索' : '搜索文章'}>
          <i
            className={
              showSearchInput
                ? 'fa-regular fa-circle-xmark'
                : 'fa-solid fa-magnifying-glass'
            }
          />
        </button>
      </div>
    </nav>
  )
}
