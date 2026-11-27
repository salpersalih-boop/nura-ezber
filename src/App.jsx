import { useEffect, useRef, useState } from 'react'
import data from './data.json'
import DailyChecklist from './components/DailyChecklist'
import NamazSayfasi from './components/NamazSayfasi'
import LearningMode from './components/LearningMode'
import useChecklist from './hooks/useChecklist'
import useVakitler from './hooks/useVakitler'
import useTasarim from './hooks/useTasarim'
import ZarifAnaEkran from './components/zarif/ZarifAnaEkran'
import ZarifNamazSayfasi from './components/zarif/ZarifNamazSayfasi'
import KadranAnaEkran from './components/kadran/KadranAnaEkran'
import TesbihSayfasi from './components/kadran/TesbihSayfasi'
import Aurora from './components/kadran/Aurora'
import useSeri from './hooks/useSeri'

const ANA = { tip: 'ana' }
const LISTELER = [...data.namazlar, ...(data.gruplar ?? [])]

export default function App() {
  const { bilinenMi, ayarla: ayarlaHam, degistir: degistirHam } = useChecklist()
  const seri = useSeri()
  // Ezberlendi işaretlendiğinde günlük seriye kaydet
  const ayarla = (id, deger) => {
    if (deger && !bilinenMi(id)) seri.kaydet()
    ayarlaHam(id, deger)
  }
  const degistir = (id) => {
    if (!bilinenMi(id)) seri.kaydet()
    degistirHam(id)
  }
  const v = useVakitler()
  const [tasarim, setTasarim] = useTasarim()
  const AnaEkran = { renkli: DailyChecklist, zarif: ZarifAnaEkran, kadran: KadranAnaEkran }[tasarim] ?? DailyChecklist
  const ListeSayfasi = { renkli: NamazSayfasi, zarif: ZarifNamazSayfasi, kadran: TesbihSayfasi }[tasarim] ?? NamazSayfasi
  // view: { tip: 'ana' } | { tip: 'liste', id } | { tip: 'dua', id, listeId }
  const [view, setView] = useState(ANA)
  const dokunus = useRef(null)

  useEffect(() => {
    window.history.replaceState(null, '')
    const geriDinle = (e) => setView(e.state?.v ?? ANA)
    window.addEventListener('popstate', geriDinle)
    return () => window.removeEventListener('popstate', geriDinle)
  }, [])

  const git = (v) => {
    window.history.pushState({ v }, '')
    setView(v)
    window.scrollTo({ top: 0 })
  }
  const geri = () => {
    if (window.history.state?.v) window.history.back()
    else setView(ANA)
  }

  // Sağa kaydırarak geri dön
  const dokunusBasla = (e) => {
    const t = e.touches[0]
    dokunus.current = { x: t.clientX, y: t.clientY }
  }
  const dokunusBitir = (e) => {
    if (!dokunus.current || view.tip === 'ana') return
    const t = e.changedTouches[0]
    const dx = t.clientX - dokunus.current.x
    const dy = Math.abs(t.clientY - dokunus.current.y)
    dokunus.current = null
    if (dx > 90 && dy < 60) geri()
  }

  const liste = view.tip === 'liste' ? LISTELER.find((l) => l.id === view.id) : null
  const dua = view.tip === 'dua' ? data.dualar_detay[view.id] : null

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100" onTouchStart={dokunusBasla} onTouchEnd={dokunusBitir}>
      <main className="mx-auto max-w-xl px-5 pb-12 pt-6">
        {dua ? (
          <>
          {tasarim === 'kadran' && <Aurora />}
          <div className="relative">
          <LearningMode
            key={view.id}
            dua={dua}
            temaId={view.listeId}
            bilinen={bilinenMi(view.id)}
            onBilinen={(deger) => ayarla(view.id, deger)}
            onGeri={geri}
          />
          </div>
          </>
        ) : liste ? (
          <ListeSayfasi
            liste={liste}
            detay={data.dualar_detay}
            bilinenMi={bilinenMi}
            onDegistir={degistir}
            onAc={(id) => git({ tip: 'dua', id, listeId: liste.id })}
            onGeri={geri}
            vakitler={{ bugun: v.bugun, cuma: v.cuma }}
          />
        ) : (
          <AnaEkran
            namazlar={data.namazlar}
            gruplar={data.gruplar}
            detay={data.dualar_detay}
            bilinenMi={bilinenMi}
            onAc={(id) => git({ tip: 'liste', id })}
            onDuaAc={(id, listeId) => git({ tip: 'dua', id, listeId })}
            seri={seri}
            vakitler={{ simdi: v.simdi, bugun: v.bugun, hata: v.hata, cuma: v.cuma, onTekrar: v.tekrarDene }}
            tasarim={tasarim}
            onTasarimSec={(t) => {
              setTasarim(t)
              window.scrollTo({ top: 0 })
            }}
          />
        )}
      </main>
    </div>
  )
}
