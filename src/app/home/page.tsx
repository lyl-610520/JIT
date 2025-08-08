"use client";
import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/store/appStore";

type WeatherData = {
  location?: { name: string; country: string };
  current?: { temp_c: number; condition?: { text?: string } };
};

function useWeather() {
  const dislike = useAppStore((s) => s.weatherDislike);
  const [data, setData] = useState<WeatherData | null>(null);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const fetchWeather = async (q?: string) => {
      const res = await fetch(`/api/weather${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      if (!res.ok) return;
      const json = (await res.json()) as WeatherData;
      if (!cancelled) setData(json);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const q = `${pos.coords.latitude},${pos.coords.longitude}`;
          fetchWeather(q);
        },
        () => fetchWeather(),
        { maximumAge: 30_000, enableHighAccuracy: false, timeout: 10_000 }
      );
    } else {
      fetchWeather();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!data?.current) return;
    const cond = data.current.condition?.text || "";
    const temp = Math.round(data.current.temp_c);
    let line = `当前天气：${cond}，${temp}℃`;
    if (/rain/i.test(cond) && dislike === "rain") line += "。别担心，雨会停的。";
    if (/snow/i.test(cond) && dislike === "snow") line += "。注意保暖，慢慢来。";
    setText(line);
  }, [data, dislike]);

  return text;
}

function Clock() {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = useMemo(() => now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), [now]);
  return <div className="text-5xl font-medium tabular-nums tracking-tight">{time}</div>;
}

function useRichGreeting() {
  const store = useAppStore();
  return useMemo(() => {
    const h = new Date().getHours();
    const weatherHint = ""; // reserved, could integrate detailed from useWeather if needed
    const name = store.petName || "朋友";
    if (h < 6) return `夜深了，${name}。愿你被温柔以待。`;
    if (h < 8) return `清晨的风很轻，${name}，新的一天开始了。`;
    if (h < 10) return `吃早饭了吗？${name}，给自己一点能量。`;
    if (h < 12) return `上午好，${name}。保持专注，也记得放松。`;
    if (h < 14) return `午后小憩一会儿也很好，${name}。`;
    if (h < 17) return `下午好，${name}。一步步来，已经很棒。`;
    if (h < 20) return `傍晚到了，${name}。今天也辛苦啦。`;
    if (h < 22) return `夜色温柔，${name}。给自己一点安宁。`;
    return `夜安，${name}。慢慢来，睡前放空一下吧。`;
  }, [store.petName]);
}

export default function PageHome() {
  const petName = useAppStore((s) => s.petName);
  const greeting = useRichGreeting();
  const weatherLine = useWeather();

  return (
    <div className="min-h-screen safe-pt safe-pb p-6 theme-transition">
      <div className="max-w-4xl mx-auto grid gap-6">
        <div className="glass rounded-3xl p-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xl opacity-80">{greeting}</div>
            <div className="text-sm opacity-70">{weatherLine}</div>
          </div>
          <Clock />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 min-h-40">闹钟与快捷打卡（即将到来）</div>
          <div className="glass rounded-3xl p-6 min-h-40">音乐播放器（顶部固定）</div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 min-h-40">自定义打卡与列表（即将到来）</div>
          <div className="glass rounded-3xl p-6 min-h-40">游戏化面板与倒计时（即将到来）</div>
        </div>
      </div>
    </div>
  );
}