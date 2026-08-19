import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'

const toBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') return value
  if (value == null || value === '') return fallback
  return String(value).toLowerCase() === 'true'
}

const parseAudio = value => {
  if (Array.isArray(value)) return value
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

const Player = ({ NOTION_CONFIG }) => {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [activated, setActivated] = useState(false)
  const [ready, setReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const musicPlayerEnable = toBoolean(
    siteConfig('MUSIC_PLAYER', false, NOTION_CONFIG)
  )
  const playerVisible = toBoolean(
    siteConfig('MUSIC_PLAYER_VISIBLE', true, NOTION_CONFIG),
    true
  )
  const mobileEnabled = toBoolean(
    siteConfig('MUSIC_PLAYER_MOBILE', false, NOTION_CONFIG)
  )
  const metingEnabled = toBoolean(
    siteConfig('MUSIC_PLAYER_METING', false, NOTION_CONFIG)
  )
  const autoPlay = toBoolean(
    siteConfig('MUSIC_PLAYER_AUTO_PLAY', false, NOTION_CONFIG)
  )
  const lrcType = Number(siteConfig('MUSIC_PLAYER_LRC_TYPE', 0, NOTION_CONFIG)) || 0
  const order = siteConfig('MUSIC_PLAYER_ORDER', 'list', NOTION_CONFIG)
  const rawAudio = siteConfig(
    'MUSIC_PLAYER_AUDIO_LIST',
    [],
    NOTION_CONFIG
  )
  const audioConfig =
    typeof rawAudio === 'string' ? rawAudio : JSON.stringify(rawAudio || [])
  const audio = useMemo(() => parseAudio(audioConfig), [audioConfig])
  const musicPlayerCDN = siteConfig(
    'MUSIC_PLAYER_CDN_URL',
    'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js',
    NOTION_CONFIG
  )
  const musicPlayerCss = siteConfig(
    'MUSIC_PLAYER_CSS_URL',
    'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css',
    NOTION_CONFIG
  )
  const musicMetingCDNUrl = siteConfig(
    'MUSIC_PLAYER_METING_CDN_URL',
    'https://cdnjs.cloudflare.com/ajax/libs/meting/2.0.1/Meting.min.js',
    NOTION_CONFIG
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateMobileState = event => setIsMobile(event.matches)
    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener?.('change', updateMobileState)
    return () => mediaQuery.removeEventListener?.('change', updateMobileState)
  }, [])

  useEffect(() => {
    if (!activated || !musicPlayerEnable || !playerVisible) return
    let cancelled = false

    const initialise = async () => {
      try {
        await Promise.all([
          loadExternalResource(musicPlayerCss, 'css'),
          loadExternalResource(musicPlayerCDN, 'js')
        ])
        if (metingEnabled) {
          await loadExternalResource(musicMetingCDNUrl, 'js')
        }
        if (cancelled) return

        setReady(true)
        if (!metingEnabled && window.APlayer && containerRef.current) {
          playerRef.current = new window.APlayer({
            container: containerRef.current,
            fixed: true,
            lrcType,
            autoplay: autoPlay,
            order,
            preload: 'metadata',
            audio
          })
        }
      } catch (error) {
        console.error('音乐组件加载失败', error)
        setReady(false)
      }
    }

    initialise()
    return () => {
      cancelled = true
      playerRef.current?.destroy?.()
      playerRef.current = null
      setReady(false)
    }
  }, [
    activated,
    audio,
    autoPlay,
    lrcType,
    metingEnabled,
    musicMetingCDNUrl,
    musicPlayerCDN,
    musicPlayerCss,
    musicPlayerEnable,
    order,
    playerVisible
  ])

  if (!musicPlayerEnable || !playerVisible || (isMobile && !mobileEnabled)) {
    return null
  }

  if (!activated) {
    return (
      <button
        type='button'
        className='fixed bottom-4 left-4 z-40 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950/95 dark:text-slate-200'
        onClick={() => setActivated(true)}
        aria-label='加载并打开音乐播放器'>
        <i className='fa-solid fa-music' aria-hidden='true' />
        <span>音乐</span>
      </button>
    )
  }

  return (
    <div className='fixed bottom-4 left-4 z-40'>
      <button
        type='button'
        className='mb-2 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 text-sm text-slate-600 shadow-md backdrop-blur transition hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950/95 dark:text-slate-300'
        onClick={() => setActivated(false)}
        aria-label='关闭音乐播放器'>
        <i className='fa-solid fa-chevron-down' aria-hidden='true' />
        <span>收起播放器</span>
      </button>

      {!ready && (
        <div className='rounded-lg bg-white/95 px-4 py-3 text-sm shadow-md dark:bg-slate-950/95' role='status'>
          正在加载播放器…
        </div>
      )}

      {metingEnabled && ready ? (
        <meting-js
          fixed='true'
          type='playlist'
          preload='metadata'
          api={siteConfig(
            'MUSIC_PLAYER_METING_API',
            'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r',
            NOTION_CONFIG
          )}
          autoplay={autoPlay}
          order={order}
          server={siteConfig('MUSIC_PLAYER_METING_SERVER', null, NOTION_CONFIG)}
          id={siteConfig('MUSIC_PLAYER_METING_ID', null, NOTION_CONFIG)}
        />
      ) : (
        <div ref={containerRef} />
      )}
    </div>
  )
}

export default Player
