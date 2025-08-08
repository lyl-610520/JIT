"use client";
import { useAppStore, type Language, type ThemeMode, type WeatherDislike } from "@/store/appStore";

export default function PageSettings() {
  const { language, themeMode, petName, weatherDislike, setLanguage, setThemeMode, setPetName, setWeatherDislike } = useAppStore();

  return (
    <div className="min-h-screen safe-pt safe-pb p-6 theme-transition">
      <div className="max-w-3xl mx-auto grid gap-6">
        <div className="glass rounded-3xl p-6">
          <div className="text-lg mb-4">显示与语言</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-2">
              <span>显示模式</span>
              <select className="liquid rounded-xl p-3" value={themeMode} onChange={(e) => setThemeMode(e.target.value as ThemeMode)}>
                <option value="system">自动</option>
                <option value="light">浅色</option>
                <option value="dark">深色</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span>语言</span>
              <select className="liquid rounded-xl p-3" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="text-lg mb-4">个性化</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-2">
              <span>宠物名称</span>
              <input className="liquid rounded-xl p-3" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="给它起个名字" />
            </label>
            <label className="grid gap-2">
              <span>天气偏好</span>
              <select className="liquid rounded-xl p-3" value={weatherDislike} onChange={(e) => setWeatherDislike(e.target.value as WeatherDislike)}>
                <option value="none">无</option>
                <option value="rain">讨厌雨天</option>
                <option value="snow">讨厌雪天</option>
                <option value="wind">讨厌大风</option>
              </select>
            </label>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="text-lg mb-2">智能通知</div>
          <div className="opacity-70 mb-4">稍后将提供每日提醒时间与权限申请。</div>
          <div className="flex gap-3">
            <button
              className="liquid rounded-xl px-4 py-2"
              onClick={async () => {
                const perm = await Notification.requestPermission();
                alert(`通知权限：${perm}`);
              }}
            >
              申请通知权限
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}