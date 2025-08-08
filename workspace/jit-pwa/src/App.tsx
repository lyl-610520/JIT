import { Suspense } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Stats from './pages/Stats'
import Wardrobe from './pages/Wardrobe'
import Settings from './pages/Settings'
import GlobalPlayer from './components/GlobalPlayer'
import InstallPrompt from './components/InstallPrompt'
import Scheduler from './components/Scheduler'
import Splash from './components/Splash'
import './i18n'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="safe-area-pads min-h-dvh w-full overflow-hidden">
      <Splash />
      <div id="bg-gradient" className="fixed inset-0 -z-20 transition-all" />
      <canvas id="fx-canvas" className="fixed inset-0 -z-10 pointer-events-none" />

      <div className="sticky top-0 z-30 p-3">
        <div className="glass liquid rounded-2xl px-4 py-3 shadow-glass">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm opacity-80">just in time · 恰逢其时</div>
            <GlobalPlayer />
          </div>
        </div>
      </div>

      <nav className="sticky top-[64px] z-20 px-3">
        <div className="glass rounded-2xl shadow-glass px-3 py-2 flex items-center justify-between">
          <div className="flex gap-2 text-sm">
            <NavLink to="/" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive? 'bg-white/20 dark:bg-white/10' : ''}`}>Home</NavLink>
            <NavLink to="/stats" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive? 'bg-white/20 dark:bg-white/10' : ''}`}>Stats</NavLink>
            <NavLink to="/wardrobe" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive? 'bg-white/20 dark:bg-white/10' : ''}`}>Wardrobe</NavLink>
            <NavLink to="/settings" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive? 'bg-white/20 dark:bg-white/10' : ''}`}>Settings</NavLink>
          </div>
        </div>
      </nav>

      <main className="px-4 py-5">
        <div className="mx-auto w-full max-w-[1100px]">
          {children}
        </div>
      </main>

      <InstallPrompt />
      <Scheduler />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Suspense fallback={<div className="glass rounded-2xl p-5">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </Shell>
    </BrowserRouter>
  )
}
