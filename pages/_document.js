// eslint-disable-next-line @next/next/no-document-import-in-page
import BLOG from '@/blog.config'
import Document, { Head, Html, Main, NextScript } from 'next/document'

const isLocalFontAwesome = BLOG.FONT_AWESOME?.startsWith(
  '/vendor/fontawesome/'
)

const darkModeScript = `
(function() {
  var darkMode = null
  try {
    darkMode = localStorage.getItem('darkMode')
  } catch (error) {}

  var prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  var defaultAppearance = '${BLOG.APPEARANCE || 'auto'}'
  var shouldBeDark = darkMode === 'true' || darkMode === 'dark'

  if (darkMode === null) {
    if (defaultAppearance === 'dark') {
      shouldBeDark = true
    } else if (defaultAppearance === 'auto') {
      var hours = new Date().getHours()
      var darkTimeStart = ${BLOG.APPEARANCE_DARK_TIME ? BLOG.APPEARANCE_DARK_TIME[0] : 18}
      var darkTimeEnd = ${BLOG.APPEARANCE_DARK_TIME ? BLOG.APPEARANCE_DARK_TIME[1] : 6}
      shouldBeDark = prefersDark || hours >= darkTimeStart || hours < darkTimeEnd
    }
  }

  document.documentElement.classList.add(shouldBeDark ? 'dark' : 'light')
})()
`

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={BLOG.LANG} suppressHydrationWarning>
        <Head>
          <meta name='color-scheme' content='light dark' />
          <meta name='referrer' content='strict-origin-when-cross-origin' />
          <link rel='preconnect' href='https://images.unsplash.com' />
          <link rel='dns-prefetch' href='//images.unsplash.com' />

          {BLOG.FONT_AWESOME && (
            <>
              {isLocalFontAwesome && (
                <>
                  <link
                    rel='preload'
                    href='/vendor/fontawesome/webfonts/fa-solid-900.woff2'
                    as='font'
                    type='font/woff2'
                    crossOrigin='anonymous'
                  />
                  <link
                    rel='preload'
                    href='/vendor/fontawesome/webfonts/fa-regular-400.woff2'
                    as='font'
                    type='font/woff2'
                    crossOrigin='anonymous'
                  />
                  <link
                    rel='preload'
                    href='/vendor/fontawesome/webfonts/fa-brands-400.woff2'
                    as='font'
                    type='font/woff2'
                    crossOrigin='anonymous'
                  />
                </>
              )}
              <style
                dangerouslySetInnerHTML={{
                  __html:
                    '.fa,.fas,.far,.fab,.fa-solid,.fa-regular,.fa-brands{display:inline-flex;width:1.25em;min-width:1.25em;height:1em;align-items:center;justify-content:center;text-align:center;line-height:1}'
                }}
              />
              <link
                id='font-awesome-css'
                rel='preload'
                as='style'
                href={BLOG.FONT_AWESOME}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html:
                    "requestAnimationFrame(function(){var l=document.getElementById('font-awesome-css');if(l)l.rel='stylesheet'})"
                }}
              />
              <noscript>
                <link rel='stylesheet' href={BLOG.FONT_AWESOME} />
              </noscript>
            </>
          )}

          <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
