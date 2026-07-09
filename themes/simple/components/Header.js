import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import SocialButton from './SocialButton'

/**
 * 网站顶部
 * @returns
 */
export default function Header(props) {
  const { siteInfo, postCount } = props
  const tagline = siteConfig('SIMPLE_LOGO_DESCRIPTION', null, CONFIG)
  const description = siteConfig('DESCRIPTION')

  return (
    <header className='zeurd-simple-hero relative z-10 overflow-hidden px-5 py-12 text-left md:px-8 md:py-16'>
      <div className='zeurd-hero-shell mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between'>
        <SmartLink href='/' className='zeurd-hero-main group flex flex-col gap-6 text-inherit md:flex-row md:items-center'>
          <div className='zeurd-avatar-wrap shrink-0'>
            <LazyImage
              priority={true}
              src={siteInfo?.icon}
              className='zeurd-avatar rounded-full'
              width={104}
              height={104}
              alt={siteConfig('AUTHOR')}
            />
          </div>

          <div className='zeurd-hero-copy'>
            <div className='zeurd-kicker'>Research notes · Engineering logs</div>
            <h1 className='zeurd-title'>{siteConfig('AUTHOR')}</h1>
            <div
              className='zeurd-tagline'
              dangerouslySetInnerHTML={{ __html: tagline }}
            />
            {description && <p className='zeurd-description'>{description}</p>}
          </div>
        </SmartLink>

        <div className='zeurd-hero-side'>
          <div className='zeurd-stat-card'>
            <span className='zeurd-stat-number'>{postCount || '--'}</span>
            <span className='zeurd-stat-label'>notes published</span>
          </div>
          <div className='zeurd-pill-row' aria-label='site topics'>
            <span>VLM</span>
            <span>Low-level Vision</span>
            <span>Deployment</span>
          </div>
          <SocialButton />
        </div>
      </div>

      <style jsx global>{`
        #theme-simple > .zeurd-simple-hero {
          height: auto !important;
          min-height: 0 !important;
          border-bottom: 1px solid rgba(37, 99, 235, 0.12) !important;
          background:
            radial-gradient(circle at 18% 20%, rgba(37, 99, 235, 0.18), transparent 24rem),
            radial-gradient(circle at 92% 10%, rgba(194, 65, 12, 0.16), transparent 22rem),
            linear-gradient(135deg, rgba(255, 251, 245, 0.96), rgba(239, 246, 255, 0.86)) !important;
        }

        .dark #theme-simple > .zeurd-simple-hero {
          border-bottom-color: rgba(148, 163, 184, 0.16) !important;
          background:
            radial-gradient(circle at 18% 15%, rgba(59, 130, 246, 0.26), transparent 24rem),
            radial-gradient(circle at 86% 0%, rgba(249, 115, 22, 0.18), transparent 20rem),
            linear-gradient(135deg, #050816, #0b1020 58%, #111827) !important;
        }

        .zeurd-simple-hero::before {
          position: absolute;
          inset: 0;
          pointer-events: none;
          content: '';
          background-image:
            linear-gradient(rgba(37, 99, 235, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.05) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0.65), transparent 76%);
        }

        .zeurd-hero-shell {
          position: relative;
        }

        .zeurd-hero-main {
          text-decoration: none !important;
        }

        .zeurd-avatar-wrap {
          width: 116px;
          height: 116px;
          border-radius: 32px;
          padding: 6px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(219, 234, 254, 0.72));
          box-shadow: 0 22px 60px rgba(37, 99, 235, 0.22);
          transform: rotate(-2deg);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .zeurd-hero-main:hover .zeurd-avatar-wrap {
          transform: rotate(0deg) translateY(-2px);
          box-shadow: 0 28px 72px rgba(37, 99, 235, 0.28);
        }

        #theme-simple .zeurd-avatar {
          width: 104px !important;
          height: 104px !important;
          border: 0 !important;
          border-radius: 26px !important;
          box-shadow: none !important;
          object-fit: cover;
        }

        .zeurd-kicker {
          margin-bottom: 0.45rem;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .dark .zeurd-kicker {
          color: #93c5fd;
        }

        .zeurd-title {
          margin: 0;
          color: #101828;
          font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
          font-size: clamp(2.6rem, 7vw, 5.2rem);
          font-weight: 800;
          letter-spacing: -0.075em;
          line-height: 0.92;
        }

        .dark .zeurd-title {
          color: #f8fafc;
        }

        .zeurd-tagline {
          margin-top: 1.1rem;
          color: #334155;
          font-size: clamp(1rem, 2vw, 1.28rem);
          font-weight: 650;
          letter-spacing: -0.025em;
        }

        .dark .zeurd-tagline {
          color: #cbd5e1;
        }

        .zeurd-description {
          max-width: 44rem;
          margin: 0.75rem 0 0;
          color: #667085;
          font-size: 0.98rem;
          line-height: 1.8;
        }

        .dark .zeurd-description {
          color: #94a3b8;
        }

        .zeurd-hero-side {
          display: flex;
          min-width: min(100%, 18rem);
          flex-direction: column;
          align-items: flex-start;
          gap: 0.9rem;
        }

        .zeurd-stat-card {
          width: 100%;
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 24px;
          padding: 1rem 1.1rem;
          background: rgba(255, 255, 255, 0.62);
          box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(18px);
        }

        .dark .zeurd-stat-card {
          border-color: rgba(148, 163, 184, 0.18);
          background: rgba(15, 23, 42, 0.52);
        }

        .zeurd-stat-number {
          display: block;
          color: #1d4ed8;
          font-size: 2rem;
          font-weight: 850;
          letter-spacing: -0.05em;
          line-height: 1;
        }

        .dark .zeurd-stat-number {
          color: #93c5fd;
        }

        .zeurd-stat-label {
          margin-top: 0.35rem;
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .zeurd-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .zeurd-pill-row span {
          border: 1px solid rgba(37, 99, 235, 0.14);
          border-radius: 999px;
          padding: 0.38rem 0.68rem;
          background: rgba(255, 255, 255, 0.68);
          color: #475569;
          font-size: 0.78rem;
          font-weight: 720;
          backdrop-filter: blur(12px);
        }

        .dark .zeurd-pill-row span {
          border-color: rgba(147, 197, 253, 0.16);
          background: rgba(15, 23, 42, 0.58);
          color: #cbd5e1;
        }

        #theme-simple .zeurd-hero-side .w-52 {
          width: auto !important;
          justify-content: flex-start !important;
          margin: 0 !important;
        }

        #theme-simple .zeurd-hero-side .space-x-5 {
          display: flex;
          gap: 0.9rem;
          margin: 0 !important;
          color: #475569 !important;
        }

        .dark #theme-simple .zeurd-hero-side .space-x-5 {
          color: #cbd5e1 !important;
        }

        @media (max-width: 768px) {
          #theme-simple > .zeurd-simple-hero {
            padding: 2.4rem 1.15rem !important;
          }

          .zeurd-avatar-wrap {
            width: 92px;
            height: 92px;
            border-radius: 26px;
          }

          #theme-simple .zeurd-avatar {
            width: 80px !important;
            height: 80px !important;
            border-radius: 20px !important;
          }

          .zeurd-hero-side {
            min-width: 0;
            width: 100%;
          }
        }
      `}</style>
    </header>
  )
}
