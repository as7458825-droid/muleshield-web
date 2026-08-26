export default function LoadingSpinner({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-line border-t-gold" />
        <span className="tick-mark absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-faint">
          MS
        </span>
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">{text}</p>
    </div>
  )
}