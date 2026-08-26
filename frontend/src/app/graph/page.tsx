"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"
import LoadingSpinner from "@/components/LoadingSpinner"
import { ForceGraph } from "@/components/charts"
import type { GraphResponse } from "@/lib/types"

export default function GraphPage() {
  const [account, setAccount] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<GraphResponse | null>(null)
  const [error, setError] = useState("")

  const load = async () => {
    if (!account.trim()) return
    setLoading(true)
    setError("")
    setData(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/graph/${account}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(err.detail || `API error: ${res.status}`)
      }
      setData(await res.json())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <PageHeader
          eyebrow="Fund-Flow"
          title="Network Graph"
          desc="Money movement between accounts, branches and the bank. Node colour: red = high risk, green = low risk, amber = bank."
        />

        <div className="mt-8 flex gap-3">
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Account number"
            className="input-modern flex-1"
            aria-label="Account number"
          />
          <button onClick={load} disabled={loading} className="btn-primary">
            {loading ? "Laying out…" : "Load Graph"}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}
        {loading && <LoadingSpinner text="Building force layout…" />}

        {data && (
          <div className="reveal mt-8 space-y-5">
            <div className="glass overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
                <span className="text-xs font-semibold tracking-wide text-mist uppercase">
                  Force Layout · {data.nodes.length} nodes / {data.edges.length} edges
                </span>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-faint uppercase">Live simulation</span>
              </div>
              <ForceGraph nodes={data.nodes} edges={data.edges} />
            </div>

            <div className="glass p-6">
              <h2 className="text-xs font-semibold tracking-wide text-mist uppercase">Transaction Ledger</h2>
              <div className="mt-4 max-h-72 overflow-auto">
                {data.edges.map((e, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-2 py-2.5 text-[13px]">
                    <span className="text-mist">
                      {e.source} <span className="text-faint">→</span> {e.target}
                    </span>
                    <span className="tick-mark font-semibold text-paper">₹{e.amount.toLocaleString("en-IN")}</span>
                    <span className="tick-mark text-faint">{e.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}