import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'
import { MenuItemDrop } from './MenuItemDrop'

/**
 * 菜单导航
 */
export const MenuList = ({ customNav, customMenu, categoryOptions }) => {
  const { locale } = useGlobal()
  const [isOpen, changeIsOpen] = useState(false)
  const router = useRouter()
  const collapseRef = useRef(null)

  useEffect(() => {
    const handleRouteChange = () => changeIsOpen(false)
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

  if (customNav) {
    links = links.concat(customNav)
  }

  if (siteConfig('CUSTOM_MENU')) {
    const customLinks = [...(customMenu || [])]
    const hasHome = customLinks.some(link => link?.href === '/')
    const hasCategory = customLinks.some(link =>
      link?.href?.startsWith('/category')
    )

    links = customLinks
    if (categoryOptions?.length > 0 && !hasCategory) {
      links.unshift(categoryLink)
    }
    if (!hasHome) {
      links.unshift({
        icon: 'fas fa-house',
        name: locale.NAV.INDEX,
        href: '/',
        show: true
      })
    }
  }

  if (!links.length) return null

  return (
    <>
      <div id='nav-menu-pc' className='my-auto hidden md:flex'>
        {links.map((link, index) => (
          <MenuItemDrop key={`${link.href}-${index}`} link={link} />
        ))}
      </div>

      <div
        id='nav-menu-mobile'
        className='my-auto flex justify-start md:hidden'>
        <button
          type='button'
          onClick={() => changeIsOpen(!isOpen)}
          className='cursor-pointer border-0 bg-transparent p-0 transition hover:text-blue-600'
          aria-expanded={isOpen}
          aria-label={isOpen ? '关闭菜单' : '打开菜单'}>
          <i
            className={`${isOpen ? 'rotate-90' : ''} fa fa-bars mr-2 transition duration-200`}
          />
          <span>{isOpen ? '关闭' : '菜单'}</span>
        </button>

        <Collapse
          collapseRef={collapseRef}
          className='absolute left-0 top-14 w-full'
          isOpen={isOpen}>
          <div
            id='menu-wrap'
            className='border bg-white shadow-lg dark:border-hexo-black-gray dark:bg-black'>
            {links.map((link, index) => (
              <MenuItemCollapse
                key={`${link.href}-${index}`}
                link={link}
                onHeightChange={param =>
                  collapseRef.current?.updateCollapseHeight(param)
                }
              />
            ))}
          </div>
        </Collapse>
      </div>
    </>
  )
}
