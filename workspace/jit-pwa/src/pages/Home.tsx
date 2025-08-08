import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '../state/store'
import { useTranslation } from 'react-i18next'
import Background from '../components/Background'
import CanvasFX from '../components/CanvasFX'
import { requestNotifyPermission, showLocalNotification, scheduleNotificationAt } from '../utils/notifications'
import Flower from '../components/Flower'

const API_KEY = 'f080dd8eccd341b4a06152132251207'

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const store = useAppStore()
  const [now, setNow] = useState(new Date())
  const [weatherText, setWeatherText] = useState('—')
  const [weatherMain, setWeatherMain] = useState<string | undefined>(undefined)

  const todayKey = new Date().toISOString().slice(0,10)
  const todayList = store.checkins[todayKey] || []

  useEffect(() => { const id = setInterval(()=>setNow(new Date()), 1000); return ()=>clearInterval(id) }, [])

  // Weather via geolocation
  useEffect(() => {
    const fetchWeather = async (q: string) => {
      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(q)}&aqi=no`
      const res = await fetch(url)
      const data = await res.json()
      const cond = data?.current?.condition?.text || ''
      const tempC = data?.current?.temp_c
      const wind = data?.current?.wind_kph
      const text = i18n.language.startsWith('zh') ? `当前天气为${cond}，${tempC}℃，风速${wind} km/h` : `Weather ${cond}, ${tempC}℃, wind ${wind} km/h`
      setWeatherText(text)
      setWeatherMain(cond?.toLowerCase())
    }
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => fetchWeather('auto:ip'),
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 8000 }
    )
  }, [i18n.language])

  const greeting = useMemo(() => {
    const h = now.getHours()
    const dislikedRain = store.settings.dislikedWeathers.includes('rain')
    if (h >= 6 && h < 10) return t('greetings.breakfast') + (weatherMain?.includes('rain') && dislikedRain ? ' ' + t('greetings.rainyComfort') : '')
    if (h >= 10 && h < 12) return t('greetings.lunch')
    if (h >= 12 && h < 14) return t('greetings.noon')
    if (h >= 14 && h < 18) return t('greetings.afternoon')
    if (h >= 18 && h < 22) return t('greetings.evening')
    return t('greetings.night')
  }, [now, weatherMain, store.settings.dislikedWeathers, i18n.language])

  // Alarm modal
  const [alarmOpen, setAlarmOpen] = useState(false)
  const [alarmTime, setAlarmTime] = useState<string>('07:30')

  const setOneTimeAlarm = async () => {
    const [hh, mm] = alarmTime.split(':').map(Number)
    const when = new Date(); when.setHours(hh, mm, 0, 0)
    if (when.getTime() < Date.now()) when.setDate(when.getDate()+1)
    store.setAlarm({ timestamp: when.getTime() })
    await requestNotifyPermission()
    scheduleNotificationAt(when.getTime(), '⏰ Alarm', { body: i18n.language.startsWith('zh') ? '时间到啦～' : 'Time is up!' })
    setAlarmOpen(false)
  }

  // Check-in buttons
  const didAwake = todayList.some(r => r.category === 'awake')
  const didSleep = todayList.some(r => r.category === 'sleep')

  const handleAwake = () => {
    if (didAwake) return
    store.addCheckin({ timestamp: Date.now(), text: 'Awake', category: 'awake' });
    import('../utils/sfx').then(m=>m.playSfx('success'))
    showLocalNotification('🌅', { body: i18n.language.startsWith('zh') ? '愿你今天顺心如意' : 'Wishing you a smooth day' })
  }
  const handleSleep = () => {
    if (didSleep) return
    store.addCheckin({ timestamp: Date.now(), text: 'Sleep', category: 'sleep' });
    import('../utils/sfx').then(m=>m.playSfx('success'))
    showLocalNotification('🌙', { body: i18n.language.startsWith('zh') ? '好梦常在' : 'Sweet dreams' })
  }

  const addCustom = () => {
    const input = (document.getElementById('customText') as HTMLInputElement)
    const sel = (document.getElementById('customType') as HTMLSelectElement)
    const text = input.value.trim(); const category = sel.value as any
    if (!text) return
    const exists = todayList.find(r => r.text === text && r.category === category)
    if (exists) {
      if (!confirm(i18n.language.startsWith('zh') ? '重复打卡，继续？' : 'Duplicate check-in, continue?')) return
    }
    store.addCheckin({ timestamp: Date.now(), text, category })
    input.value = ''
  }

  return (
    <>
      <Background weatherCode={weatherMain} />
      <CanvasFX weather={weatherMain? { main: weatherMain } : undefined} />

      <div className="grid gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="text-5xl font-semibold tracking-tight">{formatTime(now)}</div>
          <div className="mt-2 text-sm opacity-80">{greeting}</div>
          <div className="mt-1 text-xs opacity-70">{weatherText}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{t('home.punch')}</div>
              <button className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10" onClick={()=>setAlarmOpen(true)}>⏰</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button disabled={didAwake} onClick={handleAwake} className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10 disabled:opacity-50">{t('home.awake')}</button>
              <button disabled={didSleep} onClick={handleSleep} className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10 disabled:opacity-50">{t('home.sleep')}</button>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <div className="text-sm opacity-80">{t('home.custom')}</div>
              <div className="flex flex-wrap gap-2">
                <input id="customText" placeholder={i18n.language.startsWith('zh')? '记录内容': 'What to record'} className="min-w-0 flex-1 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-white/10" />
                <select id="customType" className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-white/10">
                  <option value="life">{t('home.life')}</option>
                  <option value="study">{t('home.study')}</option>
                  <option value="work">{t('home.work')}</option>
                </select>
                <button onClick={addCustom} className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10">{t('home.add')}</button>
              </div>
              <div className="mt-2 text-sm grid gap-1">
                {todayList.map(r => (
                  <div key={r.id} className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10">{new Date(r.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} · {r.category} · {r.text}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 grid gap-3">
            <div className="text-lg font-semibold">游戏化</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-2xl p-3 text-center">
                <div className="text-sm opacity-80">宠物</div>
                <div className="mt-1 font-medium">{store.settings.petName}</div>
                <div className="text-xs opacity-70">{store.game.petAccessory}</div>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <div className="text-sm opacity-80">花朵</div>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <Flower stage={store.game.flowerStage} />
                </div>
              </div>
            </div>
            {store.countdown && (
              <div className="glass rounded-2xl p-3">
                <div className="text-sm opacity-80">{t('home.countdown')}</div>
                <div className="text-lg font-medium">{store.countdown.title}</div>
              </div>
            )}
          </div>
        </div>

        {/* Alarm modal */}
        {alarmOpen && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
            <div className="glass rounded-2xl p-5 w-[min(92vw,400px)]">
              <div className="text-lg font-semibold mb-2">{t('home.setAlarm')}</div>
              <input type="time" value={alarmTime} onChange={e=>setAlarmTime(e.target.value)} className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-white/10 w-full" />
              <div className="mt-3 flex justify-end gap-2">
                <button onClick={()=>setAlarmOpen(false)} className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10">{t('home.cancel')}</button>
                <button onClick={setOneTimeAlarm} className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10">{t('home.confirm')}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}