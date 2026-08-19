import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

const JumpToTopButton = () => {
  const { locale } = useGlobal()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(window.pageYOffset > 200)
    handleScroll()
    document.addEventListener('scroll', handleScroll, { passive: true })
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  if (!show) return null

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      type='button'
      title={locale.POST.TOP}
      aria-label={locale.POST.TOP}
      className='zeurd-jump-top zeurd-control'
      onClick={scrollToTop}>
      <i className='fas fa-angle-up' aria-hidden='true' />
    </button>
  )
}

export default JumpToTopButton
