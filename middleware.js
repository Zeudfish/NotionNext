import { NextResponse } from 'next/server'
import URL_MIGRATIONS from './conf/url-migrations.json'

const normalizePathname = value => {
  const pathname = String(value || '/')
  if (pathname === '/') return '/'
  return `/${pathname.replace(/^\/+|\/+$/g, '')}`
}

export function middleware(request) {
  const source = normalizePathname(request.nextUrl.pathname)
  const destinationPath = URL_MIGRATIONS[source]

  if (!destinationPath) {
    return NextResponse.next()
  }

  const destination = request.nextUrl.clone()
  destination.pathname = normalizePathname(destinationPath)
  return NextResponse.redirect(destination, 308)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
}
