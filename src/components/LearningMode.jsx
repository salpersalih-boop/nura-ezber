import { useState } from 'react'
import { temaAl } from '../tema'

function gizliSec(okunus, oran = 0.5) {
  const kelimeler = okunus.split(/\s+/).filter(Boolean)
  let adaylar = kelimeler
    .map((k, i) => [k, i])
    .filter(([k]) => k.replace(/[^\p{L}]/gu, '').length >= 3)
    .map(([, i]) => i)
  if (adaylar.length === 0) adaylar = kelimeler.map((_, i) => i)
  const adet = Math.max(1, Math.round(adaylar.length * oran))
  for (let i = adaylar.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[adaylar[i], adaylar[j]] = [adaylar[j], adaylar[i]]
  }
  return new Set(adaylar.slice(0, adet))
}

const testOlustur = (ayetler) => Object.fromEntries(ayetler.map((a) => [a.no, gizliSec(a.okunus)]))

function Anahtar({ acik, onClick, children, t }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={acik}
      className={`rounded-full px-3 py-1 text-xs transition ${
        acik ? t.pill + ' font-semibold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

export default function LearningMode({ dua, bilinen, onBilinen, onGeri, temaId }) {
  const t = temaAl(temaId)
  const [gizli, setGizli] = useState(null) // null = çalışma modu
  const [acilanlar, setAcilanlar] = useState(new Set())
  const [arapcaGoster, setArapcaGoster] = useState(true)
  const [mealGoster, setMealGoster] = useState(false)

  const testte = gizli !== null
  const toplamGizli = testte ? Object.values(gizli).reduce((t, s) => t + s.size, 0) : 0

  const testiBaslat = () => {
    setGizli(testOlustur(dua.ayetler))
    setAcilanlar(new Set())
    setArapcaGoster(false)
  }
  const calismayaDon = () => {
    setGizli(null)
    setAcilanlar(new Set())
    setArapcaGoster(true)
  }
  const ac = (anahtar) => setAcilanlar((s) => new Set(s).add(anahtar))
  const hepsiniAc = () =>
    setAcilanlar(new Set(dua.ayetler.flatMap((a) => [...(gizli?.[a.no] ?? [])].map((i) => `${a.no}-${i}`))))

  return (
    <div className="pb-28">
      <button type="button" onClick={onGeri} className="-ml-1 flex items-center gap-1 py-1 text-sm text-slate-400 transition hover:text-slate-100">
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5l-5 5 5 5" />
        </svg>
        Geri
      </button>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">{dua.ad}</h1>
      {dua.aciklama && <p className="mt-1 text-sm text-slate-400">{dua.aciklama}</p>}

      <div className="mt-6 grid grid-cols-2 rounded-2xl bg-slate-800 p-1">
        <button
          type="button"
          onClick={calismayaDon}
          className={`rounded-xl py-2 text-sm transition ${!testte ? t.aktif : 'text-slate-400'}`}
        >
          Çalış
        </button>
        <button
          type="button"
          onClick={testiBaslat}
          className={`rounded-xl py-2 text-sm transition ${testte ? t.aktif : 'text-slate-400'}`}
        >
          Kendimi Test Et
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Anahtar t={t} acik={arapcaGoster} onClick={() => setArapcaGoster((v) => !v)}>Arapça</Anahtar>
        <Anahtar t={t} acik={mealGoster} onClick={() => setMealGoster((v) => !v)}>Meal</Anahtar>
        {testte && (
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
            <span className="tabular-nums">{acilanlar.size}/{toplamGizli}</span>
            <button type="button" onClick={testiBaslat} className="text-slate-200 hover:text-white">Karıştır</button>
            <button type="button" onClick={hepsiniAc} className="text-slate-200 hover:text-white">Cevaplar</button>
          </div>
        )}
      </div>

      {testte && <p className="mt-3 text-sm text-slate-500">Eksik kelimeleri aklından tamamla, kontrol için kutuya dokun.</p>}

      <ol className="mt-6 space-y-3">
        {dua.ayetler.map((ayet) => {
          const kelimeler = ayet.okunus.split(/\s+/).filter(Boolean)
          const gizlenen = gizli?.[ayet.no]
          return (
            <li key={ayet.no} className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-4">
              <div className="space-y-2.5">
                {arapcaGoster && (
                  <p dir="rtl" lang="ar" className="font-arabic text-2xl leading-loose text-slate-50 sm:text-3xl">
                    {ayet.arapca}
                  </p>
                )}
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 leading-relaxed text-slate-300">
                  {kelimeler.map((kelime, i) => {
                    const anahtar = `${ayet.no}-${i}`
                    if (!gizlenen?.has(i)) return <span key={i}>{kelime}</span>
                    if (acilanlar.has(anahtar))
                      return (
                        <span key={i} className={`rounded-md px-1.5 ${t.pill}`}>
                          {kelime}
                        </span>
                      )
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => ac(anahtar)}
                        aria-label="Kelimeyi göster"
                        className="h-6 rounded-md bg-slate-700 transition hover:bg-slate-600"
                        style={{ width: `${Math.max(kelime.length, 3) * 0.6 + 0.8}rem` }}
                      />
                    )
                  })}
                </p>
                {mealGoster && <p className="text-sm text-slate-500">{ayet.meal}</p>}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="alt-cubuk fixed inset-x-0 bottom-0 z-10 px-5 pb-5 pt-10">
        <div className="mx-auto max-w-xl">
          {bilinen ? (
            <button
              type="button"
              onClick={() => onBilinen(false)}
              className={`w-full rounded-2xl bg-slate-800 py-3.5 font-semibold transition hover:bg-slate-700 ${t.metin}`}
            >
              ✓ Ezberlendi · geri al
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onBilinen(true)
                onGeri()
              }}
              className={`w-full rounded-2xl py-3.5 font-bold transition active:scale-[0.99] ${t.dugme}`}
            >
              Ezberledim
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
