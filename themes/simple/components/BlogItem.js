import LazyImage from '@/components/LazyImage'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import CONFIG from '../config'

const getLabel = value => {
  if (Array.isArray(value)) return getLabel(value[0])
  if (value && typeof value === 'object') {
    return getLabel(value.name || value.title || value.label)
  }
  return value ? String(value) : ''
}

export const BlogItem = ({ post }) => {
  const { NOTION_CONFIG } = useGlobal()
  const showPageCover = siteConfig('SIMPLE_POST_COVER_ENABLE', false, CONFIG)
  const showPreview =
    !post.searchHit &&
    siteConfig('POST_LIST_PREVIEW', false, NOTION_CONFIG) &&
    post.blockMap
  const category = getLabel(post.category)
  const publishDate = post.date?.start_date || post.publishDay || post.createdTime
  const archiveMonth = post.publishDate
    ? formatDateFmt(post.publishDate, 'yyyy-MM')
    : ''

  return (
    <article className='zeurd-blog-item'>
      {showPageCover && post?.pageCoverThumbnail && (
        <SmartLink
          href={post.href}
          className='zeurd-blog-cover'
          aria-label={`阅读《${post.title}》`}>
          <LazyImage
            src={post.pageCoverThumbnail}
            alt={post.title || '文章封面'}
            width={1200}
            height={600}
            className='zeurd-blog-cover-image'
          />
        </SmartLink>
      )}

      <div className='zeurd-blog-content'>
        <h2>
          <SmartLink href={post.href} className='zeurd-blog-title'>
            {post.title}
          </SmartLink>
        </h2>

        <div className='zeurd-blog-meta' aria-label='文章信息'>
          {archiveMonth ? (
            <SmartLink href={`/archive#${archiveMonth}`}>
              <i className='fa-regular fa-clock' aria-hidden='true' />
              <time dateTime={post.date?.start_date || post.publishDay}>
                {publishDate}
              </time>
            </SmartLink>
          ) : (
            <span>
              <i className='fa-regular fa-clock' aria-hidden='true' />
              <time dateTime={post.date?.start_date || post.publishDay}>
                {publishDate}
              </time>
            </span>
          )}

          {category && (
            <SmartLink href={`/category/${encodeURIComponent(category)}`}>
              <i className='fa-regular fa-folder' aria-hidden='true' />
              <span>{category}</span>
            </SmartLink>
          )}

          <TwikooCommentCount post={post} />
        </div>

        {post?.tags?.length > 0 && (
          <div className='zeurd-tag-row' aria-label='文章标签'>
            {post.tags.map(tag => {
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
          </div>
        )}

        <div className='zeurd-blog-summary'>
          {post.searchHit ? (
            <p className='zeurd-search-hit'>
              <span className='zeurd-search-hit-source'>
                命中{post.searchMatchSource || '内容'}
              </span>
              {post.searchHit}
            </p>
          ) : (
            !showPreview && post.summary && (
              <p className='zeurd-summary-clamp'>{post.summary}</p>
            )
          )}

          {showPreview && (
            <div className='zeurd-list-preview'>
              <NotionPage post={post} />
            </div>
          )}
        </div>

        <div className='zeurd-blog-actions'>
          <SmartLink href={post.href} className='zeurd-read-more zeurd-control'>
            <span>阅读全文</span>
            <i className='fa-solid fa-arrow-right' aria-hidden='true' />
          </SmartLink>
        </div>
      </div>
    </article>
  )
}
