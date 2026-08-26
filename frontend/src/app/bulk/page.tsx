"use client"

import { useRef, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"
import LoadingSpinner from "@/components/LoadingSpinner"
import RiskBadge from "@/components/RiskBadge"
import Stat from "@/components/Stat"

interface BulkRow {
  account_number: string
  risk_score: number
  risk_level: "Low" | "Medium" | "High" | "Critical"
  model_scores: Record<string, number>
}

interface BulkResponse {
  total: number
  missing_features: string[]
  summary: { Low: number; Medium: number; High: number; Critical: number }
  results: BulkRow[]
}

const levelOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }

export default function BulkPage() {
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BulkResponse | null>(null)
  const [error, setError] = useState("")
  const [sortKey, setSortKey] = useState<"score" | "level">("score")
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onFile = async (f: File | undefined) => {
    if (!f) return
    setFileName(f.name)
    setError("")
    setData(null)
    setLoading(true)
    try {
      const form = new FormData()
      form.append("file", f)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/bulk`, {
        method: "POST",
        body: form,
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.detail || `API error: ${res.status}`)
      setData(body)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const downloadResults = () => {
    if (!data) return
    const header = "account_number,risk_score,risk_level,xgboost,random_forest,isolation_forest"
    const lines = data.results.map(
      (r) =>
        `${r.account_number},${r.risk_score},${r.risk_level},${r.model_scores.xgboost ?? ""},${r.model_scores.random_forest ?? ""},${r.model_scores.isolation_forest ?? ""}`
    )
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `muleshield_bulk_results.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const rows = data ? [...data.results].sort((a, b) => (sortKey === "score" ? b.risk_score - a.risk_score : levelOrder[a.risk_level] - levelOrder[b.risk_level])) : []

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <PageHeader
          eyebrow="Bulk Screening"
          title="CSV Upload Screening"
          desc="Upload the BOI dataset CSV (F-prefixed feature columns) and every account is scored by the same ensemble behind the screening desk — in one shot."
        />

        <div className="mt-8 glass p-6">
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 px-6 py-12 text-center transition-colors hover:border-indigo-400/60 hover:bg-indigo-400/5"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload CSV file"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            <p className="mt-4 font-display text-lg font-semibold text-paper">Drop your CSV here</p>
            <p className="mt-1 text-sm text-mist">
              {fileName ? fileName : "or click to browse · max 5,000 rows · expects F1…F3924 feature columns"}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>
          {loading && <LoadingSpinner text="Scoring all accounts…" />}
          {error && (
            <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </p>
          )}
        </div>

        {data && !loading && (
          <div className="reveal mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Accounts scored" value={data.total} />
              <Stat label="Low risk" value={data.summary.Low} />
              <Stat label="Medium risk" value={data.summary.Medium} accent />
              <Stat label="High + Critical" value={data.summary.High + data.summary.Critical} accent />
            </div>

            {data.missing_features.length > 0 && (
              <p className="text-xs text-faint">
                Note: {data.missing_features.length} feature columns missing from upload (filled as 0):
                {data.missing_features.slice(0, 6).join(", ")}
                {data.missing_features.length > 6 ? ` +${data.missing_features.length - 6} more` : ""}
              </p>
            )}

            <div className="glass overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
                <span className="text-xs font-semibold tracking-wide text-mist uppercase">Results · sorted by {sortKey}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSortKey(sortKey === "score" ? "level" : "score")}
                    className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-mist transition-colors hover:border-indigo-400/50 hover:text-indigo-300"
                  >
                    Sort: {sortKey === "score" ? "Risk score" : "Risk level"}
                  </button>
                  <button onClick={downloadResults} className="btn-ghost !px-3.5 !py-1.5 !text-xs">
                    Download CSV
                  </button>
                </div>
              </div>
              <div className="max-h-[480px] overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left text-xs text-faint uppercase">
                      <th className="px-5 py-3 font-semibold">Account</th>
                      <th className="px-5 py-3 font-semibold">Risk score</th>
                      <th className="px-5 py-3 font-semibold">Level</th>
                      <th className="hidden px-5 py-3 text-right font-semibold md:table-cell">XGBoost</th>
                      <th className="hidden px-5 py-3 text-right font-semibold md:table-cell">Random Forest</th>
                      <th className="hidden px-5 py-3 text-right font-semibold lg:table-cell">Isolation Forest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.account_number} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.04]">
                        <td className="px-5 py-3 font-medium text-paper">{r.account_number}</td>
                        <td className="tick-mark px-5 py-3 text-mist">{(r.risk_score * 100).toFixed(1)}%</td>
                        <td className="px-5 py-3">
                          <RiskBadge level={r.risk_level} />
                        </td>
                        <td className="tick-mark hidden px-5 py-3 text-right text-mist md:table-cell">
                          {r.model_scores.xgboost !== undefined ? `${(r.model_scores.xgboost * 100).toFixed(1)}%` : "—"}
                        </td>
                        <td className="tick-mark hidden px-5 py-3 text-right text-mist md:table-cell">
                          {r.model_scores.random_forest !== undefined ? `${(r.model_scores.random_forest * 100).toFixed(1)}%` : "—"}
                        </td>
                        <td className="tick-mark hidden px-5 py-3 text-right text-mist lg:table-cell">
                          {r.model_scores.isolation_forest !== undefined ? `${(r.model_scores.isolation_forest * 100).toFixed(1)}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}