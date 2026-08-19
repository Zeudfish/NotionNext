import { useGlobal } from '@/lib/global'
import { useImperativeHandle } from 'react'
import { Moon, Sun } from './HeroIcons'

const DarkModeButton = ({ cRef, className }) => {
  const { isDarkMode, toggleDarkMode } = useGlobal()

  useImperativeHandle(cRef, () => ({
    handleChangeDarkMode: toggleDarkMode
  }))

  return (
    <div className={`${className || ''} flex justify-center`}>
      <button
        type='button'
        id='darkModeButton'
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
        aria-pressed={isDarkMode}
        className='inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-gray-800 transition hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10'>
        {isDarkMode ? <Sun /> : <Moon />}
      </button>
    </div>
  )
}

export default DarkModeButton
