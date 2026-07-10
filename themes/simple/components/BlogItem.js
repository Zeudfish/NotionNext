import LazyImage from '@/components/LazyImage'
import NotionPage from '@/components/NotionPage'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

export const BlogItem = props => {
  const { post } = props
  const { NOTION_CONFIG } = useGlobal()
  const showPageCover = siteConfig('SIMPLE_POST_COVER_ENABLE', false, CONFIG)
  const showPreview =
    siteConfig('POST_LIST_PREVIEW', false, NOTION_CONFIG) && post.blockMap

  return (
    <article className='zeurd-blog-item rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60 md:p-7'>
      <div className='flex h-full flex-col gap-5'>
        {showPageCover && (
          <SmartLink
            href={post.href}
            className='block overflow-hidden rounded-2xl'>
            <LazyImage
              src={post?.pageCoverThumbnail}
              className='aspect-[16/8] w-full object-cover object-center transition duration-500 hover:scale-105'
            />
          </SmartLink>
        )}

        <div className='flex flex-1 flex-col'>
          <h2 className='mb-3'>
            <SmartLink
              href={post.href}
              className='blog-item-title menu-link text-xl font-extrabold leading-snug text-slate-900 no-underline md:text-2xl'>
              {post.title}
            </SmartLink>
          </h2>

          <header className='mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500 dark:text-slate-400'>
            <SmartLink
              className='transition hover:text-blue-600'
              href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}>
              <i className='fa-regular fa-clock mr-1.5' />
              {post.date?.start_date || post.publishDay || post.createdTime}
            </SmartLink>

            {post.category && (
              <SmartLink
                href={`/category/${encodeURIComponent(post.category)}`}
                className='transition hover:text-blue-600'>
                <i className='fa-regular fa-folder mr-1.5' />
                {post.category}
              </SmartLink>
            )}

            <TwikooCommentCount post={post} />
          </header>

          {post?.tags?.length > 0 && (
            <div className='mb-4 flex flex-wrap gap-2'>
              {post.tags.map(tag => (
                <SmartLink
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className='rounded-full border border-blue-100 bg-blue-50/70 px-2.5 py-1 text-xs font-semibold text-blue-700 no-underline transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300'>
                  {tag}
                </SmartLink>
              ))}
            </div>
          )}

          <main className='mb-5 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-[0.95rem]'>
            {!showPreview && post.summary && (
              <p className='zeurd-summary-clamp m-0'>{post.summary}</p>
            )}
            {showPreview && post?.blockMap && (
              <div className='overflow-hidden'>
                <NotionPage post={post} />
              </div>
            )}
          </main>

          <div className='mt-auto'>
            <SmartLink
              href={post.href}
              className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-bold text-blue-700 no-underline transition hover:border-orange-200 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300'>
              阅读全文 <i className='fa-solid fa-arrow-right text-[0.65rem]' />
            </SmartLink>
          </div>
        </div>
      </div>

      <style jsx>{`
        .zeurd-summary-clamp {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      `}</style>
    </article>
  )
}
