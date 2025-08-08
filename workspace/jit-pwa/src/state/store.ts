import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CheckinCategory = 'life' | 'study' | 'work' | 'sleep' | 'awake'
export type WeatherType = 'sunny' | 'cloudy' | 'rain' | 'snow' | 'fog' | 'wind'

export interface CheckinRecord {
  id: string
  timestamp: number
  text: string
  category: CheckinCategory
}

export type FlowerStage = 'seed' | 'sprout' | 'seedling' | 'bud' | 'bloom'

export interface MusicTrack {
  id: string
  name: string
  src?: string
  key?: string
}

export interface CountdownConfig {
  title: string
  dateISO: string
}

export interface AlarmConfig {
  timestamp?: number
}

export interface SettingsState {
  themeMode: 'system' | 'light' | 'dark'
  language: 'zh' | 'en'
  petName: string
  dislikedWeathers: WeatherType[]
  sfxEnabled: boolean
  dailyReminder?: string // HH:mm
}

export interface GameState {
  flowerStage: FlowerStage
  sunlightPoints: number
  petAccessory: string
  achievementPoints: number
  unlockedAccessories: string[]
}

export interface MusicState {
  playlist: MusicTrack[]
  currentIndex: number
}

export interface AppState {
  settings: SettingsState
  game: GameState
  music: MusicState
  checkins: Record<string, CheckinRecord[]> // key by yyyy-MM-dd
  lastAwakeDate?: string
  lastSleepDate?: string
  countdown?: CountdownConfig
  alarm?: AlarmConfig

  addCheckin: (rec: Omit<CheckinRecord, 'id'>) => void
  setTheme: (mode: SettingsState['themeMode']) => void
  setLanguage: (lng: 'zh' | 'en') => void
  setPetName: (name: string) => void
  setDislikedWeathers: (arr: WeatherType[]) => void
  toggleSfx: (on: boolean) => void
  setDailyReminder: (hhmm?: string) => void
  setPetAccessory: (acc: string) => void

  setCountdown: (cfg?: CountdownConfig) => void
  setAlarm: (cfg?: AlarmConfig) => void

  gainSunlight: (amount: number) => void
  levelUpFlowerIfReady: () => void

  setPlaylist: (list: MusicTrack[]) => void
  setCurrentIndex: (i: number) => void
  resetAll: () => void
}

const flowerOrder: FlowerStage[] = ['seed', 'sprout', 'seedling', 'bud', 'bloom']

const nextFlowerStage = (s: FlowerStage): FlowerStage => {
  const idx = flowerOrder.indexOf(s)
  return flowerOrder[Math.min(idx + 1, flowerOrder.length - 1)]
}

// const todayKey = () => new Date().toISOString().slice(0, 10)

export const useAppStore = create<AppState>()(persist((set) => ({
  settings: {
    themeMode: 'system',
    language: navigator.language.startsWith('zh') ? 'zh' : 'en',
    petName: '小旅伴',
    dislikedWeathers: [],
    sfxEnabled: true,
  },
  game: {
    flowerStage: 'seed',
    sunlightPoints: 0,
    petAccessory: 'spring-grass',
    achievementPoints: 0,
    unlockedAccessories: ['spring-grass','summer-fan','autumn-fruit','winter-scarf']
  },
  music: { playlist: [], currentIndex: 0 },
  checkins: {},

  addCheckin: (rec) => set(state => {
    const key = new Date(rec.timestamp).toISOString().slice(0,10)
    const list = state.checkins[key] || []
    const id = `${rec.category}-${rec.timestamp}`
    const updated: CheckinRecord = { id, ...rec }

    // sunlight points
    const delta = rec.category === 'sleep' ? 8 : rec.category === 'awake' ? 5 : 2

    return {
      checkins: { ...state.checkins, [key]: [updated, ...list] },
      game: { ...state.game, sunlightPoints: state.game.sunlightPoints + delta }
    }
  }),

  setTheme: (mode) => set(s => ({ settings: { ...s.settings, themeMode: mode } })),
  setLanguage: (lng) => set(s => ({ settings: { ...s.settings, language: lng } })),
  setPetName: (name) => set(s => ({ settings: { ...s.settings, petName: name } })),
  setDislikedWeathers: (arr) => set(s => ({ settings: { ...s.settings, dislikedWeathers: arr } })),
  toggleSfx: (on) => set(s => ({ settings: { ...s.settings, sfxEnabled: on } })),
  setDailyReminder: (hhmm) => set(s => ({ settings: { ...s.settings, dailyReminder: hhmm } })),
  setPetAccessory: (acc) => set(s => ({ game: { ...s.game, petAccessory: acc } })),

  setCountdown: (cfg) => set(() => ({ countdown: cfg })),
  setAlarm: (cfg) => set(() => ({ alarm: cfg })),

  gainSunlight: (amount) => set(s => ({ game: { ...s.game, sunlightPoints: s.game.sunlightPoints + amount } })),
  levelUpFlowerIfReady: () => set(s => {
    const thresholds: Record<FlowerStage, number> = {
      seed: 20, sprout: 50, seedling: 100, bud: 180, bloom: 99999
    }
    const need = thresholds[s.game.flowerStage]
    if (s.game.sunlightPoints >= need && s.game.flowerStage !== 'bloom') {
      return { game: { ...s.game, flowerStage: nextFlowerStage(s.game.flowerStage), sunlightPoints: 0 } }
    }
    return {}
  }),

  setPlaylist: (list) => set(s => ({ music: { ...s.music, playlist: list } })),
  setCurrentIndex: (i) => set(s => ({ music: { ...s.music, currentIndex: i } })),

  resetAll: () => ({
    settings: {
      themeMode: 'system', language: navigator.language.startsWith('zh') ? 'zh' : 'en',
      petName: '小旅伴', dislikedWeathers: [], sfxEnabled: true
    },
    game: { flowerStage: 'seed', sunlightPoints: 0, petAccessory: 'spring-grass', achievementPoints: 0, unlockedAccessories: ['spring-grass','summer-fan','autumn-fruit','winter-scarf'] },
    music: { playlist: [], currentIndex: 0 },
    checkins: {}, lastAwakeDate: undefined, lastSleepDate: undefined, countdown: undefined, alarm: undefined
  })

}), { name: 'jit-store' }))