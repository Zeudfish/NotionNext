import SmartLink from '@/components/SmartLink'

const toHeadingId = value =>
  `archive-${String(value || '')
    .trim()
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/^-+|-+$/g, '')}-heading`

export default function BlogArchiveItem({ archiveTitle, archivePosts }) {
  const posts = archivePosts?.[archiveTitle] || []
  const headingId = toHeadingId(archiveTitle)

  return (
    <section
      id={String(archiveTitle)}
      className='zeurd-archive-group'
      aria-labelledby={headingId}>
      <h2 id={headingId}>{archiveTitle}</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id} id={post.publishDay}>
            <SmartLink href={post.href} className='zeurd-archive-link'>
              <time dateTime={post.date?.start_date}>{post.date?.start_date}</time>
              <span>{post.title}</span>
            </SmartLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
