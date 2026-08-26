"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"
import LoadingSpinner from "@/components/LoadingSpinner"
import Stat from "@/components/Stat"
import { ScatterPlot } from "@/components/charts"
import type { ContrastiveResponse } from "@/lib/types"

export default function ContrastivePage() {
  const [data, setData] = useState<ContrastiveResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/contrastive`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then(setData)
      .catch(() => setError("Failed to load contrastive data — is the backend running?"))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <>
        <Navbar />
        <LoadingSpinner text="Running contrastive analysis…" />
        <Footer />
      </>
    )
  if (error)
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12">
          <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">⚠ {error}</p>
        </main>
        <Footer />
      </>
    )

  if (!data) return null

  const anomalies = data?.accounts.filter((a) => a.is_anomaly) ?? []

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <PageHeader
          eyebrow="Anomaly Lab"
          title="Unsupervised Contrastive Layer"
          desc="Autoencoder + LOF + contrastive Isolation Forest scoring accounts outside the labelled set. A separate investigative feed — never mixed into the supervised verdict."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Accounts scanned" value={data?.accounts.length ?? 0} />
          <Stat label="Anomalies flagged" value={anomalies.length} accent />
          <Stat
            label="Consensus rule"
            value={100}
            display={data ? ((anomalies.length / data.accounts.length) * 100).toFixed(1) + "%" : "—"}
          />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="glass overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
              <span className="text-xs font-semibold tracking-wide text-mist uppercase">Projected Anomaly Space</span>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-faint uppercase">2-D Projection</span>
            </div>
            <ScatterPlot points={data?.tsne ?? []} />
          </div>

          <div className="glass p-6">
            <h2 className="text-xs font-semibold tracking-wide text-mist uppercase">Flagged Accounts · {anomalies.length}</h2>
            {anomalies.length === 0 ? (
              <p className="mt-4 text-sm text-mist">No anomalies above threshold. System is quiet.</p>
            ) : (
              <div className="mt-4 max-h-[380px] space-y-2 overflow-auto">
                {anomalies.map((a) => (
                  <div key={a.account_number} className="flex items-center justify-between rounded-xl border border-rose-400/25 bg-rose-400/5 px-4 py-3">
                    <span className="text-sm font-semibold text-paper">{a.account_number}</span>
                    <span className="text-sm font-semibold text-rose-300">{(a.anomaly_score * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5 border-t border-white/[0.06] pt-4">
              <p className="text-xs font-semibold tracking-wide text-mist uppercase">Method</p>
              <p className="mt-2 text-[13px] leading-relaxed text-mist">
                AE reconstruction error · LOF density score · contrastive isolation
                <br />
                2-of-3 consensus → anomaly
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}