"use client"

import { useEffect, useRef, useState } from "react"

export function useCountUp(target: number, duration = 900, decimals = 0) {
  const [value, setValue] = useState(0)
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(parseFloat((target * eased).toFixed(decimals)))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current!)
  }, [target, duration, decimals])

  return value
}

export default function Stat({
  label,
  value,
  display,
  decimals = 0,
  accent = false,
}: {
  label: string
  value: number
  display?: string
  decimals?: number
  accent?: boolean
}) {
  const v = useCountUp(value, 900, decimals)
  const shown = display ?? (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString())
  return (
    <div className="glass glass-hover p-6">
      <p className="text-xs font-semibold tracking-wide text-mist uppercase">{label}</p>
      <p
        className={`mt-2 font-display text-3xl font-bold tracking-tight ${
          accent ? "bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent" : "text-paper"
        }`}
      >
        {shown}
      </p>
    </div>
  )
}