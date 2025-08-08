"use client";
import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/store/appStore";

function Clock() {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = useMemo(() => now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), [now]);
  return <div className="text-5xl font-medium tabular-nums tracking-tight">{time}</div>;
}

export default function PageHome() {
  const petName = useAppStore((s) => s.petName);
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "夜深了";
    if (h < 11) return "早安";
    if (h < 14) return "午安";
    if (h < 18) return "午后好";
    if (h < 22) return "晚上好";
    return "夜安";
  }, []);

  return (
    <div className="min-h-screen safe-pt safe-pb p-6 theme-transition">
      <div className="max-w-4xl mx-auto grid gap-6">
        <div className="glass rounded-3xl p-8 flex items-center justify-between">
          <div>
            <div className="text-xl opacity-80">{greeting}</div>
            <div className="text-2xl mt-1">{petName}，恰逢其时。</div>
          </div>
          <Clock />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 min-h-40">闹钟与快捷打卡（即将到来）</div>
          <div className="glass rounded-3xl p-6 min-h-40">音乐播放器（即将到来）</div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 min-h-40">自定义打卡与列表（即将到来）</div>
          <div className="glass rounded-3xl p-6 min-h-40">游戏化面板与倒计时（即将到来）</div>
        </div>
      </div>
    </div>
  );
}