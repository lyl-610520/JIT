"use client";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/appStore";

export default function InitClient() {
  const { setTheme } = useTheme();
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  useEffect(() => {
    document.documentElement.classList.add("theme-transition");
    const timer = setTimeout(() => document.documentElement.classList.remove("theme-transition"), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // First run language auto detection
    const bootKey = "jit.booted";
    if (!localStorage.getItem(bootKey)) {
      const sys = (navigator.language || "zh").toLowerCase();
      if (sys.startsWith("zh")) setLanguage("zh");
      else setLanguage("en");
      localStorage.setItem(bootKey, "1");
    }
  }, [setLanguage]);

  return null;
}