import { useEffect, useState } from 'react'

export default function Splash() {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const id = setTimeout(()=>setShow(false), 2000)
    return () => clearTimeout(id)
  }, [])
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-xl">
      <div className="glass rounded-2xl px-6 py-4 text-center">
        <div className="text-2xl font-semibold">just in time</div>
        <div className="text-sm opacity-80 mt-1">恰逢其时</div>
        <button className="mt-3 px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10" onClick={()=>setShow(false)}>跳过</button>
      </div>
    </div>
  )
}