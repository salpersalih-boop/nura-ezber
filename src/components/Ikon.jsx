const YOLLAR = {
  sabah: (
    <>
      <path d="M3 18h18" />
      <path d="M7 18a5 5 0 0110 0" />
      <path d="M12 6v3M4.9 10.4l1.8 1.5M19.1 10.4l-1.8 1.5" />
    </>
  ),
  ogle: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </>
  ),
  ikindi: (
    <>
      <circle cx="12" cy="10" r="3.5" />
      <path d="M12 3.5V5M4.5 10H6M18 10h1.5M6.7 4.7l1 1M17.3 4.7l-1 1" />
      <path d="M3 18h18M7 21h10" />
    </>
  ),
  aksam: (
    <>
      <path d="M3 18h18" />
      <path d="M7 18a5 5 0 0110 0" />
      <path d="M12 4v5M9.5 7l2.5 2.5L14.5 7" />
    </>
  ),
  gunes: (
    <>
      <path d="M3 19h18" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M12 5v2.5M5.5 8.5L7.2 10M18.5 8.5L16.8 10M3.5 13H5M19 13h1.5" />
    </>
  ),
  cuma: (
    <>
      <path d="M3 20h18" />
      <path d="M7.5 20v-4.5a4.5 4.5 0 019 0V20" />
      <path d="M12 11V8.5M12 8.5l-.9-1.4M12 8.5l.9-1.4" />
      <path d="M4 20V11.5M4 11.5l-1-1.5h2zM20 20V11.5M20 11.5l-1-1.5h2z" />
    </>
  ),
  konum: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  alev: <path d="M12 3c.5 3-1.8 4.6-3 6.3C7.8 11 7 12.5 7 14.5a5 5 0 0010 0c0-2.3-1.2-3.7-2-4.8.1 1.6-.6 2.6-1.6 2.9C14 10 13.6 6 12 3z" />,
  hedef: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </>
  ),
  yatsi: <path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" />,
  vitir: <path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />,
  sonrasi: (
    <>
      <circle cx="12" cy="4.5" r="1.5" />
      <circle cx="17.3" cy="6.7" r="1.5" />
      <circle cx="19.5" cy="12" r="1.5" />
      <circle cx="17.3" cy="17.3" r="1.5" />
      <circle cx="12" cy="19.5" r="1.5" />
      <circle cx="6.7" cy="17.3" r="1.5" />
      <circle cx="4.5" cy="12" r="1.5" />
      <circle cx="6.7" cy="6.7" r="1.5" />
    </>
  ),
  diger: (
    <>
      <path d="M4 5.5A1.5 1.5 0 015.5 4H12v16H5.5A1.5 1.5 0 014 18.5z" />
      <path d="M20 5.5A1.5 1.5 0 0018.5 4H12v16h6.5a1.5 1.5 0 001.5-1.5z" />
    </>
  ),
}

export default function Ikon({ ad, className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {YOLLAR[ad] ?? YOLLAR.diger}
    </svg>
  )
}
