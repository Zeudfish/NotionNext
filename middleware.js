import { getUrlMigrations } from '@/lib/config'
import { NextResponse } from 'next/server'

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/'
  const withoutTrailingSlash = pathname.replace(/\/+$/, '')
  return withoutTrailingSlash || '/'
}

function buildDestination(request, target) {
  const url = request.nextUrl.clone()
  const [targetPath, targetQuery = ''] = String(target).split('?')
  url.pathname = targetPath.startsWith('/') ? targetPath : `/${targetPath}`
  url.search = targetQuery ? `?${targetQuery}` : request.nextUrl.search
  return url
}

export function middleware(request) {
  const migrations = getUrlMigrations()
  const pathname = normalizePathname(request.nextUrl.pathname)
  const target = migrations[pathname]

  if (!target) {
    return NextResponse.next()
  }

  return NextResponse.redirect(buildDestination(request, target), 301)
}

export const config = {
  matcher: ['/article/:path*', '/page/:path*']
}
