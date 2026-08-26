"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"

const rows = [
  { label: "Manual Review Cost (bank-year)", value: "₹2.50 Cr", tone: "text-alert" },
  { label: "MuleShield Deployment Cost", value: "₹0.35 Cr", tone: "text-safe" },
  { label: "Avg. Prevention per Case", value: "₹8.2 L", tone: "text-gold" },
  { label: "Review Time Reduction", value: ">90%", tone: "text-safe" },
  { label: "Estimated ROI", value: "714%", tone: "text-gold" },
]

export default function CostBenefitPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageHeader
          eyebrow="Economics"
          title="Cost-Benefit Analysis"
          desc="The case for deployment: what automated, explainable screening saves versus manual investigation workflows."
        />

        <div className="mt-8 space-y-2.5">
          {rows.map((r, i) => (
            <div key={r.label} className="glass glass-hover flex items-center justify-between px-5 py-4">
              <span className="text-sm font-medium text-mist">
                <span className="mr-3 text-faint">{String(i + 1).padStart(2, "0")}</span>
                {r.label}
              </span>
              <span className={`tick-mark font-display text-xl font-bold ${r.tone}`}>{r.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 glass p-6">
          <h2 className="eyebrow">Where the savings come from</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-mist">
            <li>▸ Alert review 3.5 days → 40 seconds per case</li>
            <li>▸ Explainability eliminates rejected-freeze rework</li>
            <li>▸ STR filing automated → 0 compliance backlog</li>
            <li>▸ Fewer false positives → investigators chase real mules</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}