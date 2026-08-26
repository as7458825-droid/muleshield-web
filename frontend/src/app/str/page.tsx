"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"

export default function StrPage() {
  const [account, setAccount] = useState("")
  const [branch, setBranch] = useState("")
  const [officer, setOfficer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const generate = async () => {
    if (!account || !branch || !officer) return
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/str`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: account, branch, officer_name: officer }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(err.detail || `API error: ${res.status}`)
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `STR_${account}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      setSuccess("STR filed — PDF downloaded. Rule 8 of PMLA 2002 satisfied.")
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const filled = account.trim() && branch.trim() && officer.trim()

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <PageHeader
          eyebrow="Regulatory"
          title="STR Filing Desk"
          desc="Suspicious Transaction Report under Rule 8 of the Prevention of Money Laundering Act, 2002. FIU-IND ready, generated in seconds."
        />

        <div className="mt-8 glass p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="acc" className="eyebrow block">Account Number</label>
              <input
                id="acc"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="e.g. TEST001"
                className="input-modern mt-2"
              />
            </div>
            <div>
              <label htmlFor="branch" className="eyebrow block">Branch</label>
              <input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Kannauj Main"
                className="input-modern mt-2"
              />
            </div>
            <div>
              <label htmlFor="officer" className="eyebrow block">Reviewing Officer</label>
              <input
                id="officer"
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
                placeholder="e.g. Ayush Kumar"
                className="input-modern mt-2"
              />
            </div>
            <button onClick={generate} disabled={loading || !filled} className="btn-primary w-full">
              {loading ? "Assembling report…" : "Download STR PDF"}
            </button>
            {error && (
              <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                ✓ {success}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 glass p-5">
          <p className="eyebrow">What the report contains</p>
          <ul className="mt-3 space-y-1.5 text-[13px] text-mist">
            <li>▸ Account holder & identifiers</li>
            <li>▸ Risk score, level & mule classification</li>
            <li>▸ Top SHAP-contributing features as reasons</li>
            <li>▸ Recommended action + reviewing officer</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}