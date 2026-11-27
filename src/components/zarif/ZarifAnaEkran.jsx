import GorunumSecici from '../GorunumSecici'
import Ikon from '../Ikon'
import EzanSaatleri from '../EzanSaatleri'
import Sahne from './Sahne'

const SAAT = { sabah: 'imsak', ogle: 'ogle', ikindi: 'ikindi', aksam: 'aksam', yatsi: 'yatsi', vitir: 'yatsi' }

const dk = (t) => {
  const [h, m] = (t ?? '00:00').split(':')
  return Number(h) * 60 + Number(m)
}
const kalanYaz = (d) => (d >= 60 ? `${Math.floor(d / 60)} sa ${d % 60} dk` : `${d} dk`)

function say(liste, detay, bilinenMi) {
  const idler = liste.okuma_sirasi.filter((id) => detay[id])
  const bilinen = idler.filter(bilinenMi).length
  return { bilinen, toplam: idler.length, yuzde: idler.length ? Math.round((bilinen / idler.length) * 100) : 0 }
}

function Halka({ yuzde, boyut = 40, kalinlik = 4, children }) {
  const r = (boyut - kalinlik) / 2
  const c = 2 * Math.PI * r
  return (
    <span className="relative inline-flex shrink-0" style={{ width: boyut, height: boyut }}>
      <svg width={boyut} height={boyut} className="-rotate-90" aria-hidden="true">
        <circle cx={boyut / 2} cy={boyut / 2} r={r} fill="none" strokeWidth={kalinlik} stroke="rgb(255 255 255 / 0.18)" />
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={r}
          fill="none"
          strokeWidth={kalinlik}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - yuzde / 100)}
          stroke={yuzde >= 100 ? '#34d399' : '#ffffff'}
          className="transition-all duration-700"
        />
      </svg>
      {children && <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">{children}</span>}
    </span>
  )
}

function VakitKarti({ n, s, saat, gecti, sirada, cuma, onAc }) {
  return (
    <button
      type="button"
      onClick={() => onAc(n.id)}
      className={`group block overflow-hidden rounded-3xl text-left shadow-lg shadow-black/30 ring-1 transition active:scale-[0.97] ${
        sirada ? 'ring-2 ring-white/70' : 'ring-white/10'
      }`}
    >
      <Sahne id={n.id} className="h-36">
        <div className="flex h-full flex-col justify-between p-3.5">
          <div className="flex items-start justify-between">
            {cuma ? (
              <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-slate-900">
                <Ikon ad="cuma" className="h-3 w-3" />
                CUMA
              </span>
            ) : sirada ? (
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold text-slate-900">SIRADA</span>
            ) : (
              <span />
            )}
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-lg font-extrabold leading-tight text-white drop-shadow">{n.ad.replace(' Namazı', '')}</p>
              <p className={`text-xs font-medium tabular-nums ${gecti ? 'text-white/50' : 'text-white/80'}`}>
                {saat ?? ''}
                {saat ? ' · ' : ''}
                {s.bilinen}/{s.toplam}
              </p>
            </div>
            <Halka yuzde={s.yuzde} boyut={32} kalinlik={3.5} />
          </div>
        </div>
      </Sahne>
    </button>
  )
}

export default function ZarifAnaEkran({ namazlar, gruplar = [], detay, bilinenMi, onAc, vakitler, tasarim, onTasarimSec }) {
  const tumIdler = [...new Set([...namazlar, ...gruplar].flatMap((n) => n.okuma_sirasi))].filter((id) => detay[id])
  const toplam = tumIdler.filter(bilinenMi).length
  const genel = tumIdler.length ? Math.round((toplam / tumIdler.length) * 100) : 0

  const bugun = vakitler?.bugun
  const su = vakitler ? vakitler.simdi.getHours() * 60 + vakitler.simdi.getMinutes() : 0
  const bes = namazlar.filter((n) => n.id !== 'vitir')
  const sonrakiIndex = bugun ? bes.findIndex((n) => dk(bugun[SAAT[n.id]]) > su) : -1
  const siradaki = sonrakiIndex === -1 ? bes[0] : bes[sonrakiIndex]
  const ss = say(siradaki, detay, bilinenMi)
  const cumaVakti = vakitler?.cuma && siradaki.id === 'ogle'
  let kalan = ''
  if (bugun) {
    const hedef = dk(bugun[SAAT[siradaki.id]])
    kalan = kalanYaz(sonrakiIndex === -1 ? 1440 - su + hedef : hedef - su)
  }

  return (
    <div className="space-y-7">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-400">Esselâmü aleyküm</p>
          <h1 className="mt-0.5 text-4xl font-extrabold tracking-tight">Nura</h1>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-800">
              <span className="block h-full rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${genel}%` }} />
            </span>
            <span className="text-xs tabular-nums text-slate-400">
              {toplam}/{tumIdler.length} ezber
            </span>
          </div>
        </div>
        {vakitler && <EzanSaatleri {...vakitler} />}
      </header>

      {/* Sıradaki namaz: o vaktin gökyüzü */}
      <button
        type="button"
        onClick={() => onAc(siradaki.id)}
        className="block w-full overflow-hidden rounded-[2rem] text-left shadow-2xl shadow-black/40 ring-1 ring-white/10 transition active:scale-[0.98]"
      >
        <Sahne id={siradaki.id} className="h-56">
          <div className="flex h-full flex-col justify-between p-5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {cumaVakti && <Ikon ad="cuma" className="h-3.5 w-3.5 text-amber-300" />}
              {bugun ? `Sıradaki · ${kalan} sonra` : 'Sıradaki namaz'}
            </span>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-extrabold leading-none text-white drop-shadow">
                  {cumaVakti ? 'Cuma' : siradaki.ad.replace(' Namazı', '')}
                </p>
                {bugun && <p className="mt-1.5 text-xl font-bold tabular-nums text-white/90">{bugun[SAAT[siradaki.id]]}</p>}
                <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900">
                  {ss.yuzde >= 100 ? 'Tekrar et' : 'Ezbere devam et'}
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8 5l5 5-5 5" />
                  </svg>
                </p>
              </div>
              <Halka yuzde={ss.yuzde} boyut={68} kalinlik={6}>
                <span className="text-sm">
                  {ss.bilinen}/{ss.toplam}
                </span>
              </Halka>
            </div>
          </div>
        </Sahne>
      </button>

      <section>
        <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Vakitler</h2>
        <div className="grid grid-cols-2 gap-3">
          {namazlar.map((n) => {
            const saat = bugun ? bugun[SAAT[n.id]] : null
            return (
              <VakitKarti
                key={n.id}
                n={n}
                s={say(n, detay, bilinenMi)}
                saat={saat}
                gecti={bugun && n.id !== 'vitir' && dk(saat) <= su}
                sirada={n.id === siradaki.id}
                cuma={vakitler?.cuma && n.id === 'ogle'}
                onAc={onAc}
              />
            )
          })}
        </div>
      </section>

      {gruplar.length > 0 && (
        <section>
          <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Namaz dışında</h2>
          <div className="space-y-3">
            {gruplar.map((g) => {
              const s = say(g, detay, bilinenMi)
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onAc(g.id)}
                  className="block w-full overflow-hidden rounded-3xl text-left shadow-lg shadow-black/30 ring-1 ring-white/10 transition active:scale-[0.98]"
                >
                  <Sahne id={g.id} className="h-20">
                    <div className="flex h-full items-center justify-between gap-3 px-4">
                      <div>
                        <p className="font-extrabold text-white">{g.ad}</p>
                        <p className="text-xs text-white/75 tabular-nums">
                          {s.bilinen}/{s.toplam} ezber
                        </p>
                      </div>
                      <Halka yuzde={s.yuzde} boyut={34} kalinlik={3.5} />
                    </div>
                  </Sahne>
                </button>
              )
            })}
          </div>
        </section>
      )}

      <GorunumSecici tasarim={tasarim} onSec={onTasarimSec} />
    </div>
  )
}
