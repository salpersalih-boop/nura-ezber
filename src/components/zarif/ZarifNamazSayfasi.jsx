import Sahne from './Sahne'
import { temaAl } from '../../tema'

export default function ZarifNamazSayfasi({ liste, detay, bilinenMi, onDegistir, onAc, onGeri }) {
  const t = temaAl(liste.id)
  const idler = liste.okuma_sirasi.filter((id) => detay[id])
  const bilinen = idler.filter(bilinenMi).length
  const yuzde = idler.length ? Math.round((bilinen / idler.length) * 100) : 0

  return (
    <div className="space-y-5">
      <div className="-mx-5 -mt-6 overflow-hidden rounded-b-[2rem] shadow-2xl shadow-black/40">
        <Sahne id={liste.id} className="h-60">
          <div className="flex h-full flex-col justify-between p-5 pt-6">
            <button
              type="button"
              onClick={onGeri}
              aria-label="Geri"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur transition hover:bg-black/40"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5l-5 5 5 5" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow">{liste.ad}</h1>
              <p className="mt-1 text-sm font-medium text-white/80">
                {bilinen} / {idler.length} ezberlendi
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${yuzde}%` }} />
              </div>
            </div>
          </div>
        </Sahne>
      </div>

      {yuzde === 100 && <p className={`rounded-2xl px-4 py-3 text-sm font-medium ${t.pill}`}>Maşallah, bu listenin hepsini ezberledin.</p>}

      <h2 className="px-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Okuma sırası</h2>
      <ol className="overflow-hidden rounded-3xl bg-slate-800/60 ring-1 ring-white/5">
        {idler.map((id, i) => {
          const dua = detay[id]
          const b = bilinenMi(id)
          return (
            <li key={id} className="flex items-center border-b border-white/5 last:border-0">
              <button
                type="button"
                role="checkbox"
                aria-checked={b}
                aria-label={`${dua.ad} ezberlendi`}
                onClick={() => onDegistir(id)}
                className="flex h-16 w-14 shrink-0 items-center justify-center"
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition active:scale-90 ${b ? t.tikli : t.tikBos}`}>
                  {b && (
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 10.5l4 4 8-9" />
                    </svg>
                  )}
                </span>
              </button>
              <button type="button" onClick={() => onAc(id)} className="flex min-w-0 flex-1 items-center justify-between gap-3 py-3 pr-4 text-left">
                <span className="min-w-0">
                  <span className={`block truncate font-semibold ${b ? 'text-slate-500' : 'text-slate-100'}`}>{dua.ad}</span>
                  <span className="block text-xs text-slate-500">
                    {i + 1}. sırada · {dua.ayetler.length} {dua.tur === 'sure' ? 'ayet' : 'satır'}
                  </span>
                </span>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${b ? 'text-slate-500' : t.pill}`}>{b ? 'Tekrar' : 'Çalış'}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
