import Ikon from './Ikon'
import { temaAl } from '../tema'

function Tik() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  )
}

export default function NamazSayfasi({ liste, detay, bilinenMi, onDegistir, onAc, onGeri }) {
  const t = temaAl(liste.id)
  const idler = liste.okuma_sirasi.filter((id) => detay[id])
  const bilinen = idler.filter(bilinenMi).length
  const yuzde = idler.length ? Math.round((bilinen / idler.length) * 100) : 0

  return (
    <div className="space-y-6">
      <button type="button" onClick={onGeri} className="-ml-1 flex items-center gap-1 py-1 text-sm text-slate-400 transition hover:text-slate-100">
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5l-5 5 5 5" />
        </svg>
        Ana ekran
      </button>

      <section className={`relative overflow-hidden rounded-3xl border ${t.cerceve} bg-linear-to-br ${t.kart} p-5`}>
        <span className={`absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl ${t.parlama}`} aria-hidden="true" />
        <div className="relative flex items-center gap-4">
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${t.kutu}`}>
            <Ikon ad={t.ikon} className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-tight">{liste.ad}</h1>
            <p className="text-sm text-slate-300">
              {bilinen} / {idler.length} ezberlendi
            </p>
          </div>
        </div>
        <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-slate-900/50">
          <div className={`h-full rounded-full transition-all duration-500 ${t.dolgu}`} style={{ width: `${yuzde}%` }} />
        </div>
      </section>

      {yuzde === 100 && (
        <p className={`rounded-2xl px-4 py-3 text-sm font-medium ${t.pill}`}>Maşallah, bu listenin hepsini ezberledin.</p>
      )}

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Okuma sırası</h2>
        <ol className="space-y-2.5">
          {idler.map((id, i) => {
            const dua = detay[id]
            const b = bilinenMi(id)
            return (
              <li key={id} className="flex items-center gap-3 rounded-2xl border border-slate-700/50 bg-slate-800/60 p-3">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={b}
                  aria-label={`${dua.ad} ezberlendi`}
                  onClick={() => onDegistir(id)}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 transition active:scale-90 ${
                    b ? t.tikli : t.tikBos
                  }`}
                >
                  {b && <Tik />}
                </button>
                <button type="button" onClick={() => onAc(id)} className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left">
                  <span className="min-w-0">
                    <span className={`block truncate font-semibold ${b ? 'text-slate-500' : 'text-slate-100'}`}>{dua.ad}</span>
                    <span className="block text-xs text-slate-500">
                      {i + 1}. · {dua.ayetler.length} {dua.tur === 'sure' ? 'ayet' : 'satır'}
                    </span>
                  </span>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${b ? 'bg-slate-700/50 text-slate-500' : t.pill}`}>
                    {b ? 'Tekrar' : 'Çalış'}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
