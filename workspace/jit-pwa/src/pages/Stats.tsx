import { useMemo } from 'react'
import { useAppStore } from '../state/store'
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Title } from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Title)

export default function Stats() {
  const checkins = useAppStore(s => s.checkins)

  const pieData = useMemo(() => {
    const counts: Record<string, number> = { life:0, study:0, work:0, sleep:0, awake:0 }
    Object.values(checkins).flat().forEach(r => { counts[r.category] = (counts[r.category]||0)+1 })
    const labels = ['life','study','work','sleep','awake']
    return {
      labels,
      datasets: [{
        data: labels.map(l => counts[l] || 0),
        backgroundColor: ['#93c5fd','#86efac','#fda4af','#c4b5fd','#fcd34d'],
        borderColor: 'rgba(255,255,255,0.4)'
      }]
    }
  }, [checkins])

  const last7 = useMemo(() => {
    const days: string[] = []
    for (let i=6;i>=0;i--) {
      const d = new Date(); d.setDate(d.getDate()-i)
      days.push(d.toISOString().slice(5,10))
    }
    // naive sleep duration: difference between last sleep and next awake per day
    const hours = days.map((_, idx) => {
      const dayISO = new Date(); dayISO.setDate(dayISO.getDate()-(6-idx))
      const key = dayISO.toISOString().slice(0,10)
      const list = (checkins[key]||[]).sort((a,b)=>a.timestamp-b.timestamp)
      let sleep: number|undefined, awake: number|undefined
      for (const r of list) {
        if (r.category==='sleep') sleep = r.timestamp
        if (r.category==='awake' && sleep) { awake = r.timestamp; break }
      }
      if (sleep && awake) {
        return (awake - sleep) / 3600000
      }
      return 0
    })
    return { labels: days, datasets: [{ label: 'Sleep (h)', data: hours, borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.2)' }] }
  }, [checkins])

  const pieOptions = { plugins: { legend: { position: 'bottom' as const }, title: { display: true, text: 'Category distribution', padding: { top: 8, bottom: 8 } } } }
  const lineOptions = { plugins: { legend: { display: false }, title: { display: true, text: 'Last 7 days sleep duration', padding: 8 } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }

  return (
    <div className="grid gap-4">
      <div className="glass rounded-2xl p-5">
        <Pie data={pieData} options={pieOptions as any} />
      </div>
      <div className="glass rounded-2xl p-5">
        <Line data={last7 as any} options={lineOptions as any} />
      </div>
    </div>
  )
}