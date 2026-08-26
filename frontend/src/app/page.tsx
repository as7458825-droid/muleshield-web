"use client"

import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Stat from "@/components/Stat"
import RiskBadge from "@/components/RiskBadge"

const scanAccounts = [
  { acc: "ACC-5521", risk: 0.08 },
  { acc: "ACC-3187", risk: 0.83 },
  { acc: "ACC-9044", risk: 0.12 },
  { acc: "ACC-7742", risk: 0.29 },
  { acc: "ACC-1996", risk: 0.94 },
  { acc: "ACC-6610", risk: 0.05 },
  { acc: "ACC-2380", risk: 0.61 },
  { acc: "ACC-4481", risk: 0.17 },
]

const features = [
  { title: "Account Screening", desc: "Search any account, get an auditable risk verdict in under a second.", href: "/dashboard", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Model Performance", desc: "ROC, PR curves and confusion matrix straight from real out-of-fold predictions.", href: "/performance", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { title: "SHAP Explainability", desc: "Feature-level reasons for every flag — defensible in audit and in court.", href: "/shap", icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 0l-6.632 3.316" },
  { title: "Fund-Flow Graph", desc: "Visualize money movement across accounts, branches and banks.", href: "/graph", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "STR Filing", desc: "One-click Suspicious Transaction Reports under PMLA 2002 Rule 8.", href: "/str", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { title: "Anomaly Lab", desc: "Unsupervised contrastive layer catching mule patterns outside the labelled set.", href: "/contrastive", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { title: "Live Feeds", desc: "Real-time transaction alerts as they stream through the system.", href: "/live-feeds", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Compliance", desc: "IBA / RBI alignment dashboard for the compliance desk.", href: "/compliance", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "Cost-Benefit", desc: "Deployment economics: 714% ROI over manual investigation.", href: "/cost-benefit", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 55% 45% at 15% 5%, rgba(99,102,241,0.25), transparent), radial-gradient(ellipse 45% 40% at 85% 15%, rgba(34,211,238,0.18), transparent), radial-gradient(ellipse 40% 35% at 50% 90%, rgba(139,92,246,0.12), transparent)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-300">
                CyberShield 2026 · Bank of India × IIT Hyderabad
              </span>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-paper md:text-6xl">
                Mule accounts,
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  intercepted in seconds.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-mist">
                An explainable AI system that flags money-mule accounts before the money moves.
                Leakage-audited features, cost-sensitive XGBoost, and automated STR filing —
                built for Indian banking.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/dashboard" className="btn-primary">
                  Launch Screening Desk
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/performance" className="btn-ghost">
                  View Model Performance
                </Link>
              </div>
            </div>

            <div className="mt-16 glass overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
                <span className="text-xs font-semibold tracking-wide text-mist uppercase">Live surveillance feed</span>
                <span className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <span className="status-dot bg-emerald-400 pulse-glow" /> Monitoring
                </span>
              </div>
              <div className="relative px-5 py-5">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 scan-sweep bg-gradient-to-r from-transparent via-indigo-400/[0.07] to-transparent" />
                <div className="grid gap-2.5 md:grid-cols-2">
                  {scanAccounts.map((a) => (
                    <div key={a.acc} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
                      <span className="text-sm font-medium text-mist">{a.acc}</span>
                      <RiskBadge
                        level={a.risk > 0.6 ? "Critical" : a.risk > 0.4 ? "High" : a.risk > 0.2 ? "Medium" : "Low"}
                        score={a.risk}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="AUC-ROC" value={0.9913} decimals={3} accent />
            <Stat label="Average Precision" value={0.9365} decimals={3} accent />
            <Stat label="Recall @ F1-opt" value={0.9136} decimals={3} accent />
            <Stat label="Features audited" value={2116} />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <p className="eyebrow">The Platform</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-paper md:text-3xl">
            One system, detection to filing
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Link key={f.href} href={f.href} className="glass glass-hover group p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 text-indigo-300 transition-colors group-hover:text-cyan-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-paper group-hover:text-indigo-300">{f.title}</h3>
                <p className="mt-1.5 text-sm text-mist">{f.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Open <span aria-hidden>→</span>
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