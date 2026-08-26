"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function GenAIPage() {
  const [account, setAccount] = useState("")
  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState("")
  const [error, setError] = useState("")

  const generate = async () => {
    if (!account.trim()) return
    setLoading(true)
    setError("")
    setStory("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/genai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: account }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(err.detail || `API error: ${res.status}`)
      }
      const data = await res.json()
      setStory(data.story)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageHeader
          eyebrow="GenAI"
          title="Case Narrative"
          desc="A plain-language story of the evidence trail for senior review — drafted from the same features that drove the verdict."
        />

        <div className="mt-8 flex gap-3">
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="Account number"
            className="input-modern flex-1"
            aria-label="Account number"
          />
          <button onClick={generate} disabled={loading} className="btn-primary">
            {loading ? "Drafting…" : "Generate"}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}
        {loading && <LoadingSpinner text="Drafting case narrative…" />}

        {story && (
          <div className="reveal mt-8 glass p-6">
            <p className="eyebrow mb-4">Case Narrative · {account}</p>
            <div className="whitespace-pre-line text-[14px] leading-relaxed text-mist">{story}</div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}