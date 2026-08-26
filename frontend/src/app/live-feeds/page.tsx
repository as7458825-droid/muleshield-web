"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"
import RiskBadge from "@/components/RiskBadge"

interface FeedItem {
  id: number
  account: string
  amount: number
  type: string
  timestamp: string
  risk: "Low" | "Medium" | "High" | "Critical"
}

const types = ["IMPS IN", "IMPS OUT", "NEFT IN", "NEFT OUT", "RTGS IN", "RTGS OUT", "UPI IN", "UPI OUT"]
const riskPool: ("Low" | "Medium" | "High" | "Critical")[] = ["Low", "Low", "Low", "Medium", "Medium", "High", "Critical"]

function genFeeds(): FeedItem[] {
  const rng = (n: number) => Math.floor(Math.random() * n)
  return Array.from({ length: 8 }, (_, i) => ({
    id: Date.now() + i,
    account: `ACC-${String(1000 + rng(9000))}`,
    amount: [500, 2000, 8500, 25000, 61000, 150000, 340000, 980000, 1200000][rng(9)],
    type: types[rng(types.length)],
    timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
    risk: riskPool[rng(riskPool.length)],
  }))
}

export default function LiveFeedsPage() {
  const [feeds, setFeeds] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/feeds`)
        if (res.ok) {
          setFeeds(await res.json())
          setLive(true)
        } else {
          setFeeds(genFeeds())
        }
      } catch {
        setFeeds(genFeeds())
      } finally {
        setLoading(false)
      }
    }
    fetchFeeds()
    const interval = setInterval(() => {
      setFeeds((prev) => {
        const next = genFeeds()
        return [...next.slice(0, 2), ...prev.slice(0, 6)]
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <PageHeader
          eyebrow="Surveillance"
          title="Live Transaction Feeds"
          desc="Alerts stream in as transactions hit the scoring pipeline. The desk re-syncs every 6 seconds."
        />

        <div className="mt-8 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-mist uppercase">
            <span className={`status-dot ${live ? "bg-safe pulse-glow" : "bg-warn"}`} />
            {live ? "Stream Connected" : "Demo Feed (Offline Mode)"}
          </span>
          <span className="text-xs font-medium text-faint">Sync 6s</span>
        </div>

        <div className="mt-4 space-y-2.5">
          {loading ? (
            <p className="py-16 text-center text-xs font-semibold tracking-[0.2em] text-faint uppercase">Connecting to feed…</p>
          ) : feeds.length === 0 ? (
            <div className="glass p-12 text-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-mist uppercase">No recent alerts — the system is quiet.</p>
            </div>
          ) : (
            feeds.map((f) => (
              <div key={f.id} className="glass glass-hover flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="tick-mark text-[12px] text-faint">{f.timestamp}</span>
                  <span className="text-sm font-semibold text-paper">{f.account}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] text-mist">{f.type}</span>
                  <span className="tick-mark text-sm font-bold text-paper">₹{f.amount.toLocaleString("en-IN")}</span>
                  <RiskBadge level={f.risk} />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}