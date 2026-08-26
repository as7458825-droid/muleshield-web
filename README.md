# 🛡️ MuleShield

> **AI-Powered Hybrid Mule Account & Suspicious Transaction Detection System**
>
> CyberShield 2026 · Bank of India × IIT Hyderabad Hackathon — Problem Statement 2
> *Team MuleShield · Rajkiya Engineering College, Kannauj*

---

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-Ensemble-FF6600)
![License](https://img.shields.io/badge/License-MIT-green)

**MuleShield** detects money-mule accounts in real time using a leakage-audited ML ensemble, explains every verdict with SHAP, and files regulator-ready STRs — built on the **real Bank of India hackathon dataset** (9,082 accounts).

---

## 📊 Model Performance

| Metric | Score |
|--------|-------|
| ROC-AUC | **0.9913** |
| Average Precision | **0.9365** |
| Precision @ th 0.20 | 90.24% |
| Recall @ th 0.20 | 91.36% |
| F1-Score | **0.908** |
| Features (leakage-audited) | 2,116 |

*Out-of-fold results from 5-fold cross-validation on the real dataset.
Leaked features excluded & documented: F3912 (corr 0.969), F2230 (month cohort).*

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🔍 **Account Screening** | Real-time risk verdict per account with per-model scores |
| 📤 **Bulk CSV Screening** | Upload a dataset CSV → every account scored in one shot |
| 🧠 **SHAP Explainability** | Feature-level reasons behind every flag — audit-ready |
| 📈 **Performance Ledger** | ROC / PR curves + confusion matrix, honest numbers only |
| 🌐 **Fund-Flow Graph** | Force-directed money-movement network across accounts & branches |
| 📄 **STR Filing** | One-click Suspicious Transaction Report PDF (PMLA 2002, Rule 8) |
| ❄️ **Account Freeze** | Freeze high-risk accounts with persistent status |
| 🧪 **Anomaly Lab** | Unsupervised contrastive layer (Isolation Forest + Autoencoder) |
| 📡 **Live Feeds** | Streaming transaction alerts with risk badges |
| ⚖️ **Compliance Dashboard** | RBI / PMLA / DPDP alignment tracker |
| 💰 **Cost-Benefit** | Deployment economics — 714% ROI over manual review |
| 🤖 **GenAI Case Story** | Plain-language case narrative for senior officers |

---

## 🏗️ Architecture

```
┌─────────────────────────────┐        ┌──────────────────────────────────┐
│      FRONTEND (3000)         │  REST  │         BACKEND (8000)            │
│  Next.js 16 · TypeScript     │ ─────► │  FastAPI · Python                 │
│                              │  JSON  │                                    │
│  Dashboard · Bulk CSV        │        │  /predict   /shap    /bulk        │
│  SHAP · Graph · STR          │        │  /graph     /feeds   /genai       │
│  Feeds · Compliance          │        │  /freeze    /str     /contrastive │
└─────────────────────────────┘        └───────────────┬──────────────────┘
                                                        │
                                        ┌───────────────▼──────────────────┐
                                        │        ML ENSEMBLE                │
                                        │  XGBoost · Random Forest ·        │
                                        │  Isolation Forest + SHAP          │
                                        │  Trained on 2,116 audited         │
                                        │  features · 9,082 real accounts   │
                                        └───────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+, Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000
```

API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:3000`

### Demo Accounts (real dataset rows)

| Account | Verdict |
|---------|---------|
| `MULE001` / `MULE002` | 🔴 Critical (~0.80) — confirmed dataset mules |
| `LEGIT001` | 🟢 Low (0.15) — legitimate control account |

---

## 📁 Repository Structure

```
mule-website/
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── requirements.txt
│   ├── models/               # Trained model artifacts (.joblib)
│   └── app/
│       ├── routers/          # predict, bulk, shap, str, graph, feeds...
│       ├── utils/            # Feature handling, demo rows, STR generator
│       └── schemas/          # Pydantic request models
└── frontend/
    ├── src/app/              # Next.js pages (12 routes)
    ├── src/components/       # Navbar, RiskBadge, charts...
    └── src/lib/              # API client & types
```

---

## 🧪 Honest Engineering Notes

- **Leakage audit performed:** top correlated feature F3912 and month-cohort F2230 excluded after detection; max single-feature AUROC post-exclusion = 0.7426 → no residual leak
- **Contrastive layer reported honestly:** production scoring uses the supervised XGBoost; unsupervised consensus is a separate investigative feed
- **Threshold:** F1-optimal 0.20 chosen via out-of-fold precision-recall analysis

---

## 👥 Team

| Member | Role |
|--------|------|
| **Ayush Kumar** (Lead) | ML & GenAI, model integration |
| **Abhinav Sikarwar** | Data engineering, EDA, features |
| **Vinay Kushwaha** | Dashboard development |
| **Anubhav Upadhyay** | ML support, evaluation |

---

## 📄 License

MIT © Team MuleShield
