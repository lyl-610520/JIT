import { useAppStore } from '../state/store'

const accessories = [
  { id: 'spring-grass', name: '春·青草' },
  { id: 'summer-fan', name: '夏·扇子' },
  { id: 'autumn-fruit', name: '秋·果实' },
  { id: 'winter-scarf', name: '冬·围巾' }
]

export default function Wardrobe() {
  const petAcc = useAppStore(s => s.game.petAccessory)
  const setAcc = useAppStore(s => s.setPetAccessory)
  const unlocked = useAppStore(s => s.game.unlockedAccessories)

  return (
    <div className="grid gap-4">
      <div className="glass rounded-2xl p-5">
        <div className="text-lg font-semibold mb-2">宠物衣柜</div>
        <div className="flex gap-3 flex-wrap">
          {accessories.map(a => (
            <button key={a.id} disabled={!unlocked.includes(a.id)} onClick={()=>setAcc(a.id)} className={`px-3 py-2 rounded-xl ${petAcc===a.id? 'bg-black/20 dark:bg-white/20':'bg-black/10 dark:bg-white/10'} disabled:opacity-50`}>
              {a.name}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="text-lg font-semibold mb-2">主题商店</div>
        <div className="text-sm opacity-80">即将到来…</div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="text-lg font-semibold mb-2">配饰商店</div>
        <div className="text-sm opacity-80">即将到来…</div>
      </div>
    </div>
  )
}