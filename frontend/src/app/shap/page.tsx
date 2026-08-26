"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"
import LoadingSpinner from "@/components/LoadingSpinner"
import { WaterfallChart } from "@/components/charts"
import type { ShapResponse } from "@/lib/types"

export default function ShapPage() {
  const [account, setAccount] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ShapResponse | null>(null)
  const [error, setError] = useState("")

  const load = async (acc?: string) => {
    const target = acc ?? account
    if (!target.trim()) return
    setLoading(true)
    setError("")
    setData(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/shap/${target}`)
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
      <main className="mx-auto max-w-5xl px-4 py-10">
        <PageHeader
          eyebrow="Explainability"
          title="SHAP Waterfall"
          desc="Why was this account flagged? Red bars push risk up, teal bars pull it down — every number auditable."
        />

        <div className="mt-8 flex gap-3">
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Account number — MULE001 for a real mule"
            className="input-modern flex-1"
            aria-label="Account number"
          />
          <button onClick={() => load()} disabled={loading} className="btn-primary">
            {loading ? "Computing…" : "Explain"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-faint uppercase">Try:</span>
          {["MULE001", "LEGIT001"].map((a) => (
            <button
              key={a}
              onClick={() => {
                setAccount(a)
                load(a)
              }}
              className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-mist transition-colors hover:border-indigo-400/50 hover:text-indigo-300"
            >
              {a}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}
        {loading && <LoadingSpinner text="Computing SHAP values…" />}

        {data && (
          <div className="reveal mt-8 grid gap-5 lg:grid-cols-2">
            <div className="glass p-6">
              <h2 className="eyebrow mb-5">Top Contributions · Top 15</h2>
              {data.demo_label && (
                <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-indigo-300 uppercase">{data.demo_label}</p>
              )}
              <WaterfallChart
                items={(data.waterfall ?? []).map((w) => ({ name: w.feature, contribution: w.contribution }))}
                base={data.base_value}
                pred={data.prediction}
              />
            </div>
            <div className="glass p-6">
              <h2 className="eyebrow mb-5">Feature Values · Top 20</h2>
              <div className="max-h-[480px] space-y-1 overflow-auto pr-2">
                {data.features.map((f) => (
                  <div key={f.name} className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-2 py-1.5">
                    <span className="truncate text-[12px] text-mist">{f.name}</span>
                    <span className="tick-mark text-[12px] text-faint">{f.value.toFixed(2)}</span>
                    <span className={`tick-mark w-24 text-right text-[12px] font-semibold ${f.shap_value >= 0 ? "text-rose-300" : "text-emerald-300"}`}>
                      {f.shap_value >= 0 ? "+" : ""}
                      {f.shap_value.toFixed(4)}
                    </span>
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