"use client";
import { useMemo } from "react";
import AtmosphereCanvas from "@/app/components/AtmosphereCanvas";
import { useAppStore } from "@/store/appStore";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const dislike = useAppStore((s) => s.weatherDislike);

  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth();
  const isNight = hour >= 22 || hour < 4;

  const bg = useMemo(() => {
    const slot = Math.floor(hour / 2); // 0..11
    const colors = [
      "from-[#0b0f14] via-[#0d1b2a] to-[#1b263b]",
      "from-[#0d1b2a] via-[#102a43] to-[#1b3a57]",
      "from-[#17324a] via-[#204b57] to-[#2d6a4f]",
      "from-[#1e3a5f] via-[#3a5a40] to-[#74c69d]",
      "from-[#264653] via-[#2a9d8f] to-[#e9c46a]",
      "from-[#2a9d8f] via-[#e76f51] to-[#e9c46a]",
      "from-[#f4a261] via-[#e76f51] to-[#2a9d8f]",
      "from-[#e76f51] via-[#6d597a] to-[#355070]",
      "from-[#6d597a] via-[#264653] to-[#0b0f14]",
      "from-[#0b0f14] via-[#0b132b] to-[#1c2541]",
      "from-[#0b132b] via-[#1d3557] to-[#457b9d]",
      "from-[#1d3557] via-[#0b132b] to-[#0b0f14]",
    ];
    return colors[slot % colors.length];
  }, [hour]);

  const showRain = dislike !== "rain"; // placeholder, real weather later
  const showSnow = dislike !== "snow";

  return (
    <div className={`relative min-h-dvh theme-transition bg-gradient-to-br ${bg}`}>
      <div className="absolute inset-0 opacity-70">
        <AtmosphereCanvas hour={hour} month={month} isNight={isNight} showRain={showRain} showSnow={showSnow} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}