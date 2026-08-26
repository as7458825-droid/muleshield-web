const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `API error: ${res.status}`)
  }
  return res.json()
}

export const api = {
  predict: (data: Record<string, number>) =>
    fetchAPI<import("./types").PredictResponse>("/predict", {
      method: "POST",
      body: JSON.stringify({ features: data }),
    }),

  shap: (accountNumber: string) =>
    fetchAPI<import("./types").ShapResponse>(`/shap/${accountNumber}`),

  str: (data: import("./types").StrRequest) =>
    fetchAPI<Blob>("/str", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      const url = window.URL.createObjectURL(res)
      const a = document.createElement("a")
      a.href = url
      a.download = `STR_${data.account_number}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    }),

  graph: (accountNumber: string) =>
    fetchAPI<import("./types").GraphResponse>(`/graph/${accountNumber}`),

  contrastive: () =>
    fetchAPI<import("./types").ContrastiveResponse>("/contrastive"),

  performance: () =>
    fetchAPI<import("./types").PerformanceMetrics>("/performance"),
}
