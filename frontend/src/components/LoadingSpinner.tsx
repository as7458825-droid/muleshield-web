export default function LoadingSpinner({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-indigo-400" />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-indigo-300">
          MS
        </span>
      </div>
      <p className="text-xs font-medium tracking-wide text-mist uppercase">{text}</p>
    </div>
  )
}