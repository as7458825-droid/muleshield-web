const levelMeta: Record<string, { dot: string; pill: string }> = {
  Low: { dot: "bg-emerald-400", pill: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30" },
  Medium: { dot: "bg-amber-400", pill: "bg-amber-400/10 text-amber-300 border-amber-400/30" },
  High: { dot: "bg-rose-400", pill: "bg-rose-400/10 text-rose-300 border-rose-400/30" },
  Critical: { dot: "bg-rose-500", pill: "bg-rose-500/15 text-rose-300 border-rose-500/40" },
}

export default function RiskBadge({ level, score }: { level: string; score?: number }) {
  const meta = levelMeta[level] || { dot: "bg-slate-400", pill: "bg-slate-400/10 text-slate-300 border-slate-400/30" }
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.pill}`}
    >
      <span className={`status-dot ${meta.dot} ${level === "Critical" ? "pulse-glow" : ""}`} />
      {level}
      {score !== undefined && <span className="opacity-70">{(score * 100).toFixed(1)}%</span>}
    </span>
  )
}