import { useCallback, useEffect, useState } from 'react'

const ANAHTAR = 'namaz-pratik:ezber:v2'

// LocalStorage yapısı: { "subhaneke": true, "kevser": false }
function oku() {
  try {
    const ham = localStorage.getItem(ANAHTAR)
    const veri = ham ? JSON.parse(ham) : {}
    return veri && typeof veri === 'object' ? veri : {}
  } catch {
    return {}
  }
}

export default function useChecklist() {
  const [ezber, setEzber] = useState(oku)

  useEffect(() => {
    try {
      localStorage.setItem(ANAHTAR, JSON.stringify(ezber))
    } catch {
      // Kayıt yapılamazsa uygulama çalışmaya devam eder.
    }
  }, [ezber])

  const bilinenMi = useCallback((id) => ezber[id] === true, [ezber])

  const ayarla = useCallback((id, deger) => {
    setEzber((onceki) => ({ ...onceki, [id]: deger }))
  }, [])

  const degistir = useCallback((id) => {
    setEzber((onceki) => ({ ...onceki, [id]: !onceki[id] }))
  }, [])

  return { bilinenMi, ayarla, degistir }
}
