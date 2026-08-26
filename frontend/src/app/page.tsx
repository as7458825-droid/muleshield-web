"use client"

import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RiskBadge from "@/components/RiskBadge"

const scanRows = [
  { time: "14:02:11", acc: "ACC-3187", type: "IMPS OUT", amount: "₹9,40,000", risk: "Critical", score: 0.83 },
  { time: "14:01:47", acc: "ACC-1996", type: "NEFT IN", amount: "₹12,00,000", risk: "Critical", score: 0.94 },
  { time: "14:01:22", acc: "ACC-7742", type: "UPI IN", amount: "₹24,500", risk: "Medium", score: 0.29 },
  { time: "14:00:58", acc: "ACC-2380", type: "RTGS OUT", amount: "₹6,10,000", risk: "High", score: 0.61 },
  { time: "14:00:31", acc: "ACC-5521", type: "IMPS IN", amount: "₹8,200", risk: "Low", score: 0.08 },
  { time: "14:00:04", acc: "ACC-9044", type: "NEFT OUT", amount: "₹45,000", risk: "Low", score: 0.12 },
]

const features = [
  { n: "01", title: "Account Screening", desc: "Per-account risk verdict in under a second, with per-model scores.", href: "/dashboard" },
  { n: "02", title: "Bulk CSV Screening", desc: "Upload a full dataset — every account scored in one pass.", href: "/bulk" },
  { n: "03", title: "Model Performance", desc: "ROC / PR curves and confusion matrix from out-of-fold predictions.", href: "/performance" },
  { n: "04", title: "SHAP Explainability", desc: "Feature-level reasons for every flag. Defensible in audit.", href: "/shap" },
  { n: "05", title: "Fund-Flow Graph", desc: "Money movement across accounts, branches and banks.", href: "/graph" },
  { n: "06", title: "STR Filing", desc: "One-click Suspicious Transaction Report. PMLA Rule 8 format.", href: "/str" },
  { n: "07", title: "Anomaly Lab", desc: "Unsupervised contrastive layer outside the labelled set.", href: "/contrastive" },
  { n: "08", title: "Live Feeds & Compliance", desc: "Streaming alerts with RBI / PMLA alignment tracking.", href: "/live-feeds" },
  { n: "09", title: "Cost-Benefit & Case Story", desc: "714% ROI economics; GenAI officer-ready case narrative.", href: "/cost-benefit" },
]

const metrics = [
  { label: "ROC-AUC", value: "0.9913" },
  { label: "Avg Precision", value: "0.9365" },
  { label: "Recall @ F1-opt", value: "91.4%" },
  { label: "Accounts screened", value: "9,082" },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
            <p className="tick-mark text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
              CyberShield 2026 · Bank of India × IIT Hyderabad
            </p>
            <h1 className="mt-5 max-w-3xl text-[38px] font-semibold leading-[1.08] tracking-[-0.03em] text-paper md:text-[56px]">
              Mule accounts, intercepted
              <br />
              <span className="text-mist">before the money moves.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-mist">
              A leakage-audited ML ensemble screens every account against 2,116 behavioural features,
              explains each verdict with SHAP, and files regulator-ready STRs — built on the real
              Bank of India dataset.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn-primary">
                Open Screening Desk
                <span aria-hidden>→</span>
              </Link>
              <Link href="/performance" className="btn-ghost">
                View Performance Ledger
              </Link>
            </div>

            {/* Metrics strip */}
            <div className="glass mt-14 grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
              {metrics.map((m) => (
                <div key={m.label} className="border-line px-5 py-5 odd:border-r md:border-r md:last:border-r-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">{m.label}</p>
                  <p className="tick-mark mt-1.5 text-2xl font-semibold text-paper">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live feed */}
        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-paper">Surveillance Feed</h2>
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
              <span className="status-dot bg-safe pulse-glow" /> Live · sync 6s
            </span>
          </div>
          <div className="glass overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="hairline-b text-left text-[10px] uppercase tracking-[0.14em] text-faint">
                  <th className="px-4 py-2.5 font-semibold">Time</th>
                  <th className="px-4 py-2.5 font-semibold">Account</th>
                  <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Channel</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Amount</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {scanRows.map((r) => (
                  <tr key={r.acc} className="border-b border-line-soft last:border-0 hover:bg-raised">
                    <td className="tick-mark px-4 py-2.5 text-xs text-faint">{r.time}</td>
                    <td className="tick-mark px-4 py-2.5 font-medium text-paper">{r.acc}</td>
                    <td className="hidden px-4 py-2.5 text-mist sm:table-cell">{r.type}</td>
                    <td className="tick-mark px-4 py-2.5 text-right text-paper">{r.amount}</td>
                    <td className="px-4 py-2.5 text-right">
                      <RiskBadge level={r.risk} score={r.score} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Feature index */}
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-paper">Platform Modules</h2>
            <span className="eyebrow">09 modules</span>
          </div>
          <div className="glass divide-y divide-line-soft overflow-hidden">
            {features.map((f) => (
              <Link
                key={f.n}
                href={f.href}
                className="group flex items-center gap-5 px-5 py-4 transition-colors hover:bg-raised"
              >
                <span className="tick-mark w-8 shrink-0 text-xs text-faint">{f.n}</span>
                <div className="min-w-0 flex-1 md:flex md:items-baseline md:justify-between md:gap-8">
                  <h3 className="shrink-0 text-sm font-semibold text-paper group-hover:text-gold">{f.title}</h3>
                  <p className="truncate text-[13px] text-mist">{f.desc}</p>
                </div>
                <span aria-hidden className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-gold">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}