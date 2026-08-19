export const normalizeNavPath = value => {
  const rawPath = String(value || '/')
    .split('?')[0]
    .split('#')[0]

  let decodedPath = rawPath
  try {
    decodedPath = decodeURIComponent(rawPath)
  } catch (error) {
    decodedPath = rawPath
  }

  const normalized = decodedPath.replace(/\/+$/, '')
  return normalized || '/'
}

export const isNavActive = (currentPath, targetHref) => {
  if (!targetHref || /^https?:\/\//i.test(targetHref) || targetHref === '#') {
    return false
  }

  const current = normalizeNavPath(currentPath)
  const target = normalizeNavPath(targetHref)

  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}

export const isMenuActive = (currentPath, link) => {
  if (isNavActive(currentPath, link?.href)) return true
  return Boolean(
    link?.subMenus?.some(subMenu => isNavActive(currentPath, subMenu?.href))
  )
}
