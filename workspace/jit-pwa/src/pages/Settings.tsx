import { useState } from 'react'
import { useAppStore } from '../state/store'
import type { WeatherType } from '../state/store'
import { useTranslation } from 'react-i18next'
import { requestNotifyPermission } from '../utils/notifications'

export default function Settings() {
  const { t, i18n } = useTranslation()
  const store = useAppStore()
  const [title, setTitle] = useState(store.countdown?.title || '')
  const [date, setDate] = useState(store.countdown?.dateISO || '')
  const [daily, setDaily] = useState(store.settings.dailyReminder || '08:30')

  const updateTheme = (mode: 'system'|'light'|'dark') => {
    store.setTheme(mode)
    const html = document.documentElement
    if (mode === 'dark') html.classList.add('dark')
    else if (mode === 'light') html.classList.remove('dark')
    else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) html.classList.add('dark')
      else html.classList.remove('dark')
    }
  }

  const updateLang = (lng: 'zh'|'en') => {
    store.setLanguage(lng)
    i18n.changeLanguage(lng)
  }

  const toggleWeather = (w: WeatherType) => {
    const list = new Set(store.settings.dislikedWeathers)
    if (list.has(w)) list.delete(w); else list.add(w)
    store.setDislikedWeathers(Array.from(list))
  }

  const saveCountdown = () => {
    if (title && date) store.setCountdown({ title, dateISO: date })
  }

  return (
    <div className="grid gap-4">
      <div className="glass rounded-2xl p-5 grid gap-3">
        <div className="text-lg font-semibold">{t('settings.display')}</div>
        <div className="flex gap-2 flex-wrap">
          <select value={store.settings.themeMode} onChange={e=>updateTheme(e.target.value as any)} className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-white/10">
            <option value="system">{t('settings.system')}</option>
            <option value="light">{t('settings.light')}</option>
            <option value="dark">{t('settings.dark')}</option>
          </select>
          <select value={store.settings.language} onChange={e=>updateLang(e.target.value as any)} className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-white/10">
            <option value="zh">{t('settings.zh')}</option>
            <option value="en">{t('settings.en')}</option>
          </select>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 grid gap-3">
        <div className="text-lg font-semibold">{t('settings.personalization')}</div>
        <input value={store.settings.petName} onChange={e=>store.setPetName(e.target.value)} placeholder={t('settings.petName') as string} className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-white/10" />
        <div className="text-sm opacity-80">{t('settings.weatherPref')}</div>
        <div className="flex gap-2 flex-wrap">
          {(['rain','snow','fog','wind'] as WeatherType[]).map(w => (
            <button key={w} onClick={()=>toggleWeather(w)} className={`px-3 py-1.5 rounded-xl ${store.settings.dislikedWeathers.includes(w)?'bg-black/20 dark:bg-white/20':'bg-black/10 dark:bg-white/10'}`}>{w}</button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 grid gap-3">
        <div className="text-lg font-semibold">{t('settings.countdown')}</div>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder={t('settings.titleLabel') as string} className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-white/10" />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-white/10" />
        <button onClick={saveCountdown} className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10">保存</button>
      </div>

      <div className="glass rounded-2xl p-5 grid gap-3">
        <div className="text-lg font-semibold">{t('settings.smartNotify')}</div>
        <div className="flex gap-2 items-center">
          <input type="time" value={daily} onChange={e=>{ setDaily(e.target.value); store.setDailyReminder(e.target.value) }} className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-white/10" />
          <button onClick={()=>requestNotifyPermission()} className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10">{t('settings.reqPerm')}</button>
        </div>
        <div className="flex gap-2 items-center">
          <span>{t('settings.sfx')}</span>
          <button onClick={()=>store.toggleSfx(!store.settings.sfxEnabled)} className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg白色/10">{store.settings.sfxEnabled? t('settings.sfxOn'): t('settings.sfxOff')}</button>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 grid gap-3">
        <div className="text-lg font-semibold">{t('settings.reset')}</div>
        <div className="text-sm opacity-80">{t('settings.resetWarn')}</div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10" onClick={()=>{
            if (confirm(`${t('settings.resetWarn')}\n\n${t('settings.iKnow')}?`)) { useAppStore.getState().resetAll(); alert(t('settings.resetDone') as string) }
          }}>{t('settings.iKnow')}</button>
        </div>
      </div>
    </div>
  )
}