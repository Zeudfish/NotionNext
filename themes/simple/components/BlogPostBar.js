import { useGlobal } from '@/lib/global'

/**
 * 文章列表上方嵌入
 * @param {*} props
 * @returns
 */
export default function BlogPostBar(props) {
  const { tag, category, categoryDescription, postCount } = props
  const { locale } = useGlobal()

  if (tag) {
    return (
      <div className='flex items-center py-2 text-xl'>
        <i className='fas fa-tag mr-2' />
        {locale.COMMON.TAGS}: {tag}
      </div>
    )
  } else if (category) {
    return (
      <section className='mb-8 border-b border-gray-100 pb-6 dark:border-gray-800'>
        <div className='flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100'>
          <i className='fas fa-th mr-3 text-blue-500' />
          {category}
        </div>
        {categoryDescription && (
          <p className='mt-3 max-w-3xl text-sm leading-7 text-gray-500 dark:text-gray-400 md:text-base'>
            {categoryDescription}
          </p>
        )}
        {Number.isFinite(Number(postCount)) && (
          <div className='mt-3 text-xs text-gray-400 dark:text-gray-500'>
            共 {postCount} 篇
          </div>
        )}
      </section>
    )
  } else {
    return <></>
  }
}
