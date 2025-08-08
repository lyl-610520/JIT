"use client";
import { useEffect, useState } from "react";

export default function IntroOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const key = "jit.intro.seen";
    if (!sessionStorage.getItem(key)) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem(key, "1");
      }, 2600);
      return () => clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="glass rounded-3xl p-8 text-center animate-[fadeIn_.6s_ease]">
        <div className="text-2xl mb-2">恰逢其时</div>
        <div className="opacity-80">愿你被温柔以待</div>
        <button className="liquid rounded-xl px-4 py-2 mt-4" onClick={() => setShow(false)}>跳过</button>
      </div>
    </div>
  );
}