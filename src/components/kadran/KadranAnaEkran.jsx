import Ikon from '../Ikon'
import EzanSaatleri from '../EzanSaatleri'
import GorunumSecici from '../GorunumSecici'
import Aurora from './Aurora'
import { temaAl } from '../../tema'

const SAAT = { sabah: 'imsak', ogle: 'ogle', ikindi: 'ikindi', aksam: 'aksam', yatsi: 'yatsi', vitir: 'yatsi' }
const VARSAYILAN = { imsak: '06:00', gunes: '07:30', ogle: '12:00', ikindi: '15:00', aksam: '17:30', yatsi: '19:00' }

const dk = (t) => {
  const [h, m] = (t ?? '00:00').split(':')
  return Number(h) * 60 + Number(m)
}
const kalanYaz = (d) => (d >= 60 ? `${Math.floor(d / 60)} sa ${d % 60} dk` : `${d} dk`)

function say(liste, detay, bilinenMi) {
  const idler = liste.okuma_sirasi.filter((id) => detay[id])
  const bilinen = idler.filter(bilinenMi).length
  return {
    bilinen,
    toplam: idler.length,
    yuzde: idler.length ? Math.round((bilinen / idler.length) * 100) : 0,
    ilkEksik: idler.find((id) => !bilinenMi(id)),
  }
}

// Kadran geometrisi: sabah sol altta, öğle tepede, yatsı sağ altta.
// Alttaki boşluk gece. Şimdiki an, iki vakit arasında saate göre ilerler.
const BOY = 320
const M = BOY / 2
const R = 112
const PAY = 48
const TOPLAM = BOY + PAY * 2
// Öğle tepede; sabahla öğle arası uzun olduğu için o aralık geniş
const ACI = [-112, 0, 44, 86, 126]
const yuzdeK = (v) => `${((v + PAY) / TOPLAM) * 100}%`

function nokta(derece, r = R) {
  const a = ((derece - 90) * Math.PI) / 180
  return [M + r * Math.cos(a), M + r * Math.sin(a)]
}
function yay(d1, d2, r = R) {
  if (d2 - d1 <= 0.1) return ''
  const [x1, y1] = nokta(d1, r)
  const [x2, y2] = nokta(d2, r)
  return `M ${x1} ${y1} A ${r} ${r} 0 ${d2 - d1 > 180 ? 1 : 0} 1 ${x2} ${y2}`
}

// Şimdiki dakikanın kadrandaki açısı
function anAcisi(su, t) {
  if (su >= t[0] && su < t[4]) {
    for (let i = 0; i < 4; i++) {
      if (su < t[i + 1]) return ACI[i] + ((su - t[i]) / (t[i + 1] - t[i])) * (ACI[i + 1] - ACI[i])
    }
  }
  const gece = 1440 - t[4] + t[0]
  const gecen = su >= t[4] ? su - t[4] : su + 1440 - t[4]
  return ACI[4] + (gecen / gece) * (360 + ACI[0] - ACI[4])
}

function Kadran({ bes, saat, su, siradaki, kalan, cumaVakti, detay, bilinenMi, onAc }) {
  const t = bes.map((n) => dk(saat[SAAT[n.id]]))
  const an = anAcisi(su, t)
  const gunduzde = an <= ACI[4]
  const gunesVar = dk(saat.gunes) <= su && su < dk(saat.aksam)
  const sIndex = bes.findIndex((n) => n.id === siradaki.id)
  const hedefAci = !gunduzde && sIndex === 0 ? 360 + ACI[0] : ACI[sIndex]
  const [px, py] = nokta(an)
  const ss = say(siradaki, detay, bilinenMi)
  const cumaSirada = cumaVakti && siradaki.id === 'ogle'
  const [ax, ay] = nokta((ACI[4] + 360 + ACI[0]) / 2, R)

  return (
    <div className="k-yukari relative mx-auto aspect-square w-full max-w-[22rem]" style={{ animationDelay: '0.1s' }}>
      <svg viewBox={`${-PAY} ${-PAY} ${TOPLAM} ${TOPLAM}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="k-yay" x1="0" y1="1" x2="1" y2="1">
            <stop offset="0" stopColor="#5eead4" />
            <stop offset="0.5" stopColor="#818cf8" />
            <stop offset="1" stopColor="#e879f9" />
          </linearGradient>
          <radialGradient id="k-merkez">
            <stop offset="0" stopColor="#1e293b" stopOpacity="0.85" />
            <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={M} cy={M} r={R - 14} fill="url(#k-merkez)" />

        {/* İnce ölçek çizgileri (gündüz yayı boyunca) */}
        {Array.from({ length: 25 }, (_, i) => {
          const d = ACI[0] + (i * (ACI[4] - ACI[0])) / 24
          const [x1, y1] = nokta(d, R + 15)
          const [x2, y2] = nokta(d, R + (i % 6 === 0 ? 22 : 19))
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(255 255 255 / 0.14)" strokeWidth={i % 6 === 0 ? 1.6 : 1} strokeLinecap="round" />
        })}

        {/* Gündüz yayı ve gece kısmı */}
        <path d={yay(ACI[0], ACI[4])} fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="10" strokeLinecap="round" />
        <path d={yay(ACI[4] + 4, 360 + ACI[0] - 4)} fill="none" stroke="rgb(129 140 248 / 0.35)" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
        {/* Bugün geçen kısım */}
        {gunduzde && <path d={yay(ACI[0], an)} fill="none" stroke="url(#k-yay)" strokeOpacity="0.4" strokeWidth="10" strokeLinecap="round" />}
        {!gunduzde && <path d={yay(ACI[0], ACI[4])} fill="none" stroke="url(#k-yay)" strokeOpacity="0.25" strokeWidth="10" strokeLinecap="round" />}
        {/* Şimdiden sıradaki vakte */}
        {gunduzde ? (
          <path d={yay(an, hedefAci)} fill="none" stroke="url(#k-yay)" strokeWidth="10" strokeLinecap="round" />
        ) : (
          <path d={yay(an, 360 + ACI[0])} fill="none" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* Şimdiki an */}
        <circle cx={px} cy={py} r="13" fill={gunesVar ? '#fbbf24' : '#c7d2fe'} className="k-soluk" opacity="0.35" />
        <circle cx={px} cy={py} r="7.5" fill={gunesVar ? '#fbbf24' : '#e0e7ff'} stroke="#0f172a" strokeWidth="2.5" />
        {!gunesVar && <circle cx={px + 3} cy={py - 2.5} r="4.5" fill="#0f172a" />}
      </svg>

      {/* Gece işareti */}
      <span
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-indigo-300/70"
        style={{ left: yuzdeK(ax), top: yuzdeK(ay + 26) }}
      >
        <Ikon ad="yatsi" className="h-4 w-4" />
        <span className="text-[10px] font-semibold uppercase tracking-widest">gece</span>
      </span>

      {/* Vakit düğmeleri */}
      {bes.map((n, i) => {
        const [x, y] = nokta(ACI[i])
        const [lx, ly] = nokta(ACI[i], R + (n.id === siradaki.id ? 62 : 52))
        const s = say(n, detay, bilinenMi)
        const aktif = n.id === siradaki.id
        const cuma = cumaVakti && n.id === 'ogle'
        const tamam = s.yuzde >= 100
        const boy = aktif ? 50 : 42
        const r = boy / 2 - 2.5
        const c = 2 * Math.PI * r
        return (
          <div key={n.id}>
            <button
              type="button"
              onClick={() => onAc(n.id)}
              aria-label={`${n.ad}, ${saat[SAAT[n.id]]}, ${s.bilinen}/${s.toplam} ezber`}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-105 active:scale-95 ${
                cuma
                  ? 'bg-amber-400 text-slate-900'
                  : tamam
                    ? 'bg-emerald-400 text-slate-900'
                    : aktif
                      ? 'bg-slate-900 text-white shadow-[0_0_24px_rgb(94_234_212/0.45)]'
                      : 'bg-slate-900 text-slate-300'
              }`}
              style={{ left: yuzdeK(x), top: yuzdeK(y), width: boy, height: boy }}
            >
              <svg width={boy} height={boy} className="absolute inset-0 -rotate-90" aria-hidden="true">
                <circle cx={boy / 2} cy={boy / 2} r={r} fill="none" strokeWidth="3" stroke={aktif ? 'rgb(255 255 255 / 0.9)' : 'rgb(255 255 255 / 0.15)'} />
                {!tamam && !cuma && s.yuzde > 0 && (
                  <circle
                    cx={boy / 2}
                    cy={boy / 2}
                    r={r}
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="#5eead4"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - s.yuzde / 100)}
                    className="transition-all duration-700"
                  />
                )}
              </svg>
              <Ikon ad={cuma ? 'cuma' : tamam ? 'hedef' : temaAl(n.id).ikon} className={aktif ? 'relative h-6 w-6' : 'relative h-5 w-5'} />
            </button>
            <span
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center leading-tight"
              style={{ left: yuzdeK(lx), top: yuzdeK(ly) }}
            >
              <span className={`block text-[13px] font-bold ${aktif ? 'text-white' : 'text-slate-300'}`}>{cuma ? 'Cuma' : n.ad.replace(' Namazı', '')}</span>
              <span className={`block text-[11px] tabular-nums ${aktif ? 'text-teal-200' : 'text-slate-500'}`}>{saat[SAAT[n.id]]}</span>
            </span>
          </div>
        )
      })}

      {/* Orta bilgi */}
      <button
        type="button"
        onClick={() => onAc(siradaki.id)}
        className="absolute left-1/2 top-1/2 flex h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300">Sıradaki</span>
        <span className="mt-0.5 flex items-center gap-1 text-[1.6rem] font-extrabold leading-tight">
          {cumaSirada && <Ikon ad="cuma" className="h-5 w-5 text-amber-300" />}
          {cumaSirada ? 'Cuma' : siradaki.ad.replace(' Namazı', '')}
        </span>
        {kalan && <span className="text-sm font-semibold tabular-nums text-slate-300">{kalan} sonra</span>}
        <span className="mt-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-slate-200">
          {ss.bilinen}/{ss.toplam} ezber
        </span>
      </button>
    </div>
  )
}

function Ozet({ ikon, deger, etiket, renk, gecikme }) {
  return (
    <div className="k-yukari rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur-md" style={{ animationDelay: `${gecikme}s` }}>
      <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-xl ${renk}`}>
        <Ikon ad={ikon} className="h-4 w-4" />
      </span>
      <p className="mt-2 text-xl font-extrabold tabular-nums leading-none">{deger}</p>
      <p className="mt-1 text-[11px] text-slate-400">{etiket}</p>
    </div>
  )
}

function Satir({ id, ad, ikon, saat, s, aktif, gecti, gecikme, onAc, rozet }) {
  const kalanDua = s.toplam - s.bilinen
  return (
    <li className="k-yukari" style={{ animationDelay: `${gecikme}s` }}>
      <button
        type="button"
        onClick={() => onAc(id)}
        className={`relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left backdrop-blur-md transition active:scale-[0.98] ${
          aktif ? 'border-teal-300/50 bg-white/[0.08]' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
        }`}
      >
        <span
          className="k-dolum absolute inset-y-0 left-0 bg-linear-to-r from-teal-400/20 via-indigo-400/15 to-fuchsia-400/10"
          style={{ width: `${s.yuzde}%`, animationDelay: `${gecikme + 0.2}s` }}
          aria-hidden="true"
        />
        {aktif && <span className="k-isilti absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />}
        <span
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            aktif ? 'bg-teal-300 text-slate-900' : s.yuzde >= 100 ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/10 text-slate-200'
          }`}
        >
          <Ikon ad={ikon} className="h-5 w-5" />
        </span>
        <span className="relative min-w-0 flex-1">
          <span className={`flex items-center gap-2 font-bold ${gecti ? 'text-slate-400' : ''}`}>
            {ad}
            {rozet}
          </span>
          <span className="block text-xs text-slate-400">
            {saat ? `${saat} · ` : ''}
            {s.yuzde >= 100 ? <span className="text-emerald-300">hepsi ezber ✓</span> : `${kalanDua} dua kaldı`}
          </span>
        </span>
        <span className="relative flex flex-col items-end">
          <span className="text-sm font-bold tabular-nums text-slate-100">%{s.yuzde}</span>
          <span className="mt-1 flex gap-0.5">
            {Array.from({ length: Math.min(s.toplam, 14) }, (_, i) => (
              <span key={i} className={`h-1 w-1 rounded-full ${i < s.bilinen ? 'bg-teal-300' : 'bg-white/15'}`} />
            ))}
          </span>
        </span>
      </button>
    </li>
  )
}

export default function KadranAnaEkran({ namazlar, gruplar = [], detay, bilinenMi, onAc, onDuaAc, seri, vakitler, tasarim, onTasarimSec }) {
  const tumIdler = [...new Set([...namazlar, ...gruplar].flatMap((n) => n.okuma_sirasi))].filter((id) => detay[id])
  const toplam = tumIdler.filter(bilinenMi).length
  const genel = tumIdler.length ? Math.round((toplam / tumIdler.length) * 100) : 0

  const bugun = vakitler?.bugun
  const simdi = vakitler?.simdi ?? new Date()
  const su = simdi.getHours() * 60 + simdi.getMinutes()
  const saat = bugun ?? VARSAYILAN
  const bes = namazlar.filter((n) => n.id !== 'vitir')
  const sonraki = bes.findIndex((n) => dk(saat[SAAT[n.id]]) > su)
  const siradaki = sonraki === -1 ? bes[0] : bes[sonraki]
  const hedef = dk(saat[SAAT[siradaki.id]])
  const kalan = bugun ? kalanYaz(sonraki === -1 ? 1440 - su + hedef : hedef - su) : ''
  const cumaVakti = Boolean(vakitler?.cuma)
  const tamamVakit = namazlar.filter((n) => say(n, detay, bilinenMi).yuzde === 100).length

  // Şimdi ne çalışmalı: sıradaki namazdaki ilk ezberlenmemiş dua
  const ss = say(siradaki, detay, bilinenMi)
  const oneriListe = ss.ilkEksik ? siradaki : namazlar.find((n) => say(n, detay, bilinenMi).ilkEksik) ?? gruplar.find((g) => say(g, detay, bilinenMi).ilkEksik)
  const oneriId = oneriListe ? say(oneriListe, detay, bilinenMi).ilkEksik : null

  const saatSelami = su < 300 ? 'Hayırlı geceler' : su < 660 ? 'Hayırlı sabahlar' : su < 1020 ? 'Hayırlı günler' : 'Hayırlı akşamlar'

  return (
    <div className="relative">
      <Aurora />
      <div className="relative space-y-6">
        <header className="k-yukari flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-400">{saatSelami}</p>
            <h1 className="bg-linear-to-r from-teal-200 via-indigo-200 to-fuchsia-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              Nura
            </h1>
          </div>
          {vakitler && <EzanSaatleri {...vakitler} />}
        </header>

        <Kadran
          bes={bes}
          saat={saat}
          su={su}
          siradaki={siradaki}
          kalan={kalan}
          cumaVakti={cumaVakti}
          detay={detay}
          bilinenMi={bilinenMi}
          onAc={onAc}
        />

        {/* Özet */}
        <div className="grid grid-cols-3 gap-2">
          <Ozet ikon="hedef" deger={`%${genel}`} etiket={`${toplam}/${tumIdler.length} ezber`} renk="bg-teal-300/15 text-teal-200" gecikme={0.2} />
          <Ozet ikon="sonrasi" deger={`${tamamVakit}/${namazlar.length}`} etiket="vakit tamam" renk="bg-indigo-400/15 text-indigo-200" gecikme={0.25} />
          <Ozet ikon="alev" deger={seri?.seri ?? 0} etiket="gün seri" renk={seri?.bugun ? 'bg-orange-400/20 text-orange-300' : 'bg-white/10 text-slate-400'} gecikme={0.3} />
        </div>

        {/* Şimdi çalış */}
        {oneriId && onDuaAc && (
          <button
            type="button"
            onClick={() => onDuaAc(oneriId, oneriListe.id)}
            className="k-yukari group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-linear-to-r from-teal-400/25 via-indigo-500/20 to-fuchsia-500/20 p-[1px] text-left"
            style={{ animationDelay: '0.35s' }}
          >
            <span className="flex w-full items-center gap-3 rounded-[15px] bg-slate-900/80 px-4 py-3 backdrop-blur-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-teal-300 to-indigo-400 text-slate-900">
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M6 4.5v11l9-5.5z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-teal-300">Şimdi çalış</span>
                <span className="block truncate font-bold">{detay[oneriId].ad}</span>
                <span className="block text-xs text-slate-400">{oneriListe.ad} için sıradaki ezber</span>
              </span>
              <span className="text-slate-400 transition group-hover:translate-x-0.5">→</span>
            </span>
          </button>
        )}

        <section>
          <h2 className="k-yukari mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-slate-500" style={{ animationDelay: '0.4s' }}>
            Vakitler
          </h2>
          <ul className="space-y-2">
            {namazlar.map((n, i) => {
              const cuma = cumaVakti && n.id === 'ogle'
              const t = saat[SAAT[n.id]]
              return (
                <Satir
                  key={n.id}
                  id={n.id}
                  ad={cuma ? 'Cuma' : n.ad.replace(' Namazı', '')}
                  ikon={cuma ? 'cuma' : temaAl(n.id).ikon}
                  saat={bugun ? t : null}
                  s={say(n, detay, bilinenMi)}
                  aktif={n.id === siradaki.id}
                  gecti={bugun && n.id !== 'vitir' && dk(t) <= su}
                  gecikme={0.45 + i * 0.05}
                  onAc={onAc}
                  rozet={
                    cuma ? (
                      <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">CUMA</span>
                    ) : n.id === siradaki.id ? (
                      <span className="rounded-full bg-teal-300/20 px-2 py-0.5 text-[10px] font-bold text-teal-200">SIRADA</span>
                    ) : null
                  }
                />
              )
            })}
          </ul>
        </section>

        {gruplar.length > 0 && (
          <section>
            <h2 className="k-yukari mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-slate-500" style={{ animationDelay: '0.75s' }}>
              Namaz dışında
            </h2>
            <ul className="space-y-2">
              {gruplar.map((g, i) => (
                <Satir key={g.id} id={g.id} ad={g.ad} ikon={temaAl(g.id).ikon} s={say(g, detay, bilinenMi)} gecikme={0.8 + i * 0.05} onAc={onAc} />
              ))}
            </ul>
          </section>
        )}

        <div className="k-yukari pt-2" style={{ animationDelay: '0.9s' }}>
          <GorunumSecici tasarim={tasarim} onSec={onTasarimSec} />
        </div>
      </div>
    </div>
  )
}
