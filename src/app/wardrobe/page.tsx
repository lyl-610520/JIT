"use client";
import { useAppStore } from "@/store/appStore";

export default function PageWardrobe() {
  const accessories = useAppStore((s) => s.accessories);
  const current = useAppStore((s) => s.currentAccessory);
  const equip = useAppStore((s) => s.equipAccessory);
  return (
    <div className="min-h-screen safe-pt safe-pb p-6 theme-transition">
      <div className="max-w-4xl mx-auto grid gap-6">
        <div className="glass rounded-3xl p-8">
          <div className="text-lg mb-4">宠物衣柜（默认解锁四季基础配饰）</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {accessories.map((a) => (
              <button key={a} onClick={() => equip(a)} className={`liquid rounded-2xl p-4 ${current === a ? "ring-2 ring-foreground/60" : ""}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="glass rounded-3xl p-8">主题商店 / 配饰商店（即将到来）</div>
      </div>
    </div>
  );
}