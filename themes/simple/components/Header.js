import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'

export default function Header({ postCount }) {
  return (
    <header className='zeurd-simple-hero'>
      <div className='zeurd-hero-shell'>
        <SmartLink
          href='/'
          className='zeurd-hero-main'
          aria-label={`${siteConfig('AUTHOR')} 首页`}>
          <h1 className='zeurd-title'>{siteConfig('AUTHOR')}</h1>
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
