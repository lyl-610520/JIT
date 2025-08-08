import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen safe-pt safe-pb px-6 py-6 flex flex-col items-center justify-center gap-8 theme-transition">
      <div className="glass rounded-3xl p-8 w-full max-w-3xl shadow-[0_10px_40px_-20px_rgba(0,0,0,.65)]">
        <h1 className="text-3xl font-semibold tracking-tight">just in time（恰逢其时）</h1>
        <p className="mt-2 opacity-80">沉浸式美学与温度并存的 PWA。请选择页面开始探索：</p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link className="liquid rounded-2xl p-4 text-center hover:opacity-95" href="/home">主页</Link>
          <Link className="liquid rounded-2xl p-4 text-center hover:opacity-95" href="/stats">统计</Link>
          <Link className="liquid rounded-2xl p-4 text-center hover:opacity-95" href="/wardrobe">养成与商店</Link>
          <Link className="liquid rounded-2xl p-4 text-center hover:opacity-95" href="/settings">设置</Link>
        </div>
      </div>
    </div>
  );
}
