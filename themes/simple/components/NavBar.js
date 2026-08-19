import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useSimpleGlobal } from '../context'
import { MenuList } from './MenuList'

export default function NavBar(props) {
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const composingRef = useRef(false)
  const router = useRouter()
  const { searchModal } = useSimpleGlobal()

  useEffect(() => {
    const closeSearch = () => setShowSearchInput(false)
    router.events.on('routeChangeStart', closeSearch)
    return () => router.events.off('routeChangeStart', closeSearch)
  }, [router.events])

  const toggleSearch = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current?.openSearch()
      return
    }
    setShowSearchInput(show => !show)
  }

  const submitSearch = async event => {
    event.preventDefault()
    if (composingRef.current) return

    const keyword = searchValue.trim()
    if (!keyword) return
    if (process.env.EXPORT) {
      await router.push({ pathname: '/search', query: { s: keyword } })
    } else {
      await router.push(`/search/${encodeURIComponent(keyword)}`)
    }
  }

  return (
    <nav className='zeurd-navbar' aria-label='主导航'>
      <div id='nav-bar-inner' className='zeurd-navbar-inner'>
        {!showSearchInput && (
          <SmartLink
            href='/'
            className='zeurd-navbar-logo zeurd-control'
            aria-label='返回 Zeurd 首页'>
            Z
          </SmartLink>
        )}

        <div className='zeurd-navbar-content'>
          {showSearchInput ? (
            <form className='zeurd-navbar-search' role='search' onSubmit={submitSearch}>
              <label className='sr-only' htmlFor='simple-navbar-search'>
                搜索文章
              </label>
              <input
                autoFocus
                id='simple-navbar-search'
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
                onCompositionStart={() => {
                  composingRef.current = true
                }}
                onCompositionEnd={() => {
                  composingRef.current = false
                }}
                onKeyDown={event => {
                  if (event.key === 'Escape') setShowSearchInput(false)
                }}
                type='search'
                name='s'
                autoComplete='off'
                placeholder='输入关键词后按回车搜索'
              />
              <button type='submit' className='zeurd-control' aria-label='开始搜索'>
                <i className='fas fa-arrow-right' aria-hidden='true' />
              </button>
            </form>
          ) : (
            <MenuList {...props} />
          )}
        </div>

        <button
          type='button'
          onClick={toggleSearch}
          className='zeurd-navbar-search-toggle zeurd-control'
          aria-label={showSearchInput ? '关闭搜索' : '搜索文章'}
          aria-expanded={showSearchInput}>
          <i
            className={
              showSearchInput
                ? 'fa-regular fa-circle-xmark'
                : 'fa-solid fa-magnifying-glass'
            }
            aria-hidden='true'
          />
        </button>
      </div>
    </nav>
  )
}
