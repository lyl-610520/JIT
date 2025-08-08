import { useEffect } from 'react'
import { useAppStore } from '../state/store'

function gradientForSlot(slot: number, isDark: boolean) {
  // 12 slots/24h, return pleasing gradients
  const palettes = [
    ['#1e3c72','#2a5298'], // 0-2 night deep blue
    ['#1f2b5a','#445c9e'],
    ['#2b5876','#4e4376'],
    ['#355c7d','#6c5b7b'], // 6-8 dawn
    ['#FFDEE9','#B5FFFC'], // 8-10 morning pastel
    ['#c2e9fb','#a1c4fd'], // 10-12
    ['#a8edea','#fed6e3'], // 12-14 noon
    ['#f6d365','#fda085'], // 14-16 afternoon warm
    ['#fbc2eb','#a6c1ee'], // 16-18
    ['#fddb92','#d1fdff'], // 18-20 dusk soft
    ['#1e3c72','#2a5298'], // 20-22 evening
    ['#0f2027','#203a43','#2c5364'] // 22-24 night
  ]
  const p = palettes[slot % palettes.length]
  const base = isDark ? p.map(hex => hex) : p
  return `linear-gradient(120deg, ${base.join(',')})`
}

export default function Background({ weatherCode }: { weatherCode?: string }) {
  const mode = useAppStore(s => s.settings.themeMode)

  useEffect(() => {
    const el = document.getElementById('bg-gradient')!
    let raf = 0
    const apply = () => {
      const hours = new Date().getHours()
      const slot = Math.floor(hours / 2)
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches || (mode === 'dark')
      el.style.backgroundImage = gradientForSlot(slot, isDark)
      raf = requestAnimationFrame(apply)
    }
    apply()
    return () => cancelAnimationFrame(raf)
  }, [mode])

  useEffect(() => {
    const el = document.getElementById('bg-gradient')!
    if (!weatherCode) return
    // Subtle overlay for weather mood
    el.style.opacity = '1'
  }, [weatherCode])

  return null
}