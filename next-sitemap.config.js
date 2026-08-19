const BLOG = require('./blog.config')

/**
 * 动态 sitemap 由 /pages/sitemap.xml.js 生成。
 * 这里主要约束静态导出场景，并生成 robots.txt。
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'weekly',
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/404',
    '/api/*',
    '/archive',
    '/category',
    '/category/*',
    '/feed',
    '/rss/*',
    '/search',
    '/search/*',
    '/shanghai-food',
    '/tag',
    '/tag/*'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/404', '/api', '/search']
      }
    ]
  }
}
