import SmartLink from '@/components/SmartLink'
import { formatDateFmt } from '@/lib/utils/formatDate'

/**
 * 文章标题与元信息
 */
export default function ArticleInfo({ post }) {
  return (
    <section className='mb-8 mt-2 leading-8 text-slate-600 dark:text-slate-400'>
      <h1 className='blog-item-title mb-5 text-2xl font-extrabold leading-tight text-slate-950 no-underline dark:text-slate-50 md:text-4xl'>
        {post?.title}
      </h1>

      {post?.type !== 'Page' && (
        <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'>
          <SmartLink
            href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
            className='transition hover:text-blue-600'>
            <i className='fa-regular fa-clock mr-1.5' />
            {post?.publishDay}
          </SmartLink>

          {post?.category && (
            <SmartLink
              href={`/category/${encodeURIComponent(post.category)}`}
              className='transition hover:text-blue-600'>
              <i className='fa-regular fa-folder mr-1.5' />
              {post.category}
            </SmartLink>
          )}

          {post?.tags?.map(tag => (
            <SmartLink
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className='rounded-full border border-blue-100 bg-blue-50/70 px-2.5 py-0.5 text-xs font-semibold text-blue-700 no-underline transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300'>
              {tag}
            </SmartLink>
          ))}

          <span className='hidden busuanzi_container_page_pv font-light'>
            <i className='fas fa-eye mr-1' />
            <span className='busuanzi_value_page_pv' />
          </span>
        </div>
      )}
    </section>
  )
}
