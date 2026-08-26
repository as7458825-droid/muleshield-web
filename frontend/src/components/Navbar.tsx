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
  const [now, setNow] = useState("")

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

  const linkCls = (active: boolean) =>
    `border-b-2 pb-4 pt-[22px] -mt-[22px] text-[13px] transition-colors ${
      active
        ? "border-gold text-paper font-medium"
        : "border-transparent text-mist hover:text-paper"
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-ink">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
            </svg>
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-paper">MuleShield</span>
          <span className="tick-mark hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-faint sm:inline">
            v2.0
          </span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {navItems.slice(0, 6).map((item) => (
            <Link key={item.href} href={item.href} className={linkCls(pathname === item.href)}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 xl:flex">
          {navItems.slice(6).map((item) => (
            <Link key={item.href} href={item.href} className={linkCls(pathname === item.href)}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <span className="h-4 w-px bg-line" />
          <span className="flex items-center gap-2">
            <span className="status-dot bg-safe pulse-glow" />
            <span className="tick-mark text-xs text-faint">{now} IST</span>
          </span>
        </div>

        <button
          className="text-lg text-mist lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-panel px-4 py-3 lg:hidden">
          <div className="grid gap-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm ${
                    active ? "bg-raised text-paper font-medium" : "text-mist hover:bg-raised"
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