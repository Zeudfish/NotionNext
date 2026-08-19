import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuItemDrop } from '@/themes/simple/components/MenuItemDrop'

jest.mock('@/components/SmartLink', () => {
  return function MockSmartLink({ href, children, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

const menu = {
  show: true,
  name: '研究',
  icon: 'fas fa-book',
  subMenus: [
    { title: '论文笔记', href: '/category/papers' },
    { title: '技术分享', href: '/category/engineering' }
  ]
}

describe('simple MenuItemDrop', () => {
  it('uses a real button with menu aria state', async () => {
    const user = userEvent.setup()
    render(<MenuItemDrop link={menu} />)

    const trigger = screen.getByRole('button', { name: /研究/ })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu')).toHaveAttribute('aria-hidden', 'false')
    expect(screen.getAllByRole('menuitem')).toHaveLength(2)
  })

  it('opens from the keyboard and closes with Escape', async () => {
    const user = userEvent.setup()
    render(<MenuItemDrop link={menu} />)

    const trigger = screen.getByRole('button', { name: /研究/ })
    trigger.focus()
    await user.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('still supports pointer hover', () => {
    render(<MenuItemDrop link={menu} />)

    const trigger = screen.getByRole('button', { name: /研究/ })
    fireEvent.mouseEnter(trigger.parentElement)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })
})
