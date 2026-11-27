import { useState } from 'react'
import Ikon from './Ikon'

const VAKITLER = [
  { k: 'imsak', ad: 'İmsak', ikon: 'sabah' },
  { k: 'gunes', ad: 'Güneş', ikon: 'gunes' },
  { k: 'ogle', ad: 'Öğle', ikon: 'ogle' },
  { k: 'ikindi', ad: 'İkindi', ikon: 'ikindi' },
  { k: 'aksam', ad: 'Akşam', ikon: 'aksam' },
  { k: 'yatsi', ad: 'Yatsı', ikon: 'yatsi' },
]

const dakika = (t) => {
  const [h, m] = t.split(':')
  return Number(h) * 60 + Number(m)
}

function kalanYaz(dk) {
  const s = Math.floor(dk / 60)
  const m = dk % 60
  return s > 0 ? `${s} sa ${m} dk` : `${m} dk`
}

export default function EzanSaatleri({ simdi, bugun, hata, cuma, onTekrar }) {
  const [acik, setAcik] = useState(false)
  const tarih = simdi.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })

  let sonraki = -1
  let kalan = ''
  if (bugun) {
    const su = simdi.getHours() * 60 + simdi.getMinutes()
    sonraki = VAKITLER.findIndex((v) => dakika(bugun[v.k]) > su)
    kalan = sonraki === -1 ? `Yarın İmsak · ${kalanYaz(1440 - su + dakika(bugun.imsak))}` : kalanYaz(dakika(bugun[VAKITLER[sonraki].k]) - su)
  }
  const sv = sonraki === -1 ? VAKITLER[0] : VAKITLER[sonraki]
  const sonrakiAd = sv.k === 'ogle' && cuma ? 'Cuma' : sv.ad
  const sonrakiSaat = bugun ? bugun[sv.k] : '--:--'

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setAcik((a) => !a)}
        aria-expanded={acik}
        aria-label="Ankara ezan vakitleri"
        className={`relative rounded-2xl border px-3 py-2 text-right transition active:scale-[0.97] ${
          cuma ? 'border-amber-400/50 bg-amber-400/10' : 'border-slate-700/60 bg-slate-800/70'
        }`}
      >
        {cuma && (
          <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow">
            <Ikon ad="cuma" className="h-4 w-4" />
          </span>
        )}
        <span className="flex items-center justify-end gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <Ikon ad="konum" className="h-3 w-3" />
          Ankara
        </span>
        <span className={`block text-lg font-extrabold leading-tight tabular-nums ${cuma ? 'text-amber-300' : 'text-emerald-300'} ${bugun ? '' : 'animate-pulse'}`}>
          <span className="mr-1.5 text-xs font-semibold">{sonrakiAd}</span>
          {sonrakiSaat}
        </span>
        <span className="block text-[11px] text-slate-400">{hata ? 'Vakit alınamadı' : bugun ? kalan : 'Yükleniyor'}</span>
      </button>

      {acik && (
        <>
          <button type="button" aria-label="Kapat" onClick={() => setAcik(false)} className="fixed inset-0 z-10 cursor-default" />
          <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-2xl border border-slate-700/60 bg-slate-800 p-3 shadow-2xl">
            <p className="px-1 pb-2 text-xs capitalize text-slate-400">Ankara · {tarih}</p>

            {cuma && (
              <p className="mb-2 flex items-center gap-2 rounded-xl bg-amber-400/15 px-3 py-2 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30">
                <Ikon ad="cuma" className="h-4 w-4 shrink-0" />
                Hayırlı Cumalar! Cuma namazı öğle vaktinde.
              </p>
            )}

            {hata ? (
              <div className="flex items-center justify-between gap-2 px-1 py-2 text-xs text-slate-400">
                <span>İnternet bağlantısını kontrol et.</span>
                <button type="button" onClick={onTekrar} className="shrink-0 rounded-full bg-slate-700 px-3 py-1 font-semibold text-slate-100 hover:bg-slate-600">
                  Tekrar dene
                </button>
              </div>
            ) : (
              <ul className="space-y-1">
                {VAKITLER.map((v, i) => {
                  const cumaSatir = cuma && v.k === 'ogle'
                  const aktif = bugun && i === sonraki
                  const gecti = bugun && (sonraki === -1 || i < sonraki)
                  const renk = cumaSatir
                    ? 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40'
                    : aktif
                      ? 'bg-emerald-400/15 text-emerald-300'
                      : gecti
                        ? 'text-slate-600'
                        : 'text-slate-200'
                  return (
                    <li key={v.k} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${renk}`}>
                      <span className="flex items-center gap-2 font-medium">
                        <Ikon ad={cumaSatir ? 'cuma' : v.ikon} className="h-4 w-4" />
                        {cumaSatir ? 'Cuma' : v.ad}
                      </span>
                      <span className="font-bold tabular-nums">{bugun ? bugun[v.k] : '--:--'}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
