import { useEffect, useRef } from 'react'
import { useAppStore } from '../state/store'

function isNight(): boolean {
  const h = new Date().getHours()
  return h >= 22 || h < 4
}

export default function CanvasFX({ weather }: { weather?: { main: string } }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const disliked = useAppStore(s => s.settings.dislikedWeathers)

  useEffect(() => {
    const canvas = document.getElementById('fx-canvas') as HTMLCanvasElement
    canvasRef.current = canvas
    const ctx = canvas.getContext('2d')!

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    // Starfield
    const stars: { x:number;y:number;z:number;t:number }[] = Array.from({ length: isNight() ? 120 : 0 }).map(() => ({
      x: Math.random()*w, y: Math.random()*h, z: Math.random()*1, t: Math.random()*1000
    }))

    // Shooting star timer
    let nextMeteor = Date.now() + 4000 + Math.random()*8000
    let meteor: { x:number;y:number;vx:number;vy:number;life:number } | null = null

    const month = new Date().getMonth()
    const season = month<=1||month===11? 'winter' : month<=4? 'spring' : month<=7? 'summer' : 'autumn'

    function drawTree() {
      ctx.save()
      ctx.globalAlpha = 0.75
      ctx.translate(w*0.15, h*0.85)
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'
      ctx.lineWidth = 8
      // trunk
      ctx.beginPath()
      ctx.moveTo(0,0)
      ctx.bezierCurveTo(30,-120, -10,-220, 20,-320)
      ctx.stroke()

      // branches (watercolor look with transparency)
      const colors: Record<string,string[]> = {
        spring: ['rgba(120,200,120,0.35)','rgba(180,230,160,0.25)'],
        summer: ['rgba(80,180,100,0.35)','rgba(120,210,140,0.25)'],
        autumn: ['rgba(220,150,60,0.35)','rgba(240,190,90,0.25)'],
        winter: ['rgba(200,210,230,0.25)','rgba(220,230,245,0.2)']
      }
      const palette = colors[season]
      for (let i=0;i<80;i++) {
        const ang = -Math.PI/2 + (Math.random()-0.5)*1.4
        const len = 100 + Math.random()*220
        ctx.strokeStyle = palette[i%palette.length]
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, -20)
        ctx.quadraticCurveTo(Math.cos(ang)*len*0.3, -50 + Math.sin(ang)*len*0.3, Math.cos(ang)*len, -50 + Math.sin(ang)*len)
        ctx.stroke()
      }
      ctx.restore()
    }

    function drawWeather() {
      if (!weather) return
      const main = weather.main.toLowerCase()
      if (main.includes('rain') && !disliked.includes('rain')) {
        // light rain lines
        ctx.strokeStyle = 'rgba(160,180,200,0.6)'
        ctx.lineWidth = 1
        for (let i=0;i<120;i++) {
          const x = Math.random()*w
          const y = Math.random()*h
          ctx.beginPath()
          ctx.moveTo(x,y)
          ctx.lineTo(x+4,y+12)
          ctx.stroke()
        }
      }
      if (main.includes('snow') && !disliked.includes('snow')) {
        for (let i=0;i<80;i++) {
          const x = Math.random()*w
          const y = Math.random()*h
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.beginPath(); ctx.arc(x,y,1.5,0,Math.PI*2); ctx.fill()
        }
      }
      if (main.includes('fog') && !disliked.includes('fog')) {
        const grad = ctx.createLinearGradient(0,0,0,h)
        grad.addColorStop(0,'rgba(200,210,220,0.05)')
        grad.addColorStop(1,'rgba(200,210,220,0.2)')
        ctx.fillStyle = grad
        ctx.fillRect(0,0,w,h)
      }
    }

    function loop() {
      ctx.clearRect(0,0,w,h)

      // Night stars
      if (isNight()) {
        for (const s of stars) {
          const flicker = 0.6 + 0.4*Math.sin((Date.now()+s.t)/1000)
          ctx.fillStyle = `rgba(255,255,255,${0.6*flicker})`
          ctx.fillRect(s.x, s.y, 1.2, 1.2)
        }
        if (!meteor && Date.now() > nextMeteor) {
          meteor = { x: Math.random()*w, y: Math.random()*h*0.4, vx: 6+Math.random()*6, vy: 2+Math.random()*2, life: 60 }
          nextMeteor = Date.now() + 8000 + Math.random()*12000
        }
        if (meteor) {
          ctx.strokeStyle = 'rgba(255,255,255,0.8)'
          ctx.lineWidth = 2
          ctx.beginPath(); ctx.moveTo(meteor.x, meteor.y); ctx.lineTo(meteor.x-meteor.vx*3, meteor.y-meteor.vy*3); ctx.stroke()
          meteor.x += meteor.vx; meteor.y += meteor.vy; meteor.life--
          if (meteor.life<=0) meteor = null
        }
      }

      // Tree
      drawTree()
      // Weather overlay
      drawWeather()

      requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [weather, disliked])

  return null
}