import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'
import { MenuItemDrop } from './MenuItemDrop'

export const MenuList = ({ customNav, customMenu, categoryOptions }) => {
  const { locale } = useGlobal()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const collapseRef = useRef(null)
  const handleHeightChange = useCallback(param => {
    collapseRef.current?.updateCollapseHeight(param)
  }, [])

  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false)
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [router.events])

  const categoryLink = {
    icon: 'fas fa-folder',
    name: locale.COMMON.CATEGORY,
    href: '/category',
    show: siteConfig('SIMPLE_MENU_CATEGORY', null, CONFIG)
  }

  let links = [
    {
      icon: 'fas fa-house',
      name: locale.NAV.INDEX,
      href: '/',
      show: true
    },
    categoryLink,
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('SIMPLE_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('SIMPLE_MENU_TAG', null, CONFIG)
    }
  ]

  if (customNav) links = links.concat(customNav)

  if (siteConfig('CUSTOM_MENU')) {
    const customLinks = [...(customMenu || [])]
    const hasHome = customLinks.some(link => link?.href === '/')
    const hasCategory = customLinks.some(link =>
      link?.href?.startsWith('/category')
    )

    links = customLinks
    if (categoryOptions?.length > 0 && !hasCategory) links.unshift(categoryLink)
    if (!hasHome) {
      links.unshift({
        icon: 'fas fa-house',
        name: locale.NAV.INDEX,
        href: '/',
        show: true
      })
    }
  }

  const visibleLinks = links.filter(link => link?.show)
  if (visibleLinks.length === 0) return null

  return (
    <>
      <div id='nav-menu-pc' className='zeurd-desktop-menu'>
        {visibleLinks.map((link, index) => (
          <MenuItemDrop key={`${link.href}-${index}`} link={link} />
        ))}
      </div>

      <div id='nav-menu-mobile' className='zeurd-mobile-menu'>
        <button
          type='button'
          onClick={() => setIsOpen(open => !open)}
          className='zeurd-mobile-menu-trigger zeurd-control'
          aria-expanded={isOpen}
          aria-controls='simple-mobile-menu-panel'>
          <i
            className={`fas fa-bars transition-transform ${
              isOpen ? 'rotate-90' : ''
            }`}
            aria-hidden='true'
          />
          <span>{isOpen ? '关闭' : '菜单'}</span>
        </button>

        <Collapse
          collapseRef={collapseRef}
          className='zeurd-mobile-menu-collapse'
          isOpen={isOpen}>
          <div id='simple-mobile-menu-panel' className='zeurd-mobile-menu-panel'>
            {visibleLinks.map((link, index) => (
              <MenuItemCollapse
                key={`${link.href}-${index}`}
                link={link}
                currentPath={router.asPath}
                onNavigate={() => setIsOpen(false)}
                onHeightChange={handleHeightChange}
              />
            ))}
          </div>
        </Collapse>
      </div>
    </>
  )
}
