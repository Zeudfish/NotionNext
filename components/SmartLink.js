import { siteConfig } from '@/lib/config'
import Link from 'next/link'

const QUERY_ALLOWLIST = new Set(['page', 'sort', 'filter'])

const filterDOMProps = props => {
  const {
    passHref,
    legacyBehavior,
    placeholderSrc,
    fallbackSrc,
    preserveQuery,
    ...rest
  } = props
  return rest
}

const filterLinkProps = props => {
  const {
    placeholderSrc,
    fallbackSrc,
    src,
    alt,
    width,
    height,
    loading,
    decoding,
    onLoad,
    onError,
    preserveQuery,
    ...rest
  } = props
  return rest
}

const getDynamicRouteKeys = pathname => {
  const keys = new Set()
  const pattern = /\[\[?(?:\.\.\.)?([^\]/]+)\]?\]/g
  let match
  while ((match = pattern.exec(pathname || '')) !== null) {
    if (match[1]) keys.add(match[1])
  }
  return keys
}

const filterQueryObject = (query, pathname = '') => {
  if (!query || typeof query !== 'object') return {}
  const dynamicKeys = getDynamicRouteKeys(pathname)
  const filtered = {}

  Object.entries(query).forEach(([key, value]) => {
    if ((QUERY_ALLOWLIST.has(key) || dynamicKeys.has(key)) && value !== '') {
      filtered[key] = value
    }
  })

  return filtered
}

const getCurrentAllowedQuery = () => {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search || '')
  const filtered = {}

  params.forEach((value, key) => {
    if (QUERY_ALLOWLIST.has(key) && value !== '') {
      filtered[key] = value
    }
  })

  return filtered
}

const getSiteOrigin = link => {
  try {
    return new URL(link).origin
  } catch (error) {
    return ''
  }
}

const sanitizeStringHref = ({ href, siteLink, preserveQuery }) => {
  if (!href || href.startsWith('#')) return href

  const base = siteLink || 'https://notionnext.local'
  let url
  try {
    url = new URL(href, base)
  } catch (error) {
    return href
  }

  const allowedQuery = preserveQuery ? getCurrentAllowedQuery() : {}
  const targetQuery = {}
  url.searchParams.forEach((value, key) => {
    if (QUERY_ALLOWLIST.has(key) && value !== '') {
      targetQuery[key] = value
    }
  })

  url.search = ''
  Object.entries({ ...allowedQuery, ...targetQuery }).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  const isAbsolute = /^https?:\/\//i.test(href)
  const siteOrigin = getSiteOrigin(siteLink)
  if (isAbsolute && siteOrigin && url.origin !== siteOrigin) {
    return href
  }

  return `${url.pathname}${url.search}${url.hash}`
}

const sanitizeObjectHref = ({ href, preserveQuery }) => {
  const pathname = typeof href?.pathname === 'string' ? href.pathname : ''
  const currentQuery = preserveQuery ? getCurrentAllowedQuery() : {}
  const targetQuery = filterQueryObject(href?.query, pathname)
  const query = { ...currentQuery, ...targetQuery }

  return {
    ...href,
    query: Object.keys(query).length > 0 ? query : undefined
  }
}

const SmartLink = ({ href, children, preserveQuery = false, ...rest }) => {
  const siteLink = siteConfig('LINK') || ''
  const urlString =
    typeof href === 'string'
      ? href
      : typeof href?.pathname === 'string'
        ? href.pathname
        : ''

  const isAbsolute = /^https?:\/\//i.test(urlString)
  const siteOrigin = getSiteOrigin(siteLink)
  let isExternal = false

  if (isAbsolute) {
    try {
      const targetOrigin = new URL(urlString).origin
      isExternal = !siteOrigin || targetOrigin !== siteOrigin
    } catch (error) {
      isExternal = true
    }
  }

  if (isExternal) {
    return (
      <a
        href={urlString}
        target='_blank'
        rel='noopener noreferrer'
        {...filterDOMProps(rest)}>
        {children}
      </a>
    )
  }

  const sanitizedHref =
    typeof href === 'string'
      ? sanitizeStringHref({ href, siteLink, preserveQuery })
      : sanitizeObjectHref({ href, preserveQuery })

  return (
    <Link href={sanitizedHref} {...filterLinkProps(rest)}>
      {children}
    </Link>
  )
}

export default SmartLink
