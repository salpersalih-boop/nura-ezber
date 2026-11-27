import { useEffect, useState } from 'react'

// Hangi arayüzün açık olduğunu telefonda hatırlar: 'renkli' (varsayılan) veya 'zarif' (yeni)
const ANAHTAR = 'namaz-pratik:tasarim'
const GECERLI = ['renkli', 'zarif', 'kadran']

export default function useTasarim() {
  const [tasarim, setTasarim] = useState(() => {
    try {
      let k = localStorage.getItem(ANAHTAR)
      if (k === 'bento') k = 'kadran'
      return GECERLI.includes(k) ? k : 'renkli'
    } catch {
      return 'renkli'
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(ANAHTAR, tasarim)
    } catch {
      // kayıt yapılamazsa sorun değil
    }
  }, [tasarim])
  return [tasarim, setTasarim]
}
