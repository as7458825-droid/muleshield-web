"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"

const checks = [
  { label: "KYC Compliance", status: "PASS", desc: "All flagged accounts have valid KYC documentation.", tone: "text-safe border-safe/40 bg-safe/5" },
  { label: "Transaction Limits", status: "PASS", desc: "No account exceeds RBI-prescribed transaction limits.", tone: "text-safe border-safe/40 bg-safe/5" },
  { label: "PEP Screening", status: "PASS", desc: "All flagged accounts screened against PEP lists.", tone: "text-safe border-safe/40 bg-safe/5" },
  { label: "Beneficiary Verification", status: "WARN", desc: "3 accounts have unverified beneficiaries — flagged for follow-up.", tone: "text-warn border-warn/40 bg-warn/5" },
  { label: "STR Timeliness", status: "PASS", desc: "All STRs filed within the 7-day regulatory window.", tone: "text-safe border-safe/40 bg-safe/5" },
  { label: "E-KYC Status", status: "PASS", desc: "100% e-KYC compliance across flagged accounts.", tone: "text-safe border-safe/40 bg-safe/5" },
]

const instruments = [
  "PMLA 2002 — RULE 8 (STR)",
  "RBI KYC MASTER DIRECTION 2023",
  "IBA GUIDELINES ON FRAUD PREVENTION",
  "FIU-IND REPORTING FORMATS",
]

export default function CompliancePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <PageHeader
          eyebrow="Regulatory"
          title="Compliance Dashboard"
          desc="Alignment status against the instruments a branch compliance desk actually answers to."
        />

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {checks.map((c) => (
            <div key={c.label} className={`glass p-5 ${c.tone}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-paper">{c.label}</h3>
                <span className="text-xs font-bold tracking-[0.18em]">{c.status}</span>
              </div>
              <p className="mt-1.5 text-sm text-mist">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 glass p-6">
          <h2 className="eyebrow">Instruments covered</h2>
          <ul className="mt-4 space-y-2">
            {instruments.map((ins) => (
              <li key={ins} className="flex items-center gap-3 text-sm text-mist">
                <span className="text-indigo-300">▸</span> {ins}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}