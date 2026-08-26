export interface PredictRequest {
  account_number: string
  features: Record<string, number>
}

export interface PredictResponse {
  account_number: string
  risk_score: number
  risk_level: "Low" | "Medium" | "High" | "Critical"
  model_scores: {
    xgboost: number
    random_forest: number
    isolation_forest: number
  }
  top_features: { name: string; importance: number }[]
  demo_label?: string | null
}

export interface ShapResponse {
  account_number: string
  base_value: number
  prediction: number
  features: { name: string; value: number; shap_value: number }[]
  waterfall: { feature: string; contribution: number }[]
  demo_label?: string | null
}

export interface StrRequest {
  account_number: string
  branch: string
  officer_name: string
}

export interface GraphNode {
  id: string
  label: string
  type: "account" | "branch" | "bank"
  risk_score?: number
}

export interface GraphEdge {
  source: string
  target: string
  amount: number
  date: string
}

export interface GraphResponse {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface ContrastiveResponse {
  accounts: {
    account_number: string
    anomaly_score: number
    is_anomaly: boolean
  }[]
  tsne: { x: number; y: number; label: string }[]
}

export interface PerformanceMetrics {
  accuracy: number
  precision: number
  recall: number
  f1: number
  auc_roc: number
  roc_curve: { fpr: number[]; tpr: number[] }
  pr_curve: { precision: number[]; recall: number[] }
  confusion_matrix: number[][]
}
