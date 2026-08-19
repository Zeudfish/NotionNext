import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const since = Number.parseInt(siteConfig('SINCE'), 10)
  const copyrightDate =
    Number.isFinite(since) && since < currentYear
      ? `${since}–${currentYear}`
      : currentYear

  return (
    <footer className='zeurd-footer'>
      <div className='zeurd-footer-inner'>
        <div className='zeurd-footer-copy'>
          © {copyrightDate} {siteConfig('AUTHOR')}
        </div>

        <nav className='zeurd-footer-links' aria-label='页脚导航'>
          {siteConfig('BEI_AN') && (
            <a href={siteConfig('BEI_AN_LINK')} rel='nofollow'>
              {siteConfig('BEI_AN')}
            </a>
          )}
          <BeiAnGongAn />
          <a
            href='https://github.com/tangly1024/NotionNext'
            target='_blank'
            rel='noopener noreferrer'>
            NotionNext {siteConfig('VERSION')}
          </a>
        </nav>

        <DarkModeButton className='zeurd-footer-theme' />
      </div>
    </footer>
  )
}
