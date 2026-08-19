import { useRouter } from 'next/router'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'

const decodeKeyword = keyword => {
  try {
    return decodeURIComponent(String(keyword || ''))
  } catch (error) {
    return String(keyword || '')
  }
}

const SearchInput = ({ keyword, cRef, className = '' }) => {
  const router = useRouter()
  const searchInputRef = useRef(null)
  const composingRef = useRef(false)
  const [value, setValue] = useState(decodeKeyword(keyword))
  const [onLoading, setLoadingState] = useState(false)

  useEffect(() => {
    setValue(decodeKeyword(keyword))
  }, [keyword])

  useImperativeHandle(cRef, () => ({
    focus: () => searchInputRef.current?.focus()
  }))

  const handleSearch = async event => {
    event?.preventDefault()
    if (composingRef.current) return

    const search = value.trim()
    setLoadingState(true)
    try {
      if (!search) {
        await router.push('/search')
      } else if (process.env.EXPORT) {
        await router.push({ pathname: '/search', query: { s: search } })
      } else {
        await router.push(`/search/${encodeURIComponent(search)}`)
      }
    } finally {
      setLoadingState(false)
    }
  }

  const cleanSearch = () => {
    setValue('')
    searchInputRef.current?.focus()
  }

  return (
    <form
      role='search'
      onSubmit={handleSearch}
      className={`zeurd-search-form ${className}`}>
      <label className='sr-only' htmlFor='simple-search-page'>
        搜索文章
      </label>
      <input
        id='simple-search-page'
        ref={searchInputRef}
        type='search'
        value={value}
        className='zeurd-search-input'
        onCompositionStart={() => {
          composingRef.current = true
        }}
        onCompositionEnd={() => {
          composingRef.current = false
        }}
        onChange={event => setValue(event.target.value)}
        placeholder='搜索标题、摘要与正文'
        autoComplete='off'
      />

      {value && (
        <button
          type='button'
          className='zeurd-search-icon-button zeurd-control'
          onClick={cleanSearch}
          aria-label='清空搜索词'>
          <i className='fas fa-times' aria-hidden='true' />
        </button>
      )}

      <button
        type='submit'
        className='zeurd-search-submit zeurd-control'
        aria-label='开始搜索'
        disabled={onLoading}>
        <i
          className={`fas ${onLoading ? 'fa-spinner animate-spin' : 'fa-search'}`}
          aria-hidden='true'
        />
        <span>搜索</span>
      </button>
    </form>
  )
}

export default SearchInput
