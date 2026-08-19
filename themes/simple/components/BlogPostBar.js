const getCountText = postCount =>
  Number.isFinite(Number(postCount)) ? `共 ${postCount} 篇` : ''

export default function BlogPostBar({
  tag,
  category,
  keyword,
  categoryDescription,
  postCount
}) {
  let icon = ''
  let eyebrow = ''
  let title = ''
  let description = ''

  if (keyword) {
    icon = 'fas fa-magnifying-glass'
    eyebrow = 'SEARCH'
    title = `搜索：${keyword}`
    description = '按标题、摘要、分类、标签与正文内容匹配。'
  } else if (category) {
    icon = 'fas fa-folder-open'
    eyebrow = 'CATEGORY'
    title = category
    description = categoryDescription || ''
  } else if (tag) {
    icon = 'fas fa-tag'
    eyebrow = 'TAG'
    title = tag
  } else {
    return null
  }

  return (
    <header className='zeurd-list-header'>
      <div className='zeurd-list-eyebrow'>
        <i className={icon} aria-hidden='true' />
        <span>{eyebrow}</span>
      </div>
      <div className='zeurd-list-title-row'>
        <h1>{title}</h1>
        {getCountText(postCount) && (
          <span className='zeurd-list-count'>{getCountText(postCount)}</span>
        )}
      </div>
      {description && <p>{description}</p>}
    </header>
  )
}
