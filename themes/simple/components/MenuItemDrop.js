import SmartLink from '@/components/SmartLink'
import { useEffect, useId, useRef, useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const reactId = useId()
  const menuId = `simple-menu-${reactId.replace(/:/g, '')}`
  const hasSubMenu = link?.subMenus?.length > 0

  useEffect(() => {
    if (!show) return

    const handlePointerDown = event => {
      if (!containerRef.current?.contains(event.target)) {
        changeShow(false)
      }
    }
    const handleEscape = event => {
      if (event.key === 'Escape') {
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

  if (!link || !link.show) {
    return null
  }

  const getMenuItems = () =>
    Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') || [])

  const focusMenuItem = index => {
    const items = getMenuItems()
    if (items.length === 0) return
    const normalizedIndex = (index + items.length) % items.length
    items[normalizedIndex]?.focus()
  }

  const openAndFocus = index => {
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

  const handleMouseLeave = () => {
    if (!containerRef.current?.contains(document.activeElement)) {
      changeShow(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className='relative'
      onMouseEnter={() => changeShow(true)}
      onMouseLeave={handleMouseLeave}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          changeShow(false)
        }
      }}>
      {!hasSubMenu && (
        <SmartLink
          href={link?.href}
          target={link?.target}
          className='menu-link pl-2 pr-4 text-gray-700 dark:text-gray-200 no-underline tracking-widest pb-1'>
          {link?.icon && (
            <span className='mr-2'>
              <i className={link.icon} />
            </span>
          )}
          {link?.name}
        </SmartLink>
      )}

      {hasSubMenu && (
        <button
          ref={triggerRef}
          type='button'
          className='menu-link border-0 bg-transparent pl-2 pr-4 text-gray-700 dark:text-gray-200 no-underline tracking-widest pb-1'
          aria-haspopup='menu'
          aria-expanded={show}
          aria-controls={menuId}
          onClick={() => changeShow(current => !current)}
          onKeyDown={handleTriggerKeyDown}>
          {link?.icon && (
            <span className='mr-2'>
              <i className={link.icon} />
            </span>
          )}{' '}
          {link?.name}
          <i
            aria-hidden='true'
            className={`px-2 fas fa-chevron-down duration-500 transition-all ${show ? 'rotate-180' : ''}`}
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
          className={`${show ? 'visible opacity-100 top-12' : 'invisible opacity-0 top-10'} border-gray-100 bg-white dark:bg-black dark:border-gray-800 transition-all duration-300 z-20 absolute block drop-shadow-lg`}>
          {link.subMenus.map((sLink, index) => (
            <li
              key={`${sLink.href || sLink.title}-${index}`}
              role='none'
              className='not:last-child:border-b-0 border-b text-blue-600 dark:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200 dark:border-gray-800 py-3 pr-6 pl-2'>
              <SmartLink
                href={sLink.href}
                target={sLink?.target || link?.target}
                role='menuitem'
                tabIndex={show ? 0 : -1}
                onClick={() => changeShow(false)}>
                <span className='text-sm text-nowrap'>
                  {sLink?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                  {sLink.title}
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
