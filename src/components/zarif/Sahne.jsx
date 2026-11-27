// Her vakit için gökyüzü sahnesi: o vaktin rengi ve güneşin/ayın konumu.
const SAHNE = {
  sabah: { bg: 'linear-gradient(165deg,#1e1b4b 0%,#4c1d95 45%,#db2777 85%,#fb923c 100%)', cisim: 'gunes', x: '26%', y: '36%', boy: 36, renk: '#fde68a' },
  ogle: { bg: 'linear-gradient(165deg,#0369a1 0%,#0ea5e9 50%,#7dd3fc 100%)', cisim: 'gunes', x: '78%', y: '24%', boy: 36, renk: '#fef3c7' },
  ikindi: { bg: 'linear-gradient(165deg,#9a3412 0%,#ea580c 50%,#fbbf24 100%)', cisim: 'gunes', x: '78%', y: '30%', boy: 38, renk: '#fef3c7' },
  aksam: { bg: 'linear-gradient(165deg,#3b0764 0%,#9d174d 50%,#f97316 100%)', cisim: 'gunes', x: '74%', y: '34%', boy: 40, renk: '#fdba74' },
  yatsi: { bg: 'linear-gradient(165deg,#020617 0%,#1e1b4b 60%,#312e81 100%)', cisim: 'ay', x: '80%', y: '26%', boy: 30, renk: '#e0e7ff', yildiz: true },
  vitir: { bg: 'linear-gradient(165deg,#020617 0%,#042f2e 55%,#115e59 100%)', cisim: 'ay', x: '78%', y: '24%', boy: 26, renk: '#ccfbf1', yildiz: true },
  'namaz-sonrasi': { bg: 'linear-gradient(165deg,#022c22 0%,#065f46 55%,#10b981 100%)', cisim: 'halka', x: '64%', y: '42%', boy: 34, renk: '#a7f3d0' },
  diger: { bg: 'linear-gradient(165deg,#082f49 0%,#155e75 55%,#06b6d4 100%)', cisim: 'halka', x: '64%', y: '42%', boy: 34, renk: '#a5f3fc' },
}

const YILDIZLAR = [
  [12, 18, 1.5], [28, 40, 1], [46, 14, 1.2], [60, 34, 1], [36, 62, 1.3], [16, 70, 1], [64, 58, 1.1], [52, 80, 0.9], [88, 62, 1],
]

export const sahneAl = (id) => SAHNE[id] ?? SAHNE.diger

export default function Sahne({ id, className = '', children }) {
  const s = sahneAl(id)
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: s.bg }}>
      {s.yildiz &&
        YILDIZLAR.map(([x, y, r], i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2, opacity: 0.35 + (i % 3) * 0.2 }}
            aria-hidden="true"
          />
        ))}

      {s.cisim === 'gunes' && (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: s.x,
            top: s.y,
            width: s.boy,
            height: s.boy,
            background: s.renk,
            boxShadow: `0 0 0 ${s.boy * 0.35}px ${s.renk}22, 0 0 ${s.boy * 1.4}px ${s.renk}99`,
          }}
          aria-hidden="true"
        />
      )}
      {s.cisim === 'ay' && (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: s.x, top: s.y, width: s.boy, height: s.boy, boxShadow: `inset -${s.boy * 0.28}px ${s.boy * 0.12}px 0 0 ${s.renk}`, filter: `drop-shadow(0 0 ${s.boy * 0.4}px ${s.renk}88)` }}
          aria-hidden="true"
        />
      )}
      {s.cisim === 'halka' && (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{ left: s.x, top: s.y, width: s.boy, height: s.boy, borderColor: `${s.renk}88`, boxShadow: `0 0 0 ${s.boy * 0.3}px ${s.renk}18` }}
          aria-hidden="true"
        />
      )}

      {/* Yazılar okunabilsin diye alttan koyulaşma */}
      <span className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent" aria-hidden="true" />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
