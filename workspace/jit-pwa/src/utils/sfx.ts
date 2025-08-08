import { useAppStore } from '../state/store'

let audioCtx: AudioContext | null = null

export function playSfx(type: 'success'|'tap'|'notify' = 'success') {
  const enabled = useAppStore.getState().settings.sfxEnabled
  if (!enabled) return
  if (!audioCtx) audioCtx = new AudioContext()
  const ctx = audioCtx
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.value = type==='success'? 660 : type==='tap'? 520 : 440
  g.gain.value = 0.0001
  o.connect(g).connect(ctx.destination)
  const now = ctx.currentTime
  g.gain.exponentialRampToValueAtTime(0.08, now + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)
  o.start()
  o.stop(now + 0.26)
}