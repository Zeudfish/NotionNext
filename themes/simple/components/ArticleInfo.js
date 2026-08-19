import SmartLink from '@/components/SmartLink'
import { formatDateFmt } from '@/lib/utils/formatDate'

const getLabel = value => {
  if (Array.isArray(value)) return getLabel(value[0])
  if (value && typeof value === 'object') {
    return getLabel(value.name || value.title || value.label)
  }
  return value ? String(value) : ''
}

export default function ArticleInfo({ post }) {
  const category = getLabel(post?.category)
  const archiveMonth = post?.publishDate
    ? formatDateFmt(post.publishDate, 'yyyy-MM')
    : ''

  return (
    <header className='zeurd-article-info'>
      <h1 className='blog-item-title'>{post?.title}</h1>

      {post?.type !== 'Page' && (
        <div className='zeurd-article-meta' aria-label='文章信息'>
          {archiveMonth ? (
            <SmartLink href={`/archive#${archiveMonth}`}>
              <i className='fa-regular fa-clock' aria-hidden='true' />
              <time dateTime={post?.publishDay}>{post?.publishDay}</time>
            </SmartLink>
          ) : (
            <span>
              <i className='fa-regular fa-clock' aria-hidden='true' />
              <time dateTime={post?.publishDay}>{post?.publishDay}</time>
            </span>
          )}

          {category && (
            <SmartLink href={`/category/${encodeURIComponent(category)}`}>
              <i className='fa-regular fa-folder' aria-hidden='true' />
              <span>{category}</span>
            </SmartLink>
          )}

          {post?.tags?.map(tag => {
            const tagName = getLabel(tag)
            return tagName ? (
              <SmartLink
                key={tagName}
                href={`/tag/${encodeURIComponent(tagName)}`}
                className='zeurd-tag-chip'>
                {tagName}
              </SmartLink>
            ) : null
          })}

          <span className='hidden busuanzi_container_page_pv'>
            <i className='fas fa-eye' aria-hidden='true' />
            <span className='busuanzi_value_page_pv' />
          </span>
        </div>
      )}
    </header>
  )
}
