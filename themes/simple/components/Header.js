import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'

const HERO_TAGLINE = '记录工作、研究与生活中，那些值得反复琢磨的事'

/**
 * 首页顶部 Hero
 */
export default function Header(props) {
  const { postCount } = props

  return (
    <header className='zeurd-simple-hero relative z-10 overflow-hidden px-5 py-11 text-left md:px-8 md:py-14'>
      <div className='zeurd-hero-shell mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between'>
        <SmartLink
          href='/'
          className='zeurd-hero-main min-w-0 flex-1 text-inherit'>
          <div className='zeurd-hero-copy'>
            <h1 className='zeurd-title'>{siteConfig('AUTHOR')}</h1>
            <p className='zeurd-description'>{HERO_TAGLINE}</p>
          </div>
        </SmartLink>

        <div className='zeurd-hero-side'>
          <div className='zeurd-stat-block'>
            <span className='zeurd-stat-number'>{postCount || '--'}</span>
            <span className='zeurd-stat-label'>notes published</span>
          </div>
          <div className='zeurd-topic-line' aria-label='site topics'>
            <span>VLM</span>
            <span>Low-level Vision</span>
            <span>Deployment</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        #theme-simple > .zeurd-simple-hero {
          height: auto !important;
          min-height: 0 !important;
          border-bottom: 1px solid rgba(37, 99, 235, 0.1) !important;
          background:
            radial-gradient(
              circle at 18% 18%,
              rgba(37, 99, 235, 0.12),
              transparent 27rem
            ),
            linear-gradient(115deg, #f8fbff 0%, #ffffff 62%, #f9fbff 100%) !important;
        }

        .dark #theme-simple > .zeurd-simple-hero {
          border-bottom-color: rgba(148, 163, 184, 0.14) !important;
          background:
            radial-gradient(
              circle at 18% 16%,
              rgba(59, 130, 246, 0.2),
              transparent 27rem
            ),
            linear-gradient(115deg, #070b14 0%, #0a0f1c 64%, #0c1220 100%) !important;
        }

        .zeurd-hero-shell {
          position: relative;
        }

        .zeurd-hero-main {
          text-decoration: none !important;
        }

        .zeurd-title {
          margin: 0;
          color: #101828;
          font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
          font-size: clamp(3.1rem, 7vw, 5.35rem);
          font-weight: 800;
          letter-spacing: -0.075em;
          line-height: 0.92;
        }

        .dark .zeurd-title {
          color: #f8fafc;
        }

        .zeurd-description {
          max-width: 42rem;
          margin: 1.25rem 0 0;
          color: #475569;
          font-size: clamp(0.98rem, 1.6vw, 1.12rem);
          font-weight: 400;
          letter-spacing: 0.005em;
          line-height: 1.75;
        }

        .dark .zeurd-description {
          color: #aeb9c8;
        }

        .zeurd-hero-side {
          display: flex;
          min-width: 21rem;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.35rem;
          border-left: 2px solid #2563eb;
          padding: 0.4rem 0 0.4rem 2rem;
        }

        .zeurd-stat-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .zeurd-stat-number {
          display: block;
          color: #2563eb;
          font-size: 2.7rem;
          font-weight: 850;
          letter-spacing: -0.06em;
          line-height: 0.95;
        }

        .dark .zeurd-stat-number {
          color: #60a5fa;
        }

        .zeurd-stat-label {
          display: block;
          margin-top: 0.5rem;
          color: #64748b;
          font-size: 0.76rem;
          font-weight: 750;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .dark .zeurd-stat-label {
          color: #94a3b8;
        }

        .zeurd-topic-line {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          color: #334155;
          font-size: 0.86rem;
          font-weight: 650;
          line-height: 1.6;
        }

        .zeurd-topic-line span + span::before {
          margin: 0 0.7rem;
          color: #2563eb;
          content: '•';
        }

        .dark .zeurd-topic-line {
          color: #cbd5e1;
        }

        .dark .zeurd-topic-line span + span::before {
          color: #60a5fa;
        }

        @media (max-width: 768px) {
          #theme-simple > .zeurd-simple-hero {
            padding: 2.4rem 1.15rem 2.15rem !important;
          }

          .zeurd-title {
            font-size: clamp(3rem, 17vw, 4.4rem);
          }

          .zeurd-description {
            margin-top: 1rem;
          }

          .zeurd-hero-side {
            width: 100%;
            min-width: 0;
            gap: 0.95rem;
            border-top: 1px solid rgba(37, 99, 235, 0.2);
            border-left: 0;
            padding: 1.25rem 0 0;
          }

          .zeurd-stat-block {
            flex-direction: row;
            align-items: baseline;
            gap: 0.75rem;
          }

          .zeurd-stat-number {
            font-size: 2.15rem;
          }

          .zeurd-stat-label {
            margin-top: 0;
          }

          .zeurd-topic-line {
            font-size: 0.8rem;
          }

          .zeurd-topic-line span + span::before {
            margin: 0 0.5rem;
          }
        }
      `}</style>
    </header>
  )
}
