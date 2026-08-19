import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'

const absoluteUrl = href => {
  if (!href) return ''
  if (/^https?:\/\//i.test(href)) return href
  const siteLink = String(siteConfig('LINK') || '').replace(/\/$/, '')
  if (!siteLink) return href
  return `${siteLink}${href.startsWith('/') ? href : `/${href}`}`
}

export default function Breadcrumb({ items = [] }) {
  const visibleItems = items.filter(item => item?.label)
  if (visibleItems.length < 2) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: visibleItems.map((item, index) => {
      const listItem = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label
      }
      if (item.href) listItem.item = absoluteUrl(item.href)
      return listItem
    })
  }

  return (
    <>
      <nav className='zeurd-breadcrumb' aria-label='面包屑'>
        <ol>
          {visibleItems.map((item, index) => {
            const isCurrent = item.current || index === visibleItems.length - 1
            return (
              <li key={`${item.label}-${index}`}>
                {index > 0 && (
                  <span className='zeurd-breadcrumb-separator' aria-hidden='true'>
                    /
                  </span>
                )}
                {isCurrent || !item.href ? (
                  <span aria-current={isCurrent ? 'page' : undefined}>
                    {item.label}
                  </span>
                ) : (
                  <SmartLink href={item.href}>{item.label}</SmartLink>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c')
        }}
      />
    </>
  )
}
