const fs = require('node:fs')
const path = require('node:path')
const BLOG = require('./blog.config')
const { extractLangPrefix } = require('./lib/utils/pageId')
const { isExport } = require('./lib/utils/buildMode')
const { getStaticPageGenerationTimeoutSec } = require('./lib/build/buildEnv')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: BLOG.BUNDLE_ANALYZER
})

const themes = scanSubdirectories(path.resolve(__dirname, 'themes'))
const locales = getConfiguredLocales()

const contentSecurityPolicyReportOnly = [
  "default-src 'self' https: data: blob:",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https: http:",
  "media-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https:",
  "worker-src 'self' blob:"
].join('; ')

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: contentSecurityPolicyReportOnly
  }
]

function getConfiguredLocales() {
  const langs = [BLOG.LANG]
  if (!BLOG.NOTION_PAGE_ID.includes(',')) return langs

  for (const siteId of BLOG.NOTION_PAGE_ID.split(',')) {
    const prefix = extractLangPrefix(siteId)
    if (prefix && !langs.includes(prefix)) langs.push(prefix)
  }
  return langs
}

function scanSubdirectories(directory) {
  return fs
    .readdirSync(directory)
    .filter(file => fs.statSync(path.join(directory, file)).isDirectory())
}

function isVersionedPageBlockCacheKey(key) {
  return /^page_block_.+_\d{10,}$/.test(String(key || ''))
}

function pruneTransientNotionDataCache(dataDir) {
  if (!fs.existsSync(dataDir)) return

  let removed = 0
  let kept = 0
  for (const name of fs.readdirSync(dataDir)) {
    if (!name.endsWith('.json')) continue

    const file = path.join(dataDir, name)
    try {
      const entry = JSON.parse(fs.readFileSync(file, 'utf8'))
      if (isVersionedPageBlockCacheKey(entry?.key)) {
        kept++
        continue
      }
    } catch {}

    fs.rmSync(file, { force: true })
    removed++
  }

  console.log(
    `Pruned transient Notion cache entries: removed=${removed} kept=${kept}`
  )
}

function getOutput() {
  if (isExport()) return 'export'
  if (process.env.NEXT_BUILD_STANDALONE === 'true') return 'standalone'
  return undefined
}

function getLocaleRewrites() {
  if (!BLOG.NOTION_PAGE_ID.includes(',')) return []

  const langs = BLOG.NOTION_PAGE_ID.split(',')
    .map(extractLangPrefix)
    .filter(Boolean)
  if (langs.length === 0) return []

  const matcher = langs.join('|')
  return [
    {
      source: `/:locale(${matcher})/:path*`,
      destination: '/:path*'
    },
    {
      source: `/:locale(${matcher})`,
      destination: '/'
    },
    {
      source: `/:locale(${matcher})/`,
      destination: '/'
    }
  ]
}

;(function printDevCacheHint() {
  if (process.env.npm_lifecycle_event !== 'dev') return

  const lockFile = path.join(__dirname, '.next', 'dev-cache-hint.lock')
  const siblingWindowMs = 15_000
  try {
    fs.mkdirSync(path.dirname(lockFile), { recursive: true })
    if (fs.existsSync(lockFile)) {
      const age = Date.now() - fs.statSync(lockFile).mtimeMs
      if (age < siblingWindowMs) return
      try {
        fs.unlinkSync(lockFile)
      } catch (error) {
        if (error?.code !== 'ENOENT') return
      }
    }
    fs.closeSync(fs.openSync(lockFile, 'wx'))
  } catch (error) {
    return
  }

  console.log(
    '[NotionNext] Dev cache ON (ENABLE_CACHE=true); live Notion data → ENABLE_CACHE=false in .env.local'
  )
})()

;(function prepareBuildCache() {
  if (!['export', 'build'].includes(process.env.npm_lifecycle_event)) return
  if (process.env.NEXT_PRIVATE_BUILD_WORKER) return

  for (const sitemapPath of [
    path.resolve(__dirname, 'public', 'sitemap.xml'),
    path.resolve(__dirname, 'sitemap.xml')
  ]) {
    if (fs.existsSync(sitemapPath)) fs.unlinkSync(sitemapPath)
  }

  const rssDir = path.resolve(__dirname, 'public', 'rss')
  for (const name of ['feed.xml', 'atom.xml', 'feed.json']) {
    fs.rmSync(path.join(rssDir, name), { force: true })
  }

  const notionCacheRoot = path.resolve(__dirname, '.next', 'cache', 'notion')
  const dataDir = path.join(notionCacheRoot, 'data')
  const sessionsDir = path.join(notionCacheRoot, 'sessions')
  const sessionFile = path.join(notionCacheRoot, 'build-session.json')

  if (process.env.NOTION_BUILD_CACHE_PURGE_DATA === 'true') {
    fs.rmSync(dataDir, { recursive: true, force: true })
  } else {
    pruneTransientNotionDataCache(dataDir)
  }

  fs.rmSync(sessionsDir, { recursive: true, force: true })
  fs.mkdirSync(notionCacheRoot, { recursive: true })
  fs.writeFileSync(
    sessionFile,
    JSON.stringify(
      {
        sessionId: `${process.env.npm_lifecycle_event}-${Date.now()}-${process.pid}`,
        createdAt: new Date().toISOString(),
        lifecycle: process.env.npm_lifecycle_event,
        pid: process.pid
      },
      null,
      2
    )
  )
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  output: getOutput(),
  env: {
    NEXT_PUBLIC_IS_EXPORT: isExport() ? 'true' : 'false'
  },
  staticPageGenerationTimeout: getStaticPageGenerationTimeoutSec(),
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  swcMinify: true,
  modularizeImports: {
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}'
    },
    '@heroicons/react/24/solid': {
      transform: '@heroicons/react/24/solid/{{member}}'
    }
  },
  i18n: process.env.EXPORT
    ? undefined
    : {
      defaultLocale: BLOG.LANG,
      locales
    },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ],
    loader: 'default',
    minimumCacheTTL: 60 * 60 * 24 * 7,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  redirects: process.env.EXPORT
    ? undefined
    : async () => [
      {
        source: '/feed',
        destination: '/rss/feed.xml',
        permanent: true
      }
    ],
  rewrites: process.env.EXPORT
    ? undefined
    : async () => [
      ...getLocaleRewrites(),
      { source: '/rss/feed.xml', destination: '/api/rss' },
      { source: '/rss/atom.xml', destination: '/api/rss?format=atom' },
      { source: '/rss/feed.json', destination: '/api/rss?format=json' },
      { source: '/:path*.html', destination: '/:path*' }
    ],
  headers: process.env.EXPORT
    ? undefined
    : async () => [
      {
        source: '/vendor/fontawesome/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          ...securityHeaders
        ]
      },
      {
        source: '/:path*{/}?',
        headers: securityHeaders
      }
    ],
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['lodash.throttle'] = path.resolve(
      __dirname,
      'lib/utils/throttle.js'
    )

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        path: false
      }
    }
    return config
  },
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['@heroicons/react', 'lodash']
  },
  exportPathMap(defaultPathMap) {
    const pages = { ...defaultPathMap }
    delete pages['/sitemap.xml']
    delete pages['/auth']
    return pages
  },
  publicRuntimeConfig: {
    THEMES: themes
  }
}

module.exports = process.env.ANALYZE
  ? withBundleAnalyzer(nextConfig)
  : nextConfig
