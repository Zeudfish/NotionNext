import { validateContentRows } from '@/lib/site/contentValidation'

const validPost = overrides => ({
  id: 'post-1',
  title: '有效文章',
  slug: 'valid-post',
  type: 'Post',
  status: 'Published',
  summary: '摘要',
  category: '技术分享',
  date: { start_date: '2026-08-19' },
  tags: [],
  ...overrides
})

describe('validateContentRows', () => {
  it('accepts a valid published post', () => {
    const result = validateContentRows([validPost()], {
      allowedCategories: ['技术分享', '论文导读']
    })

    expect(result.errors).toEqual([])
  })

  it('blocks missing required fields and invalid categories', () => {
    const result = validateContentRows(
      [
        validPost({
          title: 'undefined',
          slug: '',
          summary: '',
          category: '不存在的分类',
          date: null
        })
      ],
      { allowedCategories: ['技术分享'] }
    )

    expect(result.errors.join('\n')).toContain('title 不能为空')
    expect(result.errors.join('\n')).toContain('必须填写 slug')
    expect(result.errors.join('\n')).toContain('必须填写明确的发布日期')
    expect(result.errors.join('\n')).toContain('必须填写 summary')
    expect(result.errors.join('\n')).toContain('不在数据库允许值中')
  })

  it('blocks duplicate local slugs', () => {
    const result = validateContentRows([
      validPost({ id: 'post-1', title: '文章一', slug: '/same-slug' }),
      validPost({ id: 'post-2', title: '文章二', slug: 'same-slug' })
    ])

    expect(result.errors.join('\n')).toContain('slug 必须全局唯一')
  })

  it('requires registered redirects for declared previous slugs', () => {
    const validMigration = validateContentRows([
      {
        id: 'food',
        title: '上海吃饭清单',
        slug: 'food',
        type: 'Page',
        status: 'Published',
        date: { start_date: '2026-06-30' },
        ext: { previousSlugs: ['/shanghai-food'] }
      }
    ])
    const missingMigration = validateContentRows([
      validPost({ ext: { previousSlugs: ['/old-valid-post'] } })
    ])

    expect(validMigration.errors).toEqual([])
    expect(missingMigration.errors.join('\n')).toContain('未登记 URL 迁移映射')
  })
})
