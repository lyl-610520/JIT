import { useEffect } from 'react'
import { useAppStore } from '../state/store'
import { showLocalNotification } from '../utils/notifications'

export default function Scheduler() {
  const daily = useAppStore(s => s.settings.dailyReminder)
  const checkins = useAppStore(s => s.checkins)

  useEffect(() => {
    if (!daily) return
    const id = setInterval(() => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2,'0')
      const mm = String(now.getMinutes()).padStart(2,'0')
      const key = `${hh}:${mm}`
      if (key === daily) {
        const dayKey = now.toISOString().slice(0,10)
        const list = checkins[dayKey] || []
        const hasAwake = list.some(r=>r.category==='awake')
        const hasSleep = list.some(r=>r.category==='sleep')
        if (!hasAwake || !hasSleep) {
          showLocalNotification('温柔提醒', { body: !hasAwake? '今天起床打卡还没完成哦～' : '今晚记得早点休息～' })
        } else {
          showLocalNotification('晚安', { body: '一切都很好，放轻松～' })
        }
      }
    }, 30_000)
    return () => clearInterval(id)
  }, [daily, checkins])
  return null
}