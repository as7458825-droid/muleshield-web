"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"
import LoadingSpinner from "@/components/LoadingSpinner"
import RiskBadge from "@/components/RiskBadge"
import { RiskRail } from "@/components/charts"
import type { PredictResponse } from "@/lib/types"

export default function DashboardPage() {
  const [account, setAccount] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictResponse | null>(null)
  const [error, setError] = useState("")
  const [freezing, setFreezing] = useState(false)
  const [frozen, setFrozen] = useState<Record<string, boolean>>({})
  const [history, setHistory] = useState<PredictResponse[]>([])

  const search = async (acc?: string) => {
    const target = acc ?? account
    if (!target.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: target, features: {} }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(err.detail || `API error: ${res.status}`)
      }
      const data = await res.json()
      setResult(data)
      setHistory((h) => [data, ...h].slice(0, 6))
      const st = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/freeze/status/${target}`).catch(() => null)
      if (st?.ok) {
        const body = await st.json()
        setFrozen((f) => ({ ...f, [target]: body.is_frozen }))
      }
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const freezeAccount = async () => {
    if (!result) return
    setFreezing(true)
    setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/freeze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: result.account_number }),
      })
      if (!res.ok) throw new Error(await res.text())
      setFrozen((f) => ({ ...f, [result.account_number]: true }))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setFreezing(false)
    }
  }

  const isFrozen = result ? !!frozen[result.account_number] : false

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <PageHeader
          eyebrow="Screening Desk"
          title="Account Risk Assessment"
          desc="Enter an account number. The leakage-free model returns a risk verdict with per-model scores and the features that drove the decision."
        />

        <div className="mt-8 flex gap-3">
          <input
            type="text"
            placeholder="Account number — MULE001, LEGIT001, TEST001…"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            className="input-modern flex-1"
            aria-label="Account number"
          />
          <button onClick={() => search()} disabled={loading} className="btn-primary">
            {loading ? "Scanning…" : "Assess Risk"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-faint uppercase">Try:</span>
          {["MULE001", "LEGIT001", "MULE002"].map((a) => (
            <button
              key={a}
              onClick={() => {
                setAccount(a)
                search(a)
              }}
              className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-mist transition-colors hover:border-indigo-400/50 hover:text-indigo-300"
            >
              {a}
            </button>
          ))}
          <span className="text-[11px] text-faint">MULE001/002 = real confirmed mules from the dataset</span>
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}
        {loading && <LoadingSpinner text="Running model ensemble…" />}

        {result && (
          <div className="reveal mt-8 space-y-5">
            <div className="glass relative overflow-hidden p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-paper">{result.account_number}</h2>
                  {result.demo_label && (
                    <p className="mt-0.5 text-xs font-semibold text-indigo-300 uppercase">{result.demo_label}</p>
                  )}
                </div>
                <RiskBadge level={result.risk_level} score={result.risk_score} />
              </div>
              <div className="mt-5 max-w-xl">
                <RiskRail score={result.risk_score} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-sm text-mist">
                  Verdict:{" "}
                  <span className="font-semibold text-paper">{result.risk_level}</span> · Confidence{" "}
                  <span className="font-semibold text-paper">{(result.risk_score * 100).toFixed(1)}%</span>
                </p>
                {(result.risk_level === "High" || result.risk_level === "Critical") &&
                  (isFrozen ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-400/15 px-4 py-1.5 text-xs font-bold tracking-wide text-rose-300">
                      <span className="status-dot bg-rose-400" /> Account Frozen
                    </span>
                  ) : (
                    <button
                      onClick={freezeAccount}
                      disabled={freezing}
                      className="rounded-full border border-rose-400/40 bg-rose-400/10 px-4 py-1.5 text-xs font-bold tracking-wide text-rose-300 transition-colors hover:bg-rose-500 hover:text-white disabled:opacity-50"
                    >
                      {freezing ? "Freezing…" : "Freeze Account"}
                    </button>
                  ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(result.model_scores).map(([model, score]) => (
                <div key={model} className="glass glass-hover p-5">
                  <p className="text-xs font-semibold tracking-wide text-mist uppercase">{model.replace("_", " ")}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-paper">
                    {(score * 100).toFixed(1)}
                    <span className="text-sm font-medium text-faint">%</span>
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${score * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {result.top_features.length > 0 && (
              <div className="glass p-6">
                <h3 className="text-xs font-semibold tracking-wide text-mist uppercase">Driving Features</h3>
                <div className="mt-4 space-y-3">
                  {result.top_features.map((f, i) => (
                    <div key={f.name}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm text-mist">
                          <span className="mr-2 text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                          {f.name}
                        </span>
                        <span className="text-sm font-semibold text-indigo-300">{(f.importance * 100).toFixed(1)}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${Math.min(f.importance * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-8 glass p-6">
            <h3 className="text-xs font-semibold tracking-wide text-mist uppercase">Session Screening Log</h3>
            <div className="mt-4 space-y-1">
              {history.map((h) => (
                <button
                  key={h.account_number}
                  onClick={() => setResult(h)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
                >
                  <span className="text-sm font-medium text-paper">{h.account_number}</span>
                  <span className="flex items-center gap-3">
                    <span className="tick-mark text-xs text-faint">{(h.risk_score * 100).toFixed(1)}%</span>
                    <RiskBadge level={h.risk_level} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}