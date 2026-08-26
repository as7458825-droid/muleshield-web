"use client"

import { useEffect, useRef, useState } from "react"

export function RiskRail({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(1, score)) * 100
  const color = score > 0.6 ? "#fb7185" : score > 0.4 ? "#fb7185" : score > 0.2 ? "#fbbf24" : "#34d399"
  return (
    <div aria-hidden className="relative h-6 w-full">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        />
      </div>
      <span
        className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#111b2e] shadow-lg"
        style={{ left: `${pct}%`, boxShadow: `0 0 12px ${color}88` }}
      />
    </div>
  )
}

export function RocPrChart({ roc, pr }: { roc: { fpr: number[]; tpr: number[] }; pr: { precision: number[]; recall: number[] } }) {
  const W = 320
  const H = 240
  const pad = 30

  const toPoints = (xs: number[], ys: number[]) =>
    xs.map((x, i) => `${pad + x * (W - 2 * pad)},${H - pad - ys[i] * (H - 2 * pad)}`).join(" ")

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <p className="mb-3 text-xs font-semibold tracking-wide text-mist uppercase">ROC Curve · AUC 0.991</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <defs>
            <linearGradient id="rocFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="prFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x={pad} y={pad} width={W - 2 * pad} height={H - 2 * pad} rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
          <polyline points={`${pad},${H - pad} ${W - pad},${pad}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={`v${g}`} x1={pad + g * (W - 2 * pad)} y1={pad} x2={pad + g * (W - 2 * pad)} y2={H - pad} stroke="rgba(255,255,255,0.04)" />
          ))}
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={`h${g}`} x1={pad} y1={H - pad - g * (H - 2 * pad)} x2={W - pad} y2={H - pad - g * (H - 2 * pad)} stroke="rgba(255,255,255,0.04)" />
          ))}
          <polygon points={`${pad},${H - pad} ${toPoints(roc.fpr, roc.tpr)} ${W - pad},${H - pad}`} fill="url(#rocFill)" />
          <polyline points={toPoints(roc.fpr, roc.tpr)} fill="none" stroke="#818cf8" strokeWidth="2.6" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(129,140,248,0.5))" }} />
          <text x={pad} y={H - pad + 14} fill="#64748b" fontSize="9">0.0</text>
          <text x={W - pad - 10} y={H - pad + 14} fill="#64748b" fontSize="9">1.0</text>
          <text x={pad - 14} y={H - pad} fill="#64748b" fontSize="9">1.0</text>
          <text x={W / 2 - 18} y={H - 2} fill="#64748b" fontSize="8" letterSpacing="2">FPR →</text>
        </svg>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold tracking-wide text-mist uppercase">PR Curve · AP 0.937</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <rect x={pad} y={pad} width={W - 2 * pad} height={H - 2 * pad} rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={`v${g}`} x1={pad + g * (W - 2 * pad)} y1={pad} x2={pad + g * (W - 2 * pad)} y2={H - pad} stroke="rgba(255,255,255,0.04)" />
          ))}
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={`h${g}`} x1={pad} y1={H - pad - g * (H - 2 * pad)} x2={W - pad} y2={H - pad - g * (H - 2 * pad)} stroke="rgba(255,255,255,0.04)" />
          ))}
          <polygon points={`${pad},${H - pad} ${toPoints(pr.recall, pr.precision)} ${W - pad},${H - pad}`} fill="url(#prFill)" />
          <polyline points={toPoints(pr.recall, pr.precision)} fill="none" stroke="#22d3ee" strokeWidth="2.6" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.5))" }} />
          <text x={W / 2 - 24} y={H - 2} fill="#64748b" fontSize="8" letterSpacing="2">RECALL →</text>
        </svg>
      </div>
    </div>
  )
}

export function ConfusionBlock({ matrix }: { matrix: number[][] }) {
  const cells = [
    { v: matrix[0][0], label: "TN · Legit", cls: "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300" },
    { v: matrix[0][1], label: "FP", cls: "border-amber-400/20 bg-amber-400/[0.07] text-amber-300" },
    { v: matrix[1][0], label: "FN", cls: "border-amber-400/20 bg-amber-400/[0.07] text-amber-300" },
    { v: matrix[1][1], label: "TP · Mule", cls: "border-rose-400/25 bg-rose-400/[0.09] text-rose-300" },
  ]
  return (
    <div className="grid grid-cols-2 gap-3">
      {cells.map((c) => (
        <div key={c.label} className={`rounded-2xl border p-5 ${c.cls}`}>
          <p className="font-display text-3xl font-bold">{c.v.toLocaleString()}</p>
          <p className="mt-1 text-[11px] font-semibold tracking-wide uppercase opacity-80">{c.label}</p>
        </div>
      ))}
    </div>
  )
}

export function WaterfallChart({
  items,
  base,
  pred,
}: {
  items: { name: string; contribution: number }[]
  base: number
  pred: number
}) {
  const max = Math.max(...items.map((i) => Math.abs(i.contribution)), 0.01)
  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const pos = item.contribution >= 0
        const width = Math.max((Math.abs(item.contribution) / max) * 100, 3)
        return (
          <div key={item.name}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[12px] font-medium text-mist">{item.name}</span>
              <span className={`tick-mark text-[12px] font-semibold ${pos ? "text-rose-300" : "text-emerald-300"}`}>
                {pos ? "+" : ""}
                {item.contribution.toFixed(4)}
              </span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-white/[0.06]">
              <div
                className={`h-2 rounded-full ${pos ? "bg-gradient-to-r from-rose-500 to-rose-400" : "bg-gradient-to-r from-emerald-500 to-emerald-400"}`}
                style={{ width: `${width}%`, marginLeft: pos ? undefined : `${100 - width}%` }}
              />
            </div>
          </div>
        )
      })}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 text-xs font-semibold text-faint">
        <span>BASE {base.toFixed(4)}</span>
        <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
          P(MULE) = {pred.toFixed(4)}
        </span>
      </div>
    </div>
  )
}

interface Node {
  id: string
  label: string
  type: string
  risk_score?: number
}
interface Edge {
  source: string
  target: string
  amount: number
  date: string
}

export function ForceGraph({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})

  useEffect(() => {
    const W = 640
    const H = 420
    const cx = W / 2
    const cy = H / 2
    const r = Math.min(W, H) / 2 - 60
    const pos: Record<string, { x: number; y: number }> = {}
    nodes.forEach((n, i) => {
      const ang = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
      pos[n.id] = { x: cx + Math.cos(ang) * r * 0.85, y: cy + Math.sin(ang) * r * 0.85 }
    })
    const vel: Record<string, { x: number; y: number }> = {}
    nodes.forEach((n) => (vel[n.id] = { x: 0, y: 0 }))

    const step = () => {
      const rep = 4200
      const att = 0.02
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = pos[nodes[i].id]
          const b = pos[nodes[j].id]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d2 = Math.max(dx * dx + dy * dy, 1)
          const f = (rep / d2) * Math.min(d2, 9000)
          const fx = (dx / Math.sqrt(d2)) * f
          const fy = (dy / Math.sqrt(d2)) * f
          vel[nodes[i].id].x -= fx
          vel[nodes[i].id].y -= fy
          vel[nodes[j].id].x += fx
          vel[nodes[j].id].y += fy
        }
      }
      for (const e of edges) {
        const a = pos[e.source]
        const b = pos[e.target]
        if (!a || !b) continue
        const dx = b.x - a.x
        const dy = b.y - a.y
        vel[e.source].x += dx * att
        vel[e.source].y += dy * att
        vel[e.target].x -= dx * att
        vel[e.target].y -= dy * att
      }
      for (const n of nodes) {
        const p = pos[n.id]
        p.x += vel[n.id].x
        p.y += vel[n.id].y
        p.x = Math.max(30, Math.min(W - 30, p.x))
        p.y = Math.max(30, Math.min(H - 30, p.y))
        vel[n.id].x *= 0.55
        vel[n.id].y *= 0.55
      }
      setPositions({ ...pos })
      frame = requestAnimationFrame(step)
    }
    let frame = requestAnimationFrame(step)
    const stop = setTimeout(() => cancelAnimationFrame(frame), 2600)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(stop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const colorFor = (n: Node) => {
    if (n.type === "bank") return "#fbbf24"
    if (n.type === "branch") return "#94a3b8"
    return (n.risk_score ?? 0) > 0.5 ? "#fb7185" : "#34d399"
  }

  return (
    <svg ref={svgRef} viewBox="0 0 640 420" className="w-full">
      <rect width="640" height="420" fill="#0b1220" />
      <circle cx="320" cy="210" r="180" fill="none" stroke="rgba(255,255,255,0.03)" />
      <circle cx="320" cy="210" r="120" fill="none" stroke="rgba(255,255,255,0.03)" />
      {edges.map((e, i) => {
        const a = positions[e.source]
        const b = positions[e.target]
        if (!a || !b) return null
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.4"
          />
        )
      })}
      {nodes.map((n) => {
        const p = positions[n.id]
        if (!p) return null
        const size = n.type === "bank" ? 16 : n.type === "branch" ? 12 : 8 + (n.risk_score ?? 0.5) * 8
        const c = colorFor(n)
        return (
          <g key={n.id}>
            <circle cx={p.x} cy={p.y} r={size + 6} fill={c} opacity="0.15" />
            <circle cx={p.x} cy={p.y} r={size} fill="#16233a" stroke={c} strokeWidth="2" />
            <circle cx={p.x} cy={p.y} r={size * 0.35} fill={c} />
            <text x={p.x} y={p.y - size - 6} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500">
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function ScatterPlot({ points }: { points: { x: number; y: number; label: string }[] }) {
  const W = 640
  const H = 380
  const pad = 26
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const xMin = Math.min(...xs)
  const xMax = Math.max(...xs)
  const yMin = Math.min(...ys)
  const yMax = Math.max(...ys)
  const nx = (v: number) => pad + ((v - xMin) / Math.max(xMax - xMin, 1e-6)) * (W - 2 * pad)
  const ny = (v: number) => H - pad - ((v - yMin) / Math.max(yMax - yMin, 1e-6)) * (H - 2 * pad)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <rect width={W} height={H} fill="#0b1220" />
      {[0.2, 0.4, 0.6, 0.8].map((g) => (
        <line key={`v${g}`} x1={pad + g * (W - 2 * pad)} y1={pad} x2={pad + g * (W - 2 * pad)} y2={H - pad} stroke="rgba(255,255,255,0.04)" />
      ))}
      {[0.2, 0.4, 0.6, 0.8].map((g) => (
        <line key={`h${g}`} x1={pad} y1={H - pad - g * (H - 2 * pad)} x2={W - pad} y2={H - pad - g * (H - 2 * pad)} stroke="rgba(255,255,255,0.04)" />
      ))}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={nx(p.x)} cy={ny(p.y)} r="7" fill="#22d3ee" opacity="0.12" />
          <circle cx={nx(p.x)} cy={ny(p.y)} r="3.2" fill="#22d3ee" />
        </g>
      ))}
    </svg>
  )
}