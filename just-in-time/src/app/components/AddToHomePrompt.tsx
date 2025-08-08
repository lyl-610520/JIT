"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/appStore";
import { t } from "@/lib/i18n";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function AddToHomePrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const lang = useAppStore((s) => s.language);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 glass rounded-2xl p-4 flex items-center gap-3 shadow-lg">
      <div className="text-sm opacity-80">{t(lang, "ctaAddToHome")}</div>
      <button
        className="liquid rounded-xl px-3 py-1 text-sm"
        onClick={async () => {
          if (!deferredPrompt) return setVisible(false);
          await deferredPrompt.prompt();
          await deferredPrompt.userChoice;
          setVisible(false);
        }}
      >
        {lang === "zh" ? "添加" : "Add"}
      </button>
      <button className="px-2 py-1 text-sm opacity-70" onClick={() => setVisible(false)}>{lang === "zh" ? "稍后" : "Later"}</button>
    </div>
  );
}