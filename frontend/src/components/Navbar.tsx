"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bulk", label: "Bulk CSV" },
  { href: "/performance", label: "Performance" },
  { href: "/shap", label: "Explainability" },
  { href: "/graph", label: "Fund-Flow" },
  { href: "/str", label: "STR Filing" },
  { href: "/contrastive", label: "Anomaly Lab" },
  { href: "/live-feeds", label: "Live Feeds" },
  { href: "/compliance", label: "Compliance" },
  { href: "/cost-benefit", label: "Cost-Benefit" },
  { href: "/genai", label: "Case Story" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState<string>("")

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: false,
      })
    setNow(fmt())
    const t = setInterval(() => setNow(fmt()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0b1220]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/30">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-paper">
            Mule<span className="text-indigo-400">Shield</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.slice(0, 6).map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  active ? "bg-indigo-500/15 text-indigo-300" : "text-mist hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="hidden items-center gap-4 xl:flex">
          {navItems.slice(6).map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-medium transition-colors ${
                  active ? "text-indigo-300" : "text-mist hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <span className="h-4 w-px bg-white/10" />
          <span className="tick-mark text-xs font-medium text-cyan-300">{now} IST</span>
        </div>

        <button
          className="text-lg text-mist xl:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.06] bg-[#0d1526] px-4 py-3 xl:hidden">
          <div className="grid gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                    active ? "bg-indigo-500/15 text-indigo-300" : "text-mist hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}