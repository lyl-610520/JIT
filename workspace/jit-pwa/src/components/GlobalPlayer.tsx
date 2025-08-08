import { Howl } from 'howler'
import { useEffect, useState } from 'react'
import { useAppStore } from '../state/store'
import type { MusicTrack } from '../state/store'
import { idb, loadBlobUrl } from '../utils/storage'

async function generateToneBlob(duration = 4, freq = 432): Promise<Blob> {
  const ctx = new (window.OfflineAudioContext as any)(1, 44100 * duration, 44100) as OfflineAudioContext
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.value = 0.08
  osc.connect(gain).connect(ctx.destination)
  osc.start(0)
  osc.stop(duration)
  const buf = await ctx.startRendering()
  const wav = audioBufferToWav(buf)
  return new Blob([wav], { type: 'audio/wav' })
}

function audioBufferToWav(buffer: AudioBuffer) {
  const numOfChan = buffer.numberOfChannels
  const length = buffer.length * numOfChan * 2 + 44
  const bufferArray = new ArrayBuffer(length)
  const view = new DataView(bufferArray)
  const channels = [] as Float32Array[]
  let i, sample
  let offset = 0
  let pos = 0

  setUint32(0x46464952) // "RIFF"
  setUint32(length - 8) // file length - 8
  setUint32(0x45564157) // "WAVE"

  setUint32(0x20746d66) // "fmt " chunk
  setUint32(16) // length = 16
  setUint16(1) // PCM (uncompressed)
  setUint16(numOfChan)
  setUint32(buffer.sampleRate)
  setUint32(buffer.sampleRate * 2 * numOfChan) // avg. bytes/sec
  setUint16(numOfChan * 2) // block-align
  setUint16(16) // 16-bit (hardcoded in this demo)

  setUint32(0x61746164) // "data" - chunk
  setUint32(length - pos - 4) // chunk length

  for (i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i))

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) { // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])) // clamp
      sample = (0.5 + sample * 0.5) * 65535 // scale to 16-bit unsigned int
      view.setUint16(pos, sample, true) // write 16-bit sample
      pos += 2
    }
    offset++
  }

  return bufferArray

  function setUint16(data: number) { view.setUint16(pos, data, true); pos += 2 }
  function setUint32(data: number) { view.setUint32(pos, data, true); pos += 4 }
}

export default function GlobalPlayer() {
  const { playlist, currentIndex } = useAppStore(s => s.music)
  const setPlaylist = useAppStore(s => s.setPlaylist)
  const setCurrentIndex = useAppStore(s => s.setCurrentIndex)
  const [howl, setHowl] = useState<Howl | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Recreate object URLs for stored keys
  useEffect(() => {
    (async () => {
      if (playlist.length > 0 && playlist.every(t => t.src)) return
      const rebuilt: MusicTrack[] = []
      for (const t of playlist) {
        const url = t.src || (t.key ? await loadBlobUrl(t.key) : undefined)
        rebuilt.push({ ...t, src: url })
      }
      setPlaylist(rebuilt)
    })()
  }, [])

  // Bootstrap defaults if empty
  useEffect(() => {
    (async () => {
      if (playlist.length === 0) {
        const tones = await Promise.all([
          generateToneBlob(5, 396),
          generateToneBlob(5, 432),
          generateToneBlob(5, 528)
        ])
        const tracks: MusicTrack[] = []
        for (let i=0;i<3;i++) {
          const key = `tone-${i}`
          await idb.set(key, tones[i])
          const url = await loadBlobUrl(key)!
          tracks.push({ id: `builtin-${i}`, name: `曲目${['一','二','三'][i]}`, key, src: url })
        }
        setPlaylist(tracks)
      }
    })()
  }, [])

  useEffect(() => {
    howl?.unload()
    const current = playlist[currentIndex]
    if (!current || !current.src) return
    const h = new Howl({ src: [current.src], html5: true, volume: 0.8 })
    setHowl(h)
    return () => { h.unload() }
  }, [playlist, currentIndex])

  const playPause = () => { if (!howl) return; howl.playing()? (howl.pause(), setIsPlaying(false)) : (howl.play(), setIsPlaying(true)) }
  const next = () => { setCurrentIndex((currentIndex + 1) % Math.max(1, playlist.length)) }

  const onUpload = async (files: FileList | null) => {
    if (!files) return
    const added: MusicTrack[] = []
    for (const f of Array.from(files)) {
      const key = `music-${Date.now()}-${f.name}`
      await idb.set(key, f)
      const url = await loadBlobUrl(key)!
      added.push({ id: `u-${Date.now()}-${f.name}`, name: f.name, key, src: url })
    }
    setPlaylist([...playlist, ...added])
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={playPause} aria-label="play/pause" className="px-2 py-1 rounded-xl bg-black/10 dark:bg-white/10">{isPlaying? '⏸' : '▶️'}</button>
      <button onClick={next} aria-label="next" className="px-2 py-1 rounded-xl bg-black/10 dark:bg-white/10">⏭</button>
      <label className="px-2 py-1 rounded-xl bg-black/10 dark:bg-white/10 cursor-pointer">
        ＋<input type="file" multiple accept="audio/mpeg,audio/mp3,audio/*" className="hidden" onChange={e=>onUpload(e.target.files)} />
      </label>
    </div>
  )
}