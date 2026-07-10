import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 目录导航组件
 */
const Catalog = ({ post }) => {
  const { locale } = useGlobal()
  const tRef = useRef(null)
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    const actionSectionScrollSpy = throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = null

      for (let index = 0; index < sections.length; index += 1) {
        const section = sections[index]
        if (!section || !(section instanceof Element)) continue
        if (!currentSectionId) {
          currentSectionId = section.getAttribute('data-id')
        }
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        break
      }

      setActiveSection(currentSectionId)
      const tocIndex = post?.toc?.findIndex(
        item => uuidToId(item.id) === currentSectionId
      )
      if (tocIndex >= 0) {
        tRef.current?.scrollTo({ top: 28 * tocIndex, behavior: 'smooth' })
      }
    }, 200)

    window.addEventListener('scroll', actionSectionScrollSpy, {
      passive: true
    })
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
      actionSectionScrollSpy.cancel()
    }
  }, [post])

  if (!post?.toc?.length) return null

  return (
    <div className='px-3'>
      <div className='mb-3 font-semibold text-slate-800 dark:text-slate-100'>
        <i className='fas fa-stream mr-2 text-blue-600' />
        {locale.COMMON.TABLE_OF_CONTENTS}
      </div>

      <div
        className='scroll-hidden max-h-36 overflow-y-auto overscroll-none lg:max-h-96'
        ref={tRef}>
        <nav className='h-full text-slate-700 dark:text-slate-300'>
          {post.toc.map(tocItem => {
            const id = uuidToId(tocItem.id)
            const isActive = activeSection === id
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`${
                  isActive
                    ? 'border-blue-600 font-bold text-blue-700 dark:border-blue-300 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700'
                } catalog-item block border-l py-0.5 pl-4 transition duration-200 hover:border-orange-500 hover:text-orange-700 notion-table-of-contents-item-indent-level-${tocItem.indentLevel}`}>
                <span
                  style={{ marginLeft: tocItem.indentLevel * 16 }}
                  className='inline-block max-w-full truncate'>
                  {tocItem.text}
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Catalog
