import Head from 'next/head'
import { useMemo, useState } from 'react'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import {
  filterFoodItems,
  getDefaultFoodItems,
  getFoodItemsFromPages,
  getFoodOptions,
  sortFoodItems
} from '@/lib/food/recommendations'

const PRICE_RANGES = [
  { label: '全部价格', value: '' },
  { label: '¥0-100', value: '0-100' },
  { label: '¥100-150', value: '100-150' },
  { label: '¥150-250', value: '150-250' },
  { label: '¥250+', value: '250-' }
]

const Select = ({ label, value, onChange, children }) => (
  <label className='food-filter'>
    <span>{label}</span>
    <select value={value} onChange={event => onChange(event.target.value)}>
      {children}
    </select>
  </label>
)

const FoodCard = ({ item, index }) => {
  const stars = item.stars ? '★'.repeat(Math.max(1, Math.min(item.stars, 5))) : '未评分'
  return (
    <article className='food-card'>
      <div className='food-card-rank'>{index + 1}</div>
      <div className='food-card-body'>
        <div className='food-card-top'>
          <div>
            <h2>{item.displayName}</h2>
            <p className='food-meta'>
              {item.cuisine} · {item.district} · ¥{item.price || '?'}
            </p>
          </div>
          <div className='food-rating'>
            <span>{stars}</span>
            <b>{item.priority}</b>
          </div>
        </div>
        <p className='food-note'>{item.note}</p>
        <div className='food-card-actions'>
          {item.address && <span>{item.address}</span>}
          {item.map_link && (
            <a href={item.map_link} target='_blank' rel='noreferrer'>
              打开地图
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function FoodPage({ allItems, defaultItems, options }) {
  const [district, setDistrict] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [priority, setPriority] = useState('')
  const [priceRange, setPriceRange] = useState('')

  const hasFilter = district || cuisine || priority || priceRange
  const visibleItems = useMemo(() => {
    if (!hasFilter) return defaultItems
    return filterFoodItems(allItems, { district, cuisine, priority, priceRange })
  }, [allItems, cuisine, defaultItems, district, hasFilter, priceRange, priority])

  return (
    <main className='food-page'>
      <Head>
        <title>上海吃饭清单 | Zeurd</title>
        <meta
          name='description'
          content='Zeurd 的上海吃饭清单：默认展示推荐前十，并支持按区域、人均、菜系和推荐等级筛选。'
        />
      </Head>

      <section className='food-hero'>
        <p className='food-kicker'>Zeurd Shanghai Food List</p>
        <h1>上海吃饭清单</h1>
        <p>
          不是大众点评式客观排名，而是我自己会复刷、会推荐、或明确避雷的店。
          数据直接来自 Notion 店铺数据库；默认展示推荐前十，需要时按区域、人均、菜系和推荐等级筛选。
        </p>
      </section>

      <section className='food-panel'>
        <div className='food-toolbar'>
          <Select label='区域' value={district} onChange={setDistrict}>
            <option value=''>全部区域</option>
            {options.districts.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
          <Select label='价格' value={priceRange} onChange={setPriceRange}>
            {PRICE_RANGES.map(item => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </Select>
          <Select label='菜系' value={cuisine} onChange={setCuisine}>
            <option value=''>全部菜系</option>
            {options.cuisines.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
          <Select label='推荐等级' value={priority} onChange={setPriority}>
            <option value=''>全部等级</option>
            {options.priorities.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
        </div>

        <div className='food-summary'>
          <b>{hasFilter ? '筛选结果' : '默认推荐 Top 10'}</b>
          <span>{visibleItems.length} 家店</span>
        </div>

        <div className='food-list'>
          {visibleItems.map((item, index) => (
            <FoodCard key={`${item.name}-${item.address || index}`} item={item} index={index} />
          ))}
          {visibleItems.length === 0 && <p className='food-empty'>暂时没有匹配的店。</p>}
        </div>
      </section>

      <style jsx global>{`
        .food-page {
          min-height: 100vh;
          padding: 56px 20px 80px;
          background: radial-gradient(circle at 20% 0%, rgba(37, 99, 235, 0.16), transparent 32rem), linear-gradient(180deg, #fffaf3 0%, #f6f3ee 100%);
          color: #172033;
        }
        .food-hero, .food-panel {
          max-width: 1080px;
          margin: 0 auto;
        }
        .food-hero {
          padding: 42px 0 32px;
        }
        .food-kicker {
          color: #2563eb;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .food-hero h1 {
          margin: 10px 0 14px;
          font-size: clamp(40px, 7vw, 76px);
          line-height: 1;
          letter-spacing: -0.07em;
        }
        .food-hero p {
          max-width: 720px;
          color: #667085;
          font-size: 17px;
          line-height: 1.85;
        }
        .food-panel {
          border: 1px solid rgba(23, 32, 51, 0.1);
          border-radius: 32px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.78);
          box-shadow: 0 24px 70px rgba(31, 41, 55, 0.12);
          backdrop-filter: blur(18px);
        }
        .food-toolbar {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .food-filter {
          display: flex;
          flex-direction: column;
          gap: 7px;
          color: #667085;
          font-size: 13px;
          font-weight: 700;
        }
        .food-filter select {
          height: 42px;
          border: 1px solid rgba(23, 32, 51, 0.14);
          border-radius: 14px;
          padding: 0 12px;
          background: white;
          color: #172033;
          outline: none;
        }
        .food-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 24px 0 16px;
          color: #667085;
        }
        .food-summary b {
          color: #172033;
          font-size: 18px;
        }
        .food-list {
          display: grid;
          gap: 14px;
        }
        .food-card {
          display: flex;
          gap: 16px;
          padding: 18px;
          border: 1px solid rgba(23, 32, 51, 0.08);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.86);
        }
        .food-card-rank {
          display: grid;
          place-items: center;
          flex: 0 0 42px;
          height: 42px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #c2410c);
          color: white;
          font-weight: 900;
        }
        .food-card-body {
          flex: 1;
          min-width: 0;
        }
        .food-card-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }
        .food-card h2 {
          margin: 0 0 6px;
          font-size: 22px;
          letter-spacing: -0.04em;
        }
        .food-meta, .food-note, .food-card-actions {
          margin: 0;
          color: #667085;
          line-height: 1.75;
        }
        .food-note {
          margin-top: 10px;
          color: #334155;
        }
        .food-rating {
          min-width: 118px;
          text-align: right;
          color: #c2410c;
        }
        .food-rating span, .food-rating b {
          display: block;
        }
        .food-rating b {
          margin-top: 4px;
          color: #172033;
        }
        .food-card-actions {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin-top: 12px;
          font-size: 14px;
        }
        .food-card-actions a {
          flex: 0 0 auto;
          color: #2563eb;
          font-weight: 800;
          text-decoration: none;
        }
        .food-empty {
          padding: 28px;
          color: #667085;
          text-align: center;
        }
        @media (max-width: 760px) {
          .food-page {
            padding: 28px 12px 48px;
          }
          .food-panel {
            border-radius: 24px;
            padding: 16px;
          }
          .food-toolbar {
            grid-template-columns: 1fr 1fr;
          }
          .food-card, .food-card-top, .food-card-actions {
            flex-direction: column;
          }
          .food-rating {
            min-width: 0;
            text-align: left;
          }
        }
      `}</style>
    </main>
  )
}

export async function getStaticProps(req) {
  const props = await fetchGlobalAllData({ from: 'food', locale: req?.locale })
  const allItems = sortFoodItems(getFoodItemsFromPages(props?.allPages))
  return {
    props: {
      allItems,
      defaultItems: getDefaultFoodItems(allItems, 10),
      options: getFoodOptions(allItems)
    },
    revalidate: 60
  }
}
