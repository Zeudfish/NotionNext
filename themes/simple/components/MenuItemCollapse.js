import Collapse from '@/components/Collapse'
import SmartLink from '@/components/SmartLink'
import { useId, useState } from 'react'
import { isMenuActive, isNavActive } from './navState'

export const MenuItemCollapse = ({
  link,
  currentPath,
  onHeightChange,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const reactId = useId()
  const panelId = `mobile-menu-${reactId.replace(/:/g, '')}`
  const hasSubMenu = link?.subMenus?.length > 0
  const active = isMenuActive(currentPath, link)

  if (!link || !link.show) return null

  return (
    <div className='zeurd-mobile-menu-item'>
      {!hasSubMenu ? (
        <SmartLink
          href={link.href}
          target={link.target}
          aria-current={active ? 'page' : undefined}
          className={`zeurd-mobile-menu-link ${active ? 'is-active' : ''}`}
          onClick={onNavigate}>
          <span>
            {link.icon && <i className={link.icon} aria-hidden='true' />}
            {link.name}
          </span>
        </SmartLink>
      ) : (
        <button
          type='button'
          className={`zeurd-mobile-menu-link ${active ? 'is-active' : ''}`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(open => !open)}>
          <span>
            {link.icon && <i className={link.icon} aria-hidden='true' />}
            {link.name}
          </span>
          <i
            className={`fas fa-plus transition-transform ${
              isOpen ? 'rotate-45' : ''
            }`}
            aria-hidden='true'
          />
        </button>
      )}

      {hasSubMenu && (
        <Collapse isOpen={isOpen} onHeightChange={onHeightChange}>
          <div id={panelId} className='zeurd-mobile-submenu'>
            {link.subMenus.map((subLink, index) => {
              const subActive = isNavActive(currentPath, subLink.href)
              return (
                <SmartLink
                  key={`${subLink.href || subLink.title}-${index}`}
                  href={subLink.href}
                  target={subLink.target || link.target}
                  aria-current={subActive ? 'page' : undefined}
                  className={`zeurd-mobile-submenu-link ${
                    subActive ? 'is-active' : ''
                  }`}
                  onClick={onNavigate}>
                  {subLink.icon && (
                    <i className={subLink.icon} aria-hidden='true' />
                  )}
                  <span>{subLink.title}</span>
                </SmartLink>
              )
            })}
          </div>
        </Collapse>
      )}
    </div>
  )
}
