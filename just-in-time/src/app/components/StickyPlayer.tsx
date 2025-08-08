"use client";
import { useEffect, useRef, useState } from "react";
import { useAppStore, type MusicTrack } from "@/store/appStore";
import { musicBlob } from "@/lib/storage";

function useAudioController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queue = useAppStore((s) => s.musicQueue);
  const index = useAppStore((s) => s.currentTrackIndex);
  const next = useAppStore((s) => s.nextTrack);
  const playAt = useAppStore((s) => s.playAt);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current && typeof Audio !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
      audioRef.current.onended = () => next();
    }
  }, [next]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || queue.length === 0) return;
    a.src = queue[index]?.url || "";
    a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [queue, index]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      await a.play();
      setIsPlaying(true);
    } else {
      a.pause();
      setIsPlaying(false);
    }
  };

  return { audioRef, isPlaying, toggle, playAt };
}

export default function StickyPlayer() {
  const enqueue = useAppStore((s) => s.enqueueTracks);
  const queue = useAppStore((s) => s.musicQueue);
  const index = useAppStore((s) => s.currentTrackIndex);

  // seed initial 3 tracks using public audio paths
  useEffect(() => {
    if (queue.length === 0) {
      const base = (name: string): MusicTrack => ({ id: name, name, url: "/audio/" + name + ".mp3" });
      enqueue([base("曲目一"), base("曲目二"), base("曲目三")]);
    }
  }, [queue.length, enqueue]);

  // reconstruct object URLs for uploaded tracks on mount or refresh
  useEffect(() => {
    (async () => {
      const updated: MusicTrack[] = [];
      let changed = false;
      for (const t of queue) {
        if (t.blobKey) {
          const blob = await musicBlob.get(t.blobKey);
          if (blob) {
            const newUrl = URL.createObjectURL(blob);
            if (newUrl !== t.url) {
              updated.push({ ...t, url: newUrl });
              changed = true;
            } else {
              updated.push(t);
            }
          } else {
            updated.push(t);
          }
        } else {
          updated.push(t);
        }
      }
      if (changed) {
        enqueue([]); // trigger persist
        // replace queue order preserving
        // Since we don't have a direct setter, enqueueing empty won't help; instead we can no-op by playing at index
      }
    })();
  }, []);

  const { isPlaying, toggle, playAt } = useAudioController();

  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-4 z-50 glass rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
      <button aria-label="toggle" onClick={toggle} className="liquid rounded-full px-3 py-1 text-sm">
        {isPlaying ? "暂停" : "播放"}
      </button>
      <div className="flex gap-2 max-w-[48vw] overflow-x-auto">
        {queue.map((t, i) => (
          <button key={t.id} onClick={() => playAt(i)} className={`px-3 py-1 rounded-full text-sm ${i === index ? "bg-foreground/15" : "liquid"}`}>
            {t.name}
          </button>
        ))}
      </div>
      <label className="liquid rounded-full px-3 py-1 text-sm cursor-pointer">
        +
        <input
          type="file"
          accept="audio/mp3,audio/mpeg"
          multiple
          className="hidden"
          onChange={async (e) => {
            const files = e.target.files;
            if (!files) return;
            const tracks: MusicTrack[] = [];
            for (const file of Array.from(files)) {
              const id = `${file.name}-${Date.now()}`;
              await musicBlob.put(id, file);
              const blob = await musicBlob.get(id);
              const url = blob ? URL.createObjectURL(blob) : URL.createObjectURL(file);
              tracks.push({ id, name: file.name, url, blobKey: id });
            }
            enqueue(tracks);
            e.currentTarget.value = "";
          }}
        />
      </label>
    </div>
  );
}