import GorunumSecici from './GorunumSecici'
import Ikon from './Ikon'
import EzanSaatleri from './EzanSaatleri'
import { temaAl } from '../tema'

function Halka({ yuzde, boyut = 84 }) {
  const k = 8
  const r = (boyut - k) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: boyut, height: boyut }}>
      <svg width={boyut} height={boyut} className="-rotate-90" aria-hidden="true">
        <circle cx={boyut / 2} cy={boyut / 2} r={r} fill="none" strokeWidth={k} className="stroke-slate-700/60" />
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={r}
          fill="none"
          strokeWidth={k}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - yuzde / 100)}
          className="stroke-emerald-400 transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums">%{yuzde}</span>
    </div>
  )
}

function say(liste, detay, bilinenMi) {
  const idler = liste.okuma_sirasi.filter((id) => detay[id])
  const bilinen = idler.filter(bilinenMi).length
  return { bilinen, toplam: idler.length, yuzde: idler.length ? Math.round((bilinen / idler.length) * 100) : 0 }
}

function VakitKarti({ vakit, sayac, onAc, cuma }) {
  const t = temaAl(vakit.id)
  return (
    <button
      type="button"
      onClick={() => onAc(vakit.id)}
      className={`relative overflow-hidden rounded-3xl border ${t.cerceve} bg-linear-to-br ${t.kart} p-4 text-left transition active:scale-[0.97]`}
    >
      <span className={`absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl ${t.parlama}`} aria-hidden="true" />
      <span className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${t.kutu}`}>
        <Ikon ad={t.ikon} />
      </span>
      {cuma && (
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-1 text-[11px] font-bold text-amber-300 ring-1 ring-amber-400/40">
          <Ikon ad="cuma" className="h-3.5 w-3.5" />
          Cuma
        </span>
      )}
      <span className="relative mt-5 block text-lg font-bold leading-tight">{vakit.ad.replace(' Namazı', '')}</span>
      <span className="relative mt-0.5 block text-xs text-slate-400">
        {sayac.bilinen} / {sayac.toplam} ezberlendi
      </span>
      <span className="relative mt-3 block h-1.5 overflow-hidden rounded-full bg-slate-900/50">
        <span className={`block h-full rounded-full transition-all duration-500 ${t.dolgu}`} style={{ width: `${sayac.yuzde}%` }} />
      </span>
    </button>
  )
}

function GrupSatiri({ grup, sayac, onAc }) {
  const t = temaAl(grup.id)
  return (
    <button
      type="button"
      onClick={() => onAc(grup.id)}
      className={`flex w-full items-center gap-4 rounded-3xl border ${t.cerceve} bg-slate-800/60 p-4 text-left transition active:scale-[0.98]`}
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${t.kutu}`}>
        <Ikon ad={t.ikon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{grup.ad}</span>
        <span className="block text-xs text-slate-400">
          {sayac.bilinen} / {sayac.toplam} ezberlendi
        </span>
      </span>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold tabular-nums ${t.pill}`}>%{sayac.yuzde}</span>
    </button>
  )
}

export default function DailyChecklist({ namazlar, gruplar = [], detay, bilinenMi, onAc, vakitler, tasarim, onTasarimSec }) {
  const tumIdler = [...new Set([...namazlar, ...gruplar].flatMap((n) => n.okuma_sirasi))].filter((id) => detay[id])
  const toplam = tumIdler.filter(bilinenMi).length
  const genel = tumIdler.length ? Math.round((toplam / tumIdler.length) * 100) : 0

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-emerald-300">Esselâmü aleyküm</p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Nura</h1>
        </div>
        {vakitler && <EzanSaatleri {...vakitler} />}
      </header>

      <section className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-linear-to-br from-emerald-500/25 via-teal-500/10 to-slate-800/30 p-5">
        <span className="absolute -left-8 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300">Genel ezber ilerlemen</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums">
              {toplam}
              <span className="text-lg font-semibold text-slate-400"> / {tumIdler.length}</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">sure ve dua ezberlendi</p>
          </div>
          <Halka yuzde={genel} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Vakitler</h2>
        <div className="grid grid-cols-2 gap-3">
          {namazlar.map((v) => (
            <VakitKarti key={v.id} vakit={v} sayac={say(v, detay, bilinenMi)} onAc={onAc} cuma={v.id === 'ogle' && vakitler?.cuma} />
          ))}
        </div>
      </section>

      {gruplar.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Namaz dışında</h2>
          <div className="space-y-3">
            {gruplar.map((g) => (
              <GrupSatiri key={g.id} grup={g} sayac={say(g, detay, bilinenMi)} onAc={onAc} />
            ))}
          </div>
        </section>
      )}
      <GorunumSecici tasarim={tasarim} onSec={onTasarimSec} />
    </div>
  )
}
