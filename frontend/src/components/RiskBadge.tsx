const levelMeta: Record<string, { dot: string; pill: string }> = {
  Low: { dot: "bg-safe", pill: "bg-safe/[0.08] text-[#3ddba0] border-safe/25" },
  Medium: { dot: "bg-warn", pill: "bg-warn/[0.08] text-[#f8cd6b] border-warn/25" },
  High: { dot: "bg-alert", pill: "bg-alert/[0.08] text-[#ff7a89] border-alert/25" },
  Critical: { dot: "bg-alert pulse-glow", pill: "bg-alert/15 text-[#ff8a97] border-alert/40" },
}

export default function RiskBadge({ level, score }: { level: string; score?: number }) {
  const meta = levelMeta[level] || { dot: "bg-faint", pill: "bg-white/[0.04] text-mist border-line" }
  return (
    <span
      className={`tick-mark inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${meta.pill}`}
    >
      <span className={`status-dot h-1.5 w-1.5 ${meta.dot}`} />
      {level}
      {score !== undefined && <span className="font-normal opacity-70">{(score * 100).toFixed(1)}</span>}
    </span>
  )
}