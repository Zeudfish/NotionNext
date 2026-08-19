import URL_MIGRATIONS from '@/conf/url-migrations.json'
import {
  isExternalOrActionSlug,
  normalizePathname,
  normalizeRouteSlug
} from '@/lib/site/publication'

const CONTENT_TYPES = new Set(['Post', 'Page'])
const PUBLISHED_STATUS = 'Published'

const cleanText = value => String(value ?? '').trim()

const isPlaceholderText = value => {
  const normalized = cleanText(value).toLowerCase()
  return !normalized || normalized === 'null' || normalized === 'undefined'
}

const getRowLabel = (row, index) => {
  const title = cleanText(row?.title)
  const id = cleanText(row?.id)
  return title || id || `第 ${index + 1} 行`
}

const normalizePreviousSlugs = row => {
  const value = row?.ext?.previousSlugs
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return value.split(',')
  return []
}

function validateMigrationRegistry(errors) {
  const normalized = new Map()

  for (const [sourceValue, destinationValue] of Object.entries(
    URL_MIGRATIONS
  )) {
    const source = normalizePathname(sourceValue)
    const destination = normalizePathname(destinationValue)

    if (source === destination) {
      errors.push(`URL 迁移不能指向自身：${source}`)
      continue
    }
    if (normalized.has(source)) {
      errors.push(`URL 迁移源重复：${source}`)
      continue
    }
    normalized.set(source, destination)
  }

  for (const source of normalized.keys()) {
    const visited = new Set()
    let cursor = source
    while (normalized.has(cursor)) {
      if (visited.has(cursor)) {
        errors.push(`URL 迁移存在循环：${source}`)
        break
      }
      visited.add(cursor)
      cursor = normalized.get(cursor)
    }
  }
}

export function validateContentRows(
  rows,
  { allowedCategories = [] } = {}
) {
  const errors = []
  const warnings = []
  const slugOwners = new Map()
  const categorySet = new Set(allowedCategories.map(cleanText).filter(Boolean))

  validateMigrationRegistry(errors)

  for (const [index, row] of (rows || []).entries()) {
    const label = getRowLabel(row, index)
    const type = cleanText(row?.type)
    const status = cleanText(row?.status)
    const title = cleanText(row?.title)
    const slug = cleanText(row?.slug)
    const isContent = CONTENT_TYPES.has(type)
    const isPublished = status === PUBLISHED_STATUS

    if (type !== 'Config' && isPlaceholderText(title)) {
      errors.push(`${label}：title 不能为空，也不能是 null/undefined`)
    }

    if (isContent && isPublished && !slug) {
      errors.push(`${label}：Published ${type} 必须填写 slug`)
    }

    if (isContent && slug && !isExternalOrActionSlug(slug)) {
      const normalizedSlug = normalizeRouteSlug(slug).toLowerCase()
      const owner = slugOwners.get(normalizedSlug)
      if (owner) {
        errors.push(
          `${label}：slug “${slug}” 与 “${owner}” 重复，slug 必须全局唯一`
        )
      } else {
        slugOwners.set(normalizedSlug, label)
      }
    }

    if (isContent && isPublished && !row?.date?.start_date) {
      errors.push(`${label}：Published ${type} 必须填写明确的发布日期`)
    }

    if (type === 'Post' && isPublished && !cleanText(row?.summary)) {
      errors.push(`${label}：Published Post 必须填写 summary`)
    }

    if (type === 'Post' && isPublished) {
      const category = cleanText(row?.category)
      if (!category) {
        errors.push(`${label}：Published Post 必须填写 category`)
      } else if (categorySet.size > 0 && !categorySet.has(category)) {
        errors.push(`${label}：category “${category}” 不在数据库允许值中`)
      }
    }

    for (const previousSlugValue of normalizePreviousSlugs(row)) {
      const previousPath = normalizePathname(previousSlugValue)
      const currentPath = normalizePathname(slug)
      const mappedPath = URL_MIGRATIONS[previousPath]
        ? normalizePathname(URL_MIGRATIONS[previousPath])
        : null

      if (!mappedPath) {
        errors.push(
          `${label}：旧 slug “${previousPath}” 未登记 URL 迁移映射`
        )
      } else if (mappedPath !== currentPath) {
        errors.push(
          `${label}：旧 slug “${previousPath}” 当前映射到 ${mappedPath}，应映射到 ${currentPath}`
        )
      }
    }
  }

  if ((rows || []).length === 0) {
    warnings.push('未读取到任何 Notion 内容行，无法执行发布前数据校验')
  }

  return { errors, warnings }
}

export function formatContentValidationReport({ errors, warnings }) {
  const lines = ['Notion 发布前数据校验失败：']

  errors.forEach((error, index) => {
    lines.push(`${index + 1}. ${error}`)
  })

  if (warnings.length > 0) {
    lines.push('', '警告：')
    warnings.forEach((warning, index) => {
      lines.push(`${index + 1}. ${warning}`)
    })
  }

  return lines.join('\n')
}
