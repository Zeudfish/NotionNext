import SmartLink from '@/components/SmartLink'
import { BlogItem } from './BlogItem'

const TOPICS = [
  {
    title: 'Low-level Vision',
    description: 'RAW 降噪、ISP、图像与视频复原',
    href: '/tag/%E9%99%8D%E5%99%AA',
    icon: 'fas fa-camera-retro'
  },
  {
    title: '端侧部署',
    description: '量化、蒸馏与芯片算子约束',
    href: '/tag/%E9%87%8F%E5%8C%96',
    icon: 'fas fa-microchip'
  },
  {
    title: 'VLM / LLM',
    description: '多模态模型、评测与真实用户体验',
    href: '/tag/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD',
    icon: 'fas fa-diagram-project'
  },
  {
    title: '科研方法',
    description: '读论文、做实验与写作过程中的判断',
    href: '/category/%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB',
    icon: 'fas fa-flask'
  }
]

const SectionHeading = ({ eyebrow, title, action }) => (
  <div className='zeurd-section-heading'>
    <div>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </div>
    {action}
  </div>
)

export default function HomeOverview({ posts = [] }) {
  const taggedFeatured = posts.filter(post => post?.tags?.includes('推荐'))
  const featuredPosts = (
    taggedFeatured.length >= 3 ? taggedFeatured : posts
  ).slice(0, 3)
  const featuredIds = new Set(featuredPosts.map(post => post.id))
  const recentPosts = posts
    .filter(post => !featuredIds.has(post.id))
    .slice(0, 8)

  return (
    <div className='zeurd-home-overview w-full pb-16'>
      <section className='zeurd-topic-section'>
        <SectionHeading eyebrow='Explore' title='从研究方向开始' />
        <div className='zeurd-topic-grid'>
          {TOPICS.map(topic => (
            <SmartLink
              key={topic.title}
              href={topic.href}
              className='zeurd-topic-card'>
              <i className={topic.icon} />
              <div>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </div>
              <i className='fas fa-arrow-right zeurd-topic-arrow' />
            </SmartLink>
          ))}
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section className='zeurd-featured-section'>
          <SectionHeading
            eyebrow='Selected notes'
            title='推荐阅读'
            action={
              <SmartLink href='/archive' className='zeurd-section-action'>
                全部文章 <i className='fas fa-arrow-right' />
              </SmartLink>
            }
          />
          <div className='zeurd-featured-grid'>
            {featuredPosts.map((post, index) => (
              <SmartLink
                key={post.id}
                href={post.href}
                className='zeurd-featured-card'>
                <div className='zeurd-featured-index'>0{index + 1}</div>
                <div className='zeurd-featured-meta'>
                  <span>{post.category || '研究笔记'}</span>
                  <time>{post.date?.start_date || post.publishDay}</time>
                </div>
                <h3>{post.title}</h3>
                {post.summary && <p>{post.summary}</p>}
                <span className='zeurd-featured-more'>
                  阅读文章 <i className='fas fa-arrow-right' />
                </span>
              </SmartLink>
            ))}
          </div>
        </section>
      )}

      {recentPosts.length > 0 && (
        <section className='zeurd-recent-section'>
          <SectionHeading eyebrow='Recent updates' title='最近更新' />
          <div className='zeurd-recent-list'>
            {recentPosts.map(post => (
              <BlogItem key={post.id} post={post} />
            ))}
          </div>
          <div className='zeurd-archive-cta'>
            <SmartLink href='/archive'>
              查看历史归档 <i className='fas fa-arrow-right' />
            </SmartLink>
          </div>
        </section>
      )}

      <style jsx global>{`
        .zeurd-home-overview {
          color: var(--zeurd-ink, #172033);
        }

        .zeurd-home-overview section + section {
          margin-top: 4.5rem;
        }

        .zeurd-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 1.4rem;
        }

        .zeurd-section-heading span:first-child {
          color: #2563eb;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .zeurd-section-heading h2 {
          margin: 0.25rem 0 0;
          color: #172033;
          font-size: clamp(1.55rem, 3vw, 2.1rem);
          font-weight: 800;
          letter-spacing: -0.045em;
        }

        .dark .zeurd-section-heading h2 {
          color: #f8fafc;
        }

        .zeurd-section-action {
          color: #475569;
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none !important;
        }

        .zeurd-section-action:hover {
          color: #c2410c;
        }

        .zeurd-topic-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.85rem;
        }

        .zeurd-topic-card {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.9rem;
          min-height: 7.4rem;
          border: 1px solid rgba(148, 163, 184, 0.24);
          border-radius: 20px;
          padding: 1.1rem;
          background: rgba(255, 255, 255, 0.68);
          color: #172033;
          box-shadow: 0 12px 35px rgba(15, 23, 42, 0.05);
          text-decoration: none !important;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .zeurd-topic-card:hover {
          transform: translateY(-3px);
          border-color: rgba(37, 99, 235, 0.34);
          box-shadow: 0 18px 42px rgba(37, 99, 235, 0.1);
        }

        .zeurd-topic-card > i:first-child {
          display: grid;
          width: 2.3rem;
          height: 2.3rem;
          place-items: center;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.09);
          color: #2563eb;
        }

        .zeurd-topic-card h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
        }

        .zeurd-topic-card p {
          margin: 0.35rem 0 0;
          color: #667085;
          font-size: 0.8rem;
          line-height: 1.55;
        }

        .zeurd-topic-arrow {
          color: #94a3b8;
          font-size: 0.72rem;
        }

        .zeurd-featured-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .zeurd-featured-card {
          position: relative;
          display: flex;
          min-height: 19rem;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.24);
          border-radius: 24px;
          padding: 1.45rem;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(37, 99, 235, 0.13),
              transparent 13rem
            ),
            rgba(255, 255, 255, 0.72);
          color: #172033;
          text-decoration: none !important;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .zeurd-featured-card:nth-child(2) {
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(194, 65, 12, 0.13),
              transparent 13rem
            ),
            rgba(255, 255, 255, 0.72);
        }

        .zeurd-featured-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 55px rgba(15, 23, 42, 0.1);
        }

        .zeurd-featured-index {
          color: rgba(37, 99, 235, 0.18);
          font-family: ui-serif, Georgia, serif;
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
        }

        .zeurd-featured-meta {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1.2rem;
          color: #64748b;
          font-size: 0.75rem;
        }

        .zeurd-featured-card h3 {
          margin: 0.8rem 0 0;
          color: #172033;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.42;
        }

        .zeurd-featured-card p {
          display: -webkit-box;
          overflow: hidden;
          margin: 0.85rem 0 0;
          color: #667085;
          font-size: 0.88rem;
          line-height: 1.75;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        .zeurd-featured-more {
          margin-top: auto;
          padding-top: 1.2rem;
          color: #2563eb;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .zeurd-recent-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }

        .zeurd-recent-list .zeurd-blog-item {
          height: 100%;
          margin: 0;
        }

        .zeurd-archive-cta {
          margin-top: 1.5rem;
          text-align: center;
        }

        .zeurd-archive-cta a {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          border: 1px solid rgba(37, 99, 235, 0.22);
          border-radius: 999px;
          padding: 0.75rem 1.15rem;
          background: rgba(255, 255, 255, 0.72);
          color: #2563eb;
          font-size: 0.86rem;
          font-weight: 800;
          text-decoration: none !important;
        }

        .dark .zeurd-topic-card,
        .dark .zeurd-featured-card,
        .dark .zeurd-archive-cta a {
          border-color: rgba(148, 163, 184, 0.16);
          background-color: rgba(15, 23, 42, 0.62);
          color: #e2e8f0;
        }

        .dark .zeurd-topic-card h3,
        .dark .zeurd-featured-card h3 {
          color: #f8fafc;
        }

        .dark .zeurd-topic-card p,
        .dark .zeurd-featured-card p {
          color: #94a3b8;
        }

        @media (max-width: 1024px) {
          .zeurd-topic-grid,
          .zeurd-featured-grid,
          .zeurd-recent-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .zeurd-featured-card:last-child {
            grid-column: span 2;
            min-height: 15rem;
          }
        }

        @media (max-width: 640px) {
          .zeurd-home-overview section + section {
            margin-top: 3.2rem;
          }

          .zeurd-section-heading {
            align-items: start;
          }

          .zeurd-topic-grid,
          .zeurd-featured-grid,
          .zeurd-recent-list {
            grid-template-columns: 1fr;
          }

          .zeurd-featured-card:last-child {
            grid-column: auto;
            min-height: 19rem;
          }
        }
      `}</style>
    </div>
  )
}
