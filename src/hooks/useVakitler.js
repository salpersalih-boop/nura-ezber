import { useEffect, useState } from 'react'

// Ankara için Diyanet hesaplamasına göre (method=13) aylık ezan vakitleri.
// Ay bir kez indirilir ve telefona kaydedilir; sonraki açılışlarda internet gerekmez.
const adres = (y, m) =>
  `https://api.aladhan.com/v1/calendarByCity/${y}/${m}?city=Ankara&country=Turkey&method=13`

const saat = (s) => {
  const e = String(s ?? '').match(/(\d{1,2}):(\d{2})/)
  return e ? `${e[1].padStart(2, '0')}:${e[2]}` : ''
}

function ayiklaAy(json) {
  return Object.fromEntries(
    json.data.map((g) => [
      parseInt(g.date.gregorian.day, 10),
      {
        imsak: saat(g.timings.Imsak),
        gunes: saat(g.timings.Sunrise),
        ogle: saat(g.timings.Dhuhr),
        ikindi: saat(g.timings.Asr),
        aksam: saat(g.timings.Maghrib),
        yatsi: saat(g.timings.Isha),
      },
    ]),
  )
}

export default function useVakitler() {
  const [simdi, setSimdi] = useState(() => new Date())
  const [ay, setAy] = useState(null) // { anahtar, gunler }
  const [hata, setHata] = useState(false)
  const [deneme, setDeneme] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSimdi(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  const y = simdi.getFullYear()
  const m = simdi.getMonth() + 1
  const anahtar = `${y}-${m}`

  useEffect(() => {
    let iptal = false
    const depo = `namaz-pratik:vakit:v1:${anahtar}`
    try {
      const kayit = JSON.parse(localStorage.getItem(depo))
      if (kayit && Object.keys(kayit).length > 27) {
        setAy({ anahtar, gunler: kayit })
        setHata(false)
        return
      }
    } catch {
      // bozuk kayıt: yeniden indir
    }
    setHata(false)
    fetch(adres(y, m))
      .then((r) => {
        if (!r.ok) throw new Error('http')
        return r.json()
      })
      .then((json) => {
        if (iptal) return
        const gunler = ayiklaAy(json)
        try {
          localStorage.setItem(depo, JSON.stringify(gunler))
        } catch {
          // kayıt yapılamazsa yine de göster
        }
        setAy({ anahtar, gunler })
      })
      .catch(() => {
        if (!iptal) setHata(true)
      })
    return () => {
      iptal = true
    }
  }, [anahtar, y, m, deneme])

  const bugun = ay?.anahtar === anahtar ? (ay.gunler[simdi.getDate()] ?? null) : null

  return {
    simdi,
    bugun,
    hata: !bugun && hata,
    cuma: simdi.getDay() === 5,
    tekrarDene: () => setDeneme((d) => d + 1),
  }
}
