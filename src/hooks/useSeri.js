import { useCallback, useEffect, useState } from 'react'

// Ezber serisi: dua işaretlenen günleri tutar, art arda kaç gün çalışıldığını hesaplar.
const ANAHTAR = 'namaz-pratik:seri:v1'
const gunAnahtari = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function oku() {
  try {
    const v = JSON.parse(localStorage.getItem(ANAHTAR))
    return v && typeof v === 'object' ? v : {}
  } catch {
    return {}
  }
}

export default function useSeri() {
  const [gunler, setGunler] = useState(oku) // { "2026-11-15": 3 }

  useEffect(() => {
    try {
      localStorage.setItem(ANAHTAR, JSON.stringify(gunler))
    } catch {
      // kayıt yapılamazsa sorun değil
    }
  }, [gunler])

  const kaydet = useCallback(() => {
    const k = gunAnahtari(new Date())
    setGunler((g) => ({ ...g, [k]: (g[k] ?? 0) + 1 }))
  }, [])

  // Bugünden (bugün boşsa dünden) geriye art arda günler
  const d = new Date()
  if (!gunler[gunAnahtari(d)]) d.setDate(d.getDate() - 1)
  let seri = 0
  while (gunler[gunAnahtari(d)]) {
    seri++
    d.setDate(d.getDate() - 1)
  }

  return { seri, bugun: gunler[gunAnahtari(new Date())] ?? 0, kaydet }
}
