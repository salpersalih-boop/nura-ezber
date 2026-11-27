// Ana ekranın en altında: üç görünüm arasında geçiş
export const GORUNUMLER = [
  { id: 'renkli', ad: '1. Görünüm' },
  { id: 'zarif', ad: '2. Görünüm' },
  { id: 'kadran', ad: '3. Görünüm' },
]

export default function GorunumSecici({ tasarim, onSec }) {
  if (!onSec) return null
  return (
    <div className="pt-2">
      <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-500">Görünüm</p>
      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-800/80 p-1 ring-1 ring-white/5">
        {GORUNUMLER.map((g) => {
          const aktif = g.id === tasarim
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onSec(g.id)}
              aria-pressed={aktif}
              className={`rounded-xl px-2 py-2 text-center transition ${
                aktif ? 'bg-slate-100 text-slate-900 shadow' : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-100'
              }`}
            >
              <span className="block text-sm font-bold">{g.ad}</span>
              <span className={`block text-[10px] ${aktif ? 'text-slate-600' : 'text-slate-500'}`}>{aktif ? 'Mevcut görünüm' : 'Geç'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
