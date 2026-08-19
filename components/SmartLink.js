import { siteConfig } from '@/lib/config'
import Link from 'next/link'

const INHERITED_QUERY_ALLOWLIST = new Set(['page', 'sort', 'filter'])
const BLOCKED_QUERY_KEYS = new Set([
  'demo',
  'probe',
  'debug',
  'debugmode',
  'gclid',
  'fbclid'
])
const DIRECT_LINK_PROTOCOL = /^(?:mailto:|tel:|sms:)/i

const isBlockedQueryKey = key =>
  BLOCKED_QUERY_KEYS.has(String(key || '').toLowerCase()) ||
  String(key || '').toLowerCase().startsWith('utm_')

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

const getCurrentAllowedQuery = () => {
  if (typeof window === 'undefined') return {}

  const currentQuery = {}
  const params = new URLSearchParams(window.location.search || '')
  params.forEach((value, key) => {
    if (INHERITED_QUERY_ALLOWLIST.has(key) && value !== '') {
      currentQuery[key] = value
    }
  })
  return currentQuery
}

const getSiteOrigin = link => {
  try {
    return new URL(link).origin
  } catch (error) {
    return ''
  }
}

const sanitizeExplicitQuery = query => {
  if (!query || typeof query !== 'object') return {}

  return Object.fromEntries(
    Object.entries(query).filter(
      ([key, value]) => !isBlockedQueryKey(key) && value !== '' && value != null
    )
  )
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

  const explicitQuery = {}
  url.searchParams.forEach((value, key) => {
    if (!isBlockedQueryKey(key) && value !== '') {
      explicitQuery[key] = value
    }
  })

  const inheritedQuery = preserveQuery ? getCurrentAllowedQuery() : {}
  url.search = ''
  Object.entries({ ...inheritedQuery, ...explicitQuery }).forEach(
    ([key, value]) => url.searchParams.set(key, String(value))
  )

  return `${url.pathname}${url.search}${url.hash}`
}

const sanitizeObjectHref = ({ href, preserveQuery }) => {
  const explicitQuery = sanitizeExplicitQuery(href?.query)
  const inheritedQuery = preserveQuery ? getCurrentAllowedQuery() : {}
  const query = { ...inheritedQuery, ...explicitQuery }

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

  if (DIRECT_LINK_PROTOCOL.test(urlString)) {
    return (
      <a href={urlString} {...filterDOMProps(rest)}>
        {children}
      </a>
    )
  }

  const isAbsolute = /^https?:\/\//i.test(urlString)
  const siteOrigin = getSiteOrigin(siteLink)
  let isExternal = false

  if (isAbsolute) {
    try {
      isExternal = !siteOrigin || new URL(urlString).origin !== siteOrigin
    } catch (error) {
      isExternal = true
    }
  }

  if (isExternal) {
    return (
      <a
        {...filterDOMProps(rest)}
        href={urlString}
        target='_blank'
        rel='noopener noreferrer'>
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
