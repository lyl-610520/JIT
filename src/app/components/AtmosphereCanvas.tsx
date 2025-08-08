"use client";
import { useEffect, useRef } from "react";

export interface AtmosphereProps {
  hour: number;
  month: number; // 0-11
  isNight: boolean;
  showRain: boolean;
  showSnow: boolean;
}

export default function AtmosphereCanvas({ hour, month, isNight, showRain, showSnow }: AtmosphereProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvasEl.getBoundingClientRect();
      canvasEl.width = Math.floor(rect.width * dpr);
      canvasEl.height = Math.floor(rect.height * dpr);
    };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const ctx = canvasEl.getContext("2d");
    let raf = 0;

    const getSize = () => ({ width: canvasEl.width, height: canvasEl.height });

    // Simple stars & meteors skeleton (will refine later)
    const stars = Array.from({ length: isNight ? 120 : 0 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.3 + Math.random() * 0.7,
      tw: Math.random() * Math.PI * 2,
    }));

    function draw(t: number) {
      if (!ctx) return;
      const { width, height } = getSize();
      ctx.clearRect(0, 0, width, height);

      // night sky
      if (isNight) {
        for (const s of stars) {
          const alpha = 0.5 + 0.5 * Math.sin(t / 1000 + s.tw);
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(s.x * width, s.y * height, s.r * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
        // occasional meteor
        if (Math.random() < 0.004) {
          const startX = Math.random() * width;
          const startY = Math.random() * height * 0.5;
          for (let i = 0; i < 40; i++) {
            ctx.strokeStyle = `rgba(255,255,255,${1 - i / 40})`;
            ctx.beginPath();
            ctx.moveTo(startX + i * 3, startY + i * 1.5);
            ctx.lineTo(startX + i * 3 + 8, startY + i * 1.5 + 2);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [isNight]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}