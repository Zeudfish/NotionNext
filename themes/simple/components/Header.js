import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'

const HERO_TAGLINE = '记录工作、研究与生活中，那些值得反复琢磨的事'

export default function Header({ postCount }) {
  return (
    <header className='zeurd-simple-hero'>
      <div className='zeurd-hero-shell'>
        <SmartLink
          href='/'
          className='zeurd-hero-main'
          aria-label={`${siteConfig('AUTHOR')} 首页`}>
          <h1 className='zeurd-title'>{siteConfig('AUTHOR')}</h1>
          <p className='zeurd-description'>{HERO_TAGLINE}</p>
        </SmartLink>

        <div className='zeurd-hero-side'>
          <div className='zeurd-stat-block'>
            <span className='zeurd-stat-number'>{postCount || '--'}</span>
            <span className='zeurd-stat-label'>notes published</span>
          </div>
          <div className='zeurd-topic-line' aria-label='站点主题'>
            <span>VLM</span>
            <span>Low-level Vision</span>
            <span>Deployment</span>
          </div>
        </div>
      </div>
    </header>
  )
}
