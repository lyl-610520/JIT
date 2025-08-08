export type Locale = "zh" | "en";

const dict = {
  zh: {
    appName: "恰逢其时",
    ctaAddToHome: "将“恰逢其时”添加到主屏幕，获得沉浸体验",
    play: "播放",
    pause: "暂停",
    home: {
      greetingMorningEat: "吃早饭了吗？给自己一点能量。",
      weatherPrefix: "当前天气：",
    },
    nav: { home: "主页", stats: "统计", wardrobe: "养成与商店", settings: "设置" },
    settings: {
      appearanceLang: "显示与语言",
      mode: "显示模式",
      language: "语言",
      zh: "中文",
      en: "English",
      personalization: "个性化",
      petName: "宠物名称",
      weatherPref: "天气偏好",
      soundNotify: "声音与通知",
      sfx: "轻声音效",
      askPerm: "申请通知权限",
      resetTitle: "回到最初的时光",
      resetDesc: "清除所有数据并回到最初状态。",
      resetBtn: "开始重置",
      resetConfirm: "这会清除全部数据。\n\n我再想想 / 我明白",
      resetToast: "你即将涅槃重生，恭喜进入下一阶段。",
    },
  },
  en: {
    appName: "just in time",
    ctaAddToHome: "Add 'just in time' to your Home Screen for an immersive feel",
    play: "Play",
    pause: "Pause",
    home: {
      greetingMorningEat: "Had breakfast yet? A little energy goes a long way.",
      weatherPrefix: "Weather: ",
    },
    nav: { home: "Home", stats: "Stats", wardrobe: "Wardrobe & Store", settings: "Settings" },
    settings: {
      appearanceLang: "Appearance & Language",
      mode: "Display Mode",
      language: "Language",
      zh: "中文",
      en: "English",
      personalization: "Personalization",
      petName: "Pet name",
      weatherPref: "Weather preference",
      soundNotify: "Sound & Notifications",
      sfx: "Gentle SFX",
      askPerm: "Request notification permission",
      resetTitle: "Back to the beginning",
      resetDesc: "Erase all data and reset to the initial state.",
      resetBtn: "Reset now",
      resetConfirm: "This will erase all data.\n\nCancel / I understand",
      resetToast: "Phoenix reborn. Welcome to the next chapter.",
    },
  },
} as const;

type DictNode = string | { [k: string]: DictNode };

export function t(locale: Locale, path: string): string {
  const parts = path.split(".");
  let node: DictNode | undefined = dict[locale] as unknown as DictNode;
  for (const p of parts) {
    if (typeof node === "string" || node == null) break;
    node = (node as Record<string, DictNode>)[p];
  }
  return typeof node === "string" ? node : path;
}