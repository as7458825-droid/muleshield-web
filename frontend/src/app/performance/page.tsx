"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"
import LoadingSpinner from "@/components/LoadingSpinner"
import Stat from "@/components/Stat"
import { RocPrChart, ConfusionBlock } from "@/components/charts"
import type { PerformanceMetrics } from "@/lib/types"

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/performance`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then(setData)
      .catch(() => setError("Failed to load performance metrics — is the backend running?"))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <>
        <Navbar />
        <LoadingSpinner text="Loading model performance…" />
        <Footer />
      </>
    )
  if (error)
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12">
          <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</p>
        </main>
        <Footer />
      </>
    )

  if (!data) return null

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <PageHeader
          eyebrow="Model Transparency"
          title="Performance Ledger"
          desc="Honest numbers only: leakage-audited 5-fold out-of-fold metrics on the Bank of India dataset (2,116 features, F3912 and F2230 excluded)."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="AUC-ROC" value={data.auc_roc} decimals={3} accent />
          <Stat label="Precision" value={data.precision} decimals={3} />
          <Stat label="Recall" value={data.recall} decimals={3} />
          <Stat label="F1-Score" value={data.f1} decimals={3} accent />
        </div>

        <div className="mt-6 glass p-6">
          <RocPrChart roc={data.roc_curve} pr={data.pr_curve} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="glass p-6">
            <h2 className="mb-4 text-xs font-semibold tracking-wide text-mist uppercase">Confusion Matrix · th 0.20</h2>
            <ConfusionBlock matrix={data.confusion_matrix} />
          </div>
          <div className="glass p-6">
            <h2 className="mb-4 text-xs font-semibold tracking-wide text-mist uppercase">Verification</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/[0.06] pb-3">
                <dt className="text-mist">Accuracy</dt>
                <dd className="font-semibold text-paper">{(data.accuracy * 100).toFixed(2)}%</dd>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-3">
                <dt className="text-mist">Positive class</dt>
                <dd className="font-semibold text-paper">81 / 9,082 (0.89%)</dd>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-3">
                <dt className="text-mist">Cross-validation</dt>
                <dd className="font-semibold text-paper">5-fold, out-of-fold</dd>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-3">
                <dt className="text-mist">Threshold</dt>
                <dd className="font-semibold text-paper">F1-optimal = 0.20</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mist">Leakage audit</dt>
                <dd className="font-semibold text-emerald-300">F3912 · F2230 excluded ✓</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}