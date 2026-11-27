import { useEffect, useRef, useState } from 'react'
import Ikon from '../Ikon'
import Aurora from './Aurora'
import { temaAl } from '../../tema'

const SAAT = { sabah: 'imsak', ogle: 'ogle', ikindi: 'ikindi', aksam: 'aksam', yatsi: 'yatsi', vitir: 'yatsi' }
const KIVILCIM = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2
  return { dx: `${Math.cos(a) * 70}px`, dy: `${Math.sin(a) * 50}px`, gecikme: (i % 5) * 0.12, renk: ['#5eead4', '#a5b4fc', '#f0abfc', '#fde68a'][i % 4] }
})

export default function TesbihSayfasi({ liste, detay, bilinenMi, onDegistir, onAc, onGeri, vakitler }) {
  const idler = liste.okuma_sirasi.filter((id) => detay[id])
  const bilinen = idler.filter(bilinenMi).length
  const yuzde = idler.length ? Math.round((bilinen / idler.length) * 100) : 0
  const siradakiId = idler.find((id) => !bilinenMi(id))
  const saat = vakitler?.bugun && SAAT[liste.id] ? vakitler.bugun[SAAT[liste.id]] : null
  const cuma = vakitler?.cuma && liste.id === 'ogle'

  // Tamamlandığı an kutlama
  const [kutla, setKutla] = useState(false)
  const onceki = useRef(yuzde)
  useEffect(() => {
    if (yuzde === 100 && onceki.current < 100) setKutla(true)
    onceki.current = yuzde
  }, [yuzde])

  const tikla = (id) => {
    try {
      navigator.vibrate?.(12)
    } catch {
      // titreşim yoksa sorun değil
    }
    onDegistir(id)
  }

  return (
    <div className="relative">
      <Aurora />
      <div className="relative space-y-6">
        <div className="k-yukari flex items-center justify-between">
          <button
            type="button"
            onClick={onGeri}
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur-md transition hover:bg-white/10"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5l-5 5 5 5" />
            </svg>
            Kadran
          </button>
          {saat && (
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tabular-nums ${cuma ? 'bg-amber-400/20 text-amber-300' : 'bg-white/10 text-slate-200'}`}>
              <Ikon ad={cuma ? 'cuma' : temaAl(liste.id).ikon} className="h-4 w-4" />
              {cuma ? 'Cuma · ' : ''}
              {saat}
            </span>
          )}
        </div>

        <header className="k-yukari flex items-center gap-4" style={{ animationDelay: '0.05s' }}>
          <div className="relative h-20 w-20 shrink-0">
            <svg viewBox="0 0 80 80" className="-rotate-90" aria-hidden="true">
              <defs>
                <linearGradient id="t-yay" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#5eead4" />
                  <stop offset="1" stopColor="#e879f9" />
                </linearGradient>
              </defs>
              <circle cx="40" cy="40" r="34" fill="none" strokeWidth="7" stroke="rgb(255 255 255 / 0.1)" />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                strokeWidth="7"
                strokeLinecap="round"
                stroke="url(#t-yay)"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - yuzde / 100)}
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold tabular-nums">%{yuzde}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">Okuma sırası</p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{liste.ad}</h1>
            <p className="text-sm text-slate-400">
              {bilinen}/{idler.length} ezberlendi · {idler.length - bilinen} kaldı
            </p>
          </div>
        </header>

        {yuzde === 100 ? (
          <div className="k-yukari relative overflow-hidden rounded-2xl border border-teal-300/30 bg-teal-300/10 px-4 py-4 text-center">
            {kutla &&
              KIVILCIM.map((k, i) => (
                <span
                  key={i}
                  className="k-kivilcim absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                  style={{ background: k.renk, '--dx': k.dx, '--dy': k.dy, animationDelay: `${k.gecikme}s` }}
                  aria-hidden="true"
                />
              ))}
            <p className="relative text-lg font-extrabold text-teal-100">Maşallah! Tesbih tamamlandı</p>
            <p className="relative text-sm text-teal-200/80">Bu namazın tüm okumalarını ezberledin.</p>
          </div>
        ) : (
          <p className="k-yukari px-1 text-xs text-slate-500" style={{ animationDelay: '0.1s' }}>
            Taneye dokun: ezberledim · İsme dokun: çalış
          </p>
        )}

        {/* Tesbih: ip ve taneler */}
        <ol className="relative">
          <span className="absolute bottom-8 left-[1.45rem] top-6 w-0.5 rounded-full bg-linear-to-b from-teal-300/60 via-indigo-400/40 to-fuchsia-400/40" aria-hidden="true" />
          {idler.map((id, i) => {
            const dua = detay[id]
            const b = bilinenMi(id)
            const sira = id === siradakiId
            return (
              <li key={id} className="k-yukari relative flex items-center gap-3 py-1.5" style={{ animationDelay: `${0.12 + i * 0.04}s` }}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={b}
                  aria-label={`${dua.ad} ezberlendi`}
                  onClick={() => tikla(id)}
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center"
                >
                  <span
                    key={`${id}-${b}`}
                    className={`k-pop flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold tabular-nums shadow-lg transition ${
                      b
                        ? 'bg-linear-to-br from-teal-300 via-indigo-300 to-fuchsia-300 text-slate-900 shadow-teal-500/30'
                        : sira
                          ? 'k-parla border-2 border-teal-300 bg-slate-900 text-teal-200'
                          : 'border border-white/15 bg-slate-800 text-slate-400 hover:border-teal-300/60'
                    }`}
                  >
                    {b ? (
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 10.5l4 4 8-9" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onAc(id)}
                  className={`flex min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left backdrop-blur-md transition active:scale-[0.99] ${
                    sira ? 'border-teal-300/40 bg-teal-300/[0.08] hover:bg-teal-300/[0.12]' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="min-w-0">
                    <span className={`block truncate font-semibold ${b ? 'text-slate-500' : 'text-slate-100'}`}>{dua.ad}</span>
                    <span className="block text-xs text-slate-500">
                      {sira ? <span className="font-semibold text-teal-300">Sıradaki ezber · </span> : ''}
                      {dua.ayetler.length} {dua.tur === 'sure' ? 'ayet' : 'satır'}
                    </span>
                  </span>
                  <span className={`shrink-0 text-xs font-semibold ${b ? 'text-slate-500' : 'text-teal-300'}`}>{b ? 'Tekrar' : 'Çalış →'}</span>
                </button>
              </li>
            )
          })}
          <li className="relative flex py-2 pl-[0.95rem]" aria-hidden="true">
            <span className="h-6 w-6 rotate-45 rounded-md bg-linear-to-br from-teal-300 to-fuchsia-400 opacity-80" />
          </li>
        </ol>
      </div>
    </div>
  )
}
