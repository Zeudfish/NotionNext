import React, { act, useState } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server.node'
import Loadable from 'next/dist/shared/lib/loadable.shared-runtime'
import { DynamicLayout, getBaseLayoutByTheme } from '@/themes/theme'
import {
  LayoutBase as ServerSimpleLayout,
  LayoutIndex as ServerSimpleIndex,
  LayoutSlug as ServerSimpleArticle
} from '@/themes/simple'

const mockSecondaryLoads = jest.fn()

jest.mock('@/blog.config', () => ({
  __esModule: true,
  default: { THEME: 'simple' },
  LAYOUT_MAPPINGS: {}
}))

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { THEMES: ['simple', 'nobelium'] }
}))

jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/food' })
}))

jest.mock('@/lib/utils', () => ({
  getQueryParam: () => null,
  isBrowser: true
}))

jest.mock('next/dynamic', () => {
  const actualDynamic = jest.requireActual('next/dynamic').default
  return {
    __esModule: true,
    default: (loader, options) => actualDynamic(loader, {
      ...options,
      // Next's compiler supplies module IDs for preloadReady. Jest does not
      // build a webpack manifest, so provide that metadata while keeping the
      // real dynamic loader, preload registry and React hydration behavior.
      modules: ['theme-base-preload']
    })
  }
})

jest.mock('@/themes/simple', () => {
  const React = jest.requireActual('react')
  return {
    LayoutBase: ({ children }) => React.createElement(
      'div', { id: 'theme-simple' }, children
    ),
    LayoutSlug: ({ title, children }) => React.createElement(
      'article', { id: 'article-content' },
      React.createElement('h1', null, title), children
    ),
    LayoutIndex: ({ title, children }) => React.createElement(
      'section', { id: 'home-content' },
      React.createElement('h1', null, title), children
    )
  }
})

jest.mock('@/themes/nobelium', () => {
  mockSecondaryLoads()
  const React = jest.requireActual('react')
  return {
    LayoutBase: ({ children }) => React.createElement(
      'div', { id: 'theme-nobelium' }, children
    )
  }
})

function FoodFilter({ label = '筛选' }) {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(value => value + 1)}>
      {label}: {count}
    </button>
  )
}

it('hydrates the default layout in place without leaving an inert SSR copy', async () => {
  const container = document.createElement('div')
  container.id = '__next'
  container.innerHTML = renderToString(
    <ServerSimpleLayout><FoodFilter /></ServerSimpleLayout>
  )
  document.body.appendChild(container)
  const serverLayout = container.firstElementChild
  const recoverableErrors = []
  let root

  try {
    // This is Next's startup order: preload registered dynamic modules before
    // _app first asks for a layout. A dynamic declared during render is late.
    await Loadable.preloadReady(['theme-base-preload'])
    const Layout = getBaseLayoutByTheme('simple')
    await act(async () => {
      root = hydrateRoot(container, <Layout><FoodFilter /></Layout>, {
        onRecoverableError: error => recoverableErrors.push(error)
      })
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(container.querySelectorAll('#theme-simple')).toHaveLength(1)
    expect(container.firstElementChild).toBe(serverLayout)
    expect(recoverableErrors).toEqual([])

    await act(async () => {
      container.querySelector('button').dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      )
      await Promise.resolve()
    })
    expect(container.querySelector('button').textContent).toBe('筛选: 1')

    await act(async () => {
      root.render(<Layout><FoodFilter label='已筛选' /></Layout>)
      await Promise.resolve()
    })
    expect(container.querySelectorAll('#theme-simple')).toHaveLength(1)
    expect(container.firstElementChild).toBe(serverLayout)
    expect(container.querySelector('button').textContent).toBe('已筛选: 1')
  } finally {
    if (root) {
      await act(async () => {
        root.unmount()
        await Promise.resolve()
      })
    }
    container.remove()
  }
})

it.each([
  { layoutName: 'LayoutSlug', ServerLayout: ServerSimpleArticle, selector: 'article' },
  { layoutName: 'LayoutIndex', ServerLayout: ServerSimpleIndex, selector: '#home-content' }
])('hydrates the default shell with $layoutName in place', async ({ layoutName, ServerLayout, selector }) => {
  const container = document.createElement('div')
  container.innerHTML = renderToString(
    <ServerSimpleLayout>
      <ServerLayout title='页面'><FoodFilter /></ServerLayout>
    </ServerSimpleLayout>
  )
  document.body.appendChild(container)
  const serverLayout = container.firstElementChild
  const serverContent = container.querySelector(selector)
  const recoverableErrors = []
  let root

  try {
    await Loadable.preloadReady(['theme-base-preload'])
    const Layout = getBaseLayoutByTheme('simple')
    await act(async () => {
      root = hydrateRoot(container, (
        <Layout>
          <DynamicLayout theme='simple' layoutName={layoutName} title='页面'>
            <FoodFilter />
          </DynamicLayout>
        </Layout>
      ), {
        onRecoverableError: error => recoverableErrors.push(error)
      })
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(container.querySelectorAll('#theme-simple')).toHaveLength(1)
    expect(container.querySelectorAll(selector)).toHaveLength(1)
    expect(container.firstElementChild).toBe(serverLayout)
    expect(container.querySelector(selector)).toBe(serverContent)
    expect(recoverableErrors).toEqual([])
  } finally {
    if (root) {
      await act(async () => {
        root.unmount()
        await Promise.resolve()
      })
    }
    container.remove()
  }
})

it('keeps other themes lazy and reuses their layout components', async () => {
  expect(mockSecondaryLoads).not.toHaveBeenCalled()
  const AlternateLayout = getBaseLayoutByTheme('nobelium')
  expect(getBaseLayoutByTheme('nobelium')).toBe(AlternateLayout)
  expect(mockSecondaryLoads).not.toHaveBeenCalled()

  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  try {
    await act(async () => {
      root.render(<AlternateLayout>Other theme</AlternateLayout>)
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    expect(mockSecondaryLoads).toHaveBeenCalledTimes(1)
    expect(container.querySelector('#theme-nobelium').textContent).toBe('Other theme')
  } finally {
    await act(async () => {
      root.unmount()
      await Promise.resolve()
    })
    container.remove()
  }
})
