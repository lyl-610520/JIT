"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "@/lib/storage";

export type Language = "zh" | "en";
export type ThemeMode = "system" | "light" | "dark";
export type WeatherDislike = "none" | "rain" | "snow" | "wind";
export type Category = "life" | "study" | "work";

export interface PunchRecord {
  id: string;
  type: "wake" | "sleep" | "custom";
  category?: Category;
  text?: string;
  timestamp: number;
}

export interface Countdown {
  id: string;
  title: string;
  targetISO: string;
}

export interface MusicTrack {
  id: string;
  name: string;
  url: string; // runtime object URL or static path
  blobKey?: string; // if uploaded by user, persistent blob key
}

export interface AppState {
  language: Language;
  themeMode: ThemeMode;
  petName: string;
  weatherDislike: WeatherDislike;
  todayPunches: PunchRecord[];
  allPunches: PunchRecord[];
  countdown?: Countdown;
  musicQueue: MusicTrack[];
  currentTrackIndex: number;
  accessories: string[];
  currentAccessory?: string;
  lastWakeDateISO?: string;
  lastSleepDateISO?: string;
  enableSfx: boolean;
  dailyReminder?: string; // "HH:MM"

  setLanguage: (lang: Language) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setWeatherDislike: (w: WeatherDislike) => void;
  setPetName: (name: string) => void;

  setEnableSfx: (v: boolean) => void;
  setDailyReminder: (t?: string) => void;

  addPunch: (p: PunchRecord) => void;
  resetToday: () => void;

  setCountdown: (c?: Countdown) => void;

  enqueueTracks: (tracks: MusicTrack[]) => void;
  nextTrack: () => void;
  playAt: (index: number) => void;

  unlockAccessory: (key: string) => void;
  equipAccessory: (key: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: "zh",
      themeMode: "system",
      petName: "星野",
      weatherDislike: "none",
      todayPunches: [],
      allPunches: [],
      musicQueue: [],
      currentTrackIndex: 0,
      accessories: ["spring-basic", "summer-basic", "autumn-basic", "winter-basic"],
      enableSfx: true,

      setLanguage: (language) => set({ language }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setWeatherDislike: (weatherDislike) => set({ weatherDislike }),
      setPetName: (petName) => set({ petName }),

      setEnableSfx: (enableSfx) => set({ enableSfx }),
      setDailyReminder: (dailyReminder) => set({ dailyReminder }),

      addPunch: (p) => set((s) => ({ todayPunches: [p, ...s.todayPunches], allPunches: [p, ...s.allPunches] })),
      resetToday: () => set({ todayPunches: [] }),

      setCountdown: (countdown) => set({ countdown }),

      enqueueTracks: (tracks) => set((s) => ({ musicQueue: [...s.musicQueue, ...tracks] })),
      nextTrack: () => set((s) => ({ currentTrackIndex: (s.currentTrackIndex + 1) % Math.max(1, s.musicQueue.length) })),
      playAt: (index) => set({ currentTrackIndex: index }),

      unlockAccessory: (key) => set((s) => ({ accessories: Array.from(new Set([...s.accessories, key])) })),
      equipAccessory: (key) => set({ currentAccessory: key }),
    }),
    {
      name: "jit-app-state",
      storage: createJSONStorage(() => idbStorage),
      version: 2,
      partialize: (state) => state,
    }
  )
);