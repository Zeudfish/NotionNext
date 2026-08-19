import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useId, useRef, useState } from 'react'
import { isMenuActive, isNavActive } from './navState'

export const MenuItemDrop = ({ link }) => {
  const router = useRouter()
  const [show, changeShow] = useState(false)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const openedByHoverRef = useRef(false)
  const reactId = useId()
  const menuId = `simple-menu-${reactId.replace(/:/g, '')}`
  const hasSubMenu = link?.subMenus?.length > 0
  const active = isMenuActive(router.asPath, link)

  useEffect(() => {
    if (!show) return

    const handlePointerDown = event => {
      if (!containerRef.current?.contains(event.target)) {
        openedByHoverRef.current = false
        changeShow(false)
      }
    }
    const handleEscape = event => {
      if (event.key === 'Escape') {
        openedByHoverRef.current = false
        changeShow(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [show])

  if (!link || !link.show) return null

  const getMenuItems = () =>
    Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') || [])

  const focusMenuItem = index => {
    const items = getMenuItems()
    if (items.length === 0) return
    const normalizedIndex = (index + items.length) % items.length
    items[normalizedIndex]?.focus()
  }

  const openAndFocus = index => {
    openedByHoverRef.current = false
    changeShow(true)
    requestAnimationFrame(() => focusMenuItem(index))
  }

  const handleTriggerKeyDown = event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openAndFocus(0)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openAndFocus(-1)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      changeShow(false)
    }
  }

  const handleMenuKeyDown = event => {
    const items = getMenuItems()
    const currentIndex = items.indexOf(document.activeElement)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusMenuItem(currentIndex + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusMenuItem(currentIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusMenuItem(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusMenuItem(items.length - 1)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      changeShow(false)
      triggerRef.current?.focus()
    }
  }

  const closeMenu = () => {
    openedByHoverRef.current = false
    changeShow(false)
  }

  return (
    <div
      ref={containerRef}
      className='zeurd-nav-item'
      onMouseEnter={() => {
        if (!show) {
          openedByHoverRef.current = true
          changeShow(true)
        }
      }}
      onMouseLeave={() => {
        if (
          openedByHoverRef.current &&
          !containerRef.current?.contains(document.activeElement)
        ) {
          closeMenu()
        }
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu()
      }}>
      {!hasSubMenu && (
        <SmartLink
          href={link.href}
          target={link.target}
          aria-current={active ? 'page' : undefined}
          className={`menu-link zeurd-nav-link ${active ? 'is-active' : ''}`}>
          {link.icon && <i className={link.icon} aria-hidden='true' />}
          <span>{link.name}</span>
        </SmartLink>
      )}

      {hasSubMenu && (
        <button
          ref={triggerRef}
          type='button'
          className={`menu-link zeurd-nav-link ${active ? 'is-active' : ''}`}
          aria-haspopup='menu'
          aria-expanded={show}
          aria-controls={menuId}
          onClick={() => {
            openedByHoverRef.current = false
            changeShow(current => !current)
          }}
          onKeyDown={handleTriggerKeyDown}>
          {link.icon && <i className={link.icon} aria-hidden='true' />}
          <span>{link.name}</span>
          <i
            aria-hidden='true'
            className={`fas fa-chevron-down zeurd-nav-chevron ${show ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      {hasSubMenu && (
        <ul
          ref={menuRef}
          id={menuId}
          role='menu'
          aria-hidden={!show}
          onKeyDown={handleMenuKeyDown}
          className={`zeurd-nav-dropdown ${show ? 'is-open' : ''}`}>
          {link.subMenus.map((subLink, index) => {
            const subActive = isNavActive(router.asPath, subLink.href)
            return (
              <li key={`${subLink.href || subLink.title}-${index}`} role='none'>
                <SmartLink
                  href={subLink.href}
                  target={subLink.target || link.target}
                  role='menuitem'
                  tabIndex={show ? 0 : -1}
                  aria-current={subActive ? 'page' : undefined}
                  className={`zeurd-nav-dropdown-link ${
                    subActive ? 'is-active' : ''
                  }`}
                  onClick={closeMenu}>
                  {subLink.icon && (
                    <i className={subLink.icon} aria-hidden='true' />
                  )}
                  <span>{subLink.title}</span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
