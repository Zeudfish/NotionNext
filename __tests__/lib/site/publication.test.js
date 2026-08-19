import {
  getCanonicalPathForPage,
  getPublishedCategoryNames,
  isIndexableContentPage,
  isPublishedContentPage,
  normalizePathname,
  resolveMigratedPath
} from '@/lib/site/publication'

describe('publication policy', () => {
  it('normalizes and resolves registered legacy paths', () => {
    expect(normalizePathname('shanghai-food/')).toBe('/shanghai-food')
    expect(resolveMigratedPath('/shanghai-food')).toBe('/food')
  })

  it('only treats Published Post and Page rows as public content', () => {
    expect(
      isPublishedContentPage({ type: 'Post', status: 'Published' })
    ).toBe(true)
    expect(
      isPublishedContentPage({ type: 'Post', status: 'Invisible' })
    ).toBe(false)
    expect(
      isPublishedContentPage({ type: 'Menu', status: 'Published' })
    ).toBe(false)
  })

  it('excludes functional, external, hidden and non-content routes', () => {
    expect(
      isIndexableContentPage({
        type: 'Post',
        status: 'Published',
        slug: 'article/hello'
      })
    ).toBe(true)
    expect(
      isIndexableContentPage({
        type: 'Page',
        status: 'Published',
        slug: '/search'
      })
    ).toBe(false)
    expect(
      isIndexableContentPage({
        type: 'Page',
        status: 'Published',
        slug: 'https://github.com/Zeudfish'
      })
    ).toBe(false)
  })

  it('returns the migrated canonical path for public pages', () => {
    expect(
      getCanonicalPathForPage({
        type: 'Page',
        status: 'Published',
        slug: 'shanghai-food'
      })
    ).toBe('/food')
  })

  it('derives category pages only from published posts', () => {
    expect(
      getPublishedCategoryNames([
        { type: 'Post', status: 'Published', category: '技术分享' },
        { type: 'Post', status: 'Invisible', category: '金融思考' },
        { type: 'Page', status: 'Published', category: '论文导读' }
      ])
    ).toEqual(['技术分享'])
  })
})
