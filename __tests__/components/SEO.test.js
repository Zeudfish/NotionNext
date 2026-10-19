// Undo the global Head stub: these regressions concern real document metadata.
jest.unmock('next/head')
jest.mock('next/router', () => ({ useRouter: jest.fn() }))
jest.mock('@/lib/global', () => ({
  getGlobalSnapshot: jest.fn(),
  useGlobal: jest.fn()
}))
jest.mock('@/lib/db/SiteDataApi', () => ({ fetchGlobalAllData: jest.fn() }))
jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  fetchNotionPageBlocks: jest.fn()
}))

import { render } from '@testing-library/react'
import { useRouter } from 'next/router'
import initHeadManager from 'next/dist/client/head-manager'
import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime'
import SEO from '@/components/SEO'
import IndexingPolicy from '@/components/IndexingPolicy'
import FoodPage from '@/pages/food'
import { getGlobalSnapshot, useGlobal } from '@/lib/global'

const siteInfo = {
  title: 'Zeurd · 测试站',
  description: '工作、研究与生活',
  icon: '/icon.svg',
  pageCover: '/site-cover.jpg',
  link: 'https://www.zeurd.com'
}
const NOTION_CONFIG = {
  LINK: siteInfo.link,
  LANG: 'zh-CN',
  FONT_URL: 'false'
}
const foodDescription =
  'Zeurd 的上海吃饭清单：按复刷意愿和推荐程度整理，支持按区域、人均、菜系和等级筛选。'
const sharedProps = { siteInfo, NOTION_CONFIG }
const foodProps = {
  ...sharedProps,
  allItems: [],
  defaultItems: [],
  options: { districts: [], cuisines: [], priorities: [] }
}

let headManager

function setRoute(route, asPath = route) {
  useRouter.mockReturnValue({ route, pathname: route, asPath, query: {}, isFallback: false })
}

function pageHead(pageProps, children) {
  return (
    <HeadManagerContext.Provider value={headManager}>
      <SEO {...pageProps} />
      <IndexingPolicy {...pageProps} />
      {children}
    </HeadManagerContext.Provider>
  )
}

function expectMetadata({ title, description, url }) {
  expect(document.title).toBe(title)
  expect(document.head.querySelectorAll('title')).toHaveLength(1)
  expect(document.title).not.toMatch(/loading|undefined/i)

  for (const [selector, value] of [
    ['meta[name="description"]', description],
    ['meta[property="og:title"]', title],
    ['meta[property="og:description"]', description],
    ['meta[name="twitter:title"]', title],
    ['meta[name="twitter:description"]', description]
  ]) {
    const elements = document.head.querySelectorAll(selector)
    expect(elements).toHaveLength(1)
    expect(elements[0]).toHaveAttribute('content', value)
  }

  const canonicals = document.head.querySelectorAll('link[rel="canonical"]')
  expect(canonicals).toHaveLength(1)
  expect(canonicals[0]).toHaveAttribute('href', url)
  const openGraphUrls = document.head.querySelectorAll('meta[property="og:url"]')
  expect(openGraphUrls.length).toBeGreaterThan(0)
  openGraphUrls.forEach(element => expect(element).toHaveAttribute('content', url))
}

beforeEach(() => {
  // Next's client head manager reconciles tags using the marker emitted by _document.
  document.head.innerHTML = '<meta name="next-head-count" content="0">'
  headManager = initHeadManager()
  getGlobalSnapshot.mockReturnValue({ siteInfo, NOTION_CONFIG })
  useGlobal.mockReturnValue({ locale: {} })
  setRoute('/food')
})

describe('SEO for the food page', () => {
  it('supplies food metadata without a Notion post', () => {
    setRoute('/food', '/food?utm_source=test#filters')
    const view = render(pageHead(sharedProps))

    try {
      expectMetadata({
        title: '上海吃饭清单 | Zeurd · 测试站',
        description: foodDescription,
        url: 'https://www.zeurd.com/food'
      })
      expect(document.head.querySelector('meta[property="og:type"]'))
        .toHaveAttribute('content', 'website')
    } finally {
      // Unmount before jest.setup clears the head, so Next can reconcile its tags.
      view.unmount()
    }
  })

  it('updates one document title and all metadata across article, food and home navigation', () => {
    const post = {
      title: '示例文章',
      slug: 'article/example-post',
      summary: '这是一篇文章的摘要。',
      type: 'Post',
      status: 'Published',
      category: ['技术分享'],
      tags: ['研究']
    }
    setRoute('/[...prefix]', '/article/example-post')
    const view = render(pageHead({ ...sharedProps, post }))

    try {
      expectMetadata({
        title: '示例文章 | Zeurd · 测试站',
        description: post.summary,
        url: 'https://www.zeurd.com/article/example-post'
      })
      expect(document.head.querySelector('meta[property="article:author"]')).not.toBeNull()

      setRoute('/food')
      view.rerender(pageHead(foodProps, <FoodPage {...foodProps} />))
      expectMetadata({
        title: '上海吃饭清单 | Zeurd · 测试站',
        description: foodDescription,
        url: 'https://www.zeurd.com/food'
      })
      expect(document.head.querySelector('meta[property="article:author"]')).toBeNull()

      setRoute('/')
      view.rerender(pageHead(sharedProps))
      expectMetadata({
        title: 'Zeurd · 测试站 | 工作、研究与生活',
        description: siteInfo.description,
        url: 'https://www.zeurd.com/'
      })
      expect(document.head.querySelector('meta[property="article:author"]')).toBeNull()
    } finally {
      view.unmount()
    }
  })
})
