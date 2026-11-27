// Arka planda yavaşça dalgalanan kutup ışıkları
export default function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="k-aurora absolute -left-1/4 -top-1/4 h-[32rem] w-[32rem] rounded-full bg-teal-500/12 blur-3xl" />
      <div className="k-aurora absolute -right-1/4 top-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-600/15 blur-3xl" style={{ animationDelay: '-6s' }} />
      <div className="k-aurora absolute -bottom-1/4 left-1/4 h-[26rem] w-[26rem] rounded-full bg-fuchsia-600/10 blur-3xl" style={{ animationDelay: '-12s' }} />
    </div>
  )
}
