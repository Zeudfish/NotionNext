import { useEffect, useImperativeHandle, useRef } from 'react'

const Collapse = ({
  type = 'vertical',
  isOpen = false,
  children,
  onHeightChange,
  className,
  collapseRef
}) => {
  const ref = useRef(null)
  const dimension = type === 'horizontal' ? 'width' : 'height'
  const scrollDimension = type === 'horizontal' ? 'scrollWidth' : 'scrollHeight'

  const updateExpandedSize = () => {
    const element = ref.current
    if (!element || !isOpen) return

    element.style[dimension] = `${element[scrollDimension]}px`
    window.requestAnimationFrame(() => {
      if (ref.current && isOpen) ref.current.style[dimension] = 'auto'
    })
  }

  useImperativeHandle(collapseRef, () => ({
    updateCollapseHeight: updateExpandedSize
  }))

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    let timer
    if (isOpen) {
      element.style[dimension] = `${element[scrollDimension]}px`
      timer = window.setTimeout(() => {
        if (ref.current && isOpen) ref.current.style[dimension] = 'auto'
      }, 320)
    } else {
      if (element.style[dimension] === 'auto') {
        element.style[dimension] = `${element[scrollDimension]}px`
      }
      element.getBoundingClientRect()
      element.style[dimension] = '0px'
    }

    onHeightChange?.({
      height: element.scrollHeight,
      increase: isOpen
    })

    return () => window.clearTimeout(timer)
  }, [dimension, isOpen, onHeightChange, scrollDimension])

  return (
    <div
      ref={ref}
      aria-hidden={!isOpen}
      inert={isOpen ? undefined : ''}
      style={{ [dimension]: '0px', willChange: dimension }}
      className={`${className || ''} overflow-hidden duration-300`}>
      {children}
    </div>
  )
}

export default Collapse
