# Namaz Pratik

Namaz adımlarını simüle eden ve sure/duaları ayet ayet ezberlemeye yardım eden kişisel uygulama.
React + Vite + TailwindCSS v4, yalnızca karanlık mod.

## Çalıştırma

```bash
npm install
npm run dev
```

## Yapı

```
src/
  App.jsx                  Sayfa yönetimi (Panel / Namaz Akışı / Ezber)
  data.json                Sure ve dualar (veritabanı yerine)
  components/
    Dashboard.jsx          Öğrenilecekler / Tamamlananlar + ilerleme
    Simulation.jsx         Adım adım namaz akışı (İleri / Geri, ← → tuşları)
    LearningMode.jsx       Oku + Boşluk doldur (flashcard) modları
    ProgressBar.jsx
  hooks/
    useProgress.js         LocalStorage ile ezber ilerlemesi
    useNamazAkisi.js       Simülasyon state'i (useReducer)
  lib/
    namazAkisi.js          State machine: adımlar, reducer, okunacakları süzme
    boslukDoldurma.js      Kelime gizleme ve cevap kontrol algoritması
```

## Yeni dua eklemek

`src/data.json` içindeki `dualar` dizisine ekle:

```json
{
  "id": "ettehiyyatu",
  "ad": "Ettehiyyâtü",
  "tur": "dua",
  "okunacak_durum": "oturus",
  "sadece_ilk_rekat": false,
  "aciklama": "Her oturuşta okunur.",
  "ayetler": [
    { "no": 1, "arapca": "...", "okunus": "...", "meal": "..." }
  ]
}
```

`okunacak_durum` değerleri: `kiyam`, `ruku`, `secde`, `oturus`.
Simülasyon, o adımdayken bu değere sahip kayıtları otomatik gösterir.
