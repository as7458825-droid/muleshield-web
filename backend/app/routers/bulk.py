import io

import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.loader import get_models, SELECTED_FEATURES

router = APIRouter()

MAX_ROWS = 10000


def _score_level(avg: float) -> str:
    if avg > 0.6:
        return "Critical"
    if avg > 0.4:
        return "High"
    if avg > 0.2:
        return "Medium"
    return "Low"


@router.post("")
def bulk_predict(file: UploadFile = File(...)):
    """Score every row of an uploaded CSV against the trained ensemble.

    The CSV must contain the model's feature columns (F-prefixed names).
    An optional `account_number` column is used to label rows.
    """
    models = get_models()
    if not models:
        raise HTTPException(503, "Models not loaded")

    raw = file.file.read()
    try:
        df = pd.read_csv(io.BytesIO(raw), low_memory=False)
    except Exception as e:
        raise HTTPException(400, f"Could not parse CSV: {e}")

    if df.empty:
        raise HTTPException(400, "CSV is empty")

    present = [c for c in SELECTED_FEATURES if c in df.columns]
    missing = [c for c in SELECTED_FEATURES if c not in df.columns]
    if not present:
        raise HTTPException(
            400,
            f"No model features found in CSV. Expected columns like {SELECTED_FEATURES[:3]}... "
            f"(found {len(df.columns)} columns)",
        )

    if len(df) > MAX_ROWS:
        raise HTTPException(400, f"Too many rows: {len(df)} (max {MAX_ROWS})")

    X = df[present].apply(pd.to_numeric, errors="coerce").fillna(0).astype(float).values
    X_full = np.zeros((X.shape[0], len(SELECTED_FEATURES)))
    present_idx = [SELECTED_FEATURES.index(c) for c in present]
    X_full[:, present_idx] = X

    xgb_scores = rf_scores = iso_scores = None
    if "xgboost" in models:
        xgb_scores = models["xgboost"].predict_proba(X_full)[:, 1]
    if "random_forest" in models:
        rf_scores = models["random_forest"].predict_proba(X_full)[:, 1]
    if "isolation_forest" in models:
        iso = models["isolation_forest"].score_samples(X_full)
        iso_scores = 1.0 / (1.0 + np.exp(-iso))

    labels = df.get("account_number", df.get("Account_Number", df.get("ACC_NO", df.get("account"))))
    if labels is None:
        labels = df.index.astype(str).map(lambda i: f"ROW-{int(i) + 1:04d}")

    rows = []
    for i in range(len(df)):
        scores = {}
        if xgb_scores is not None:
            scores["xgboost"] = round(float(xgb_scores[i]), 4)
        if rf_scores is not None:
            scores["random_forest"] = round(float(rf_scores[i]), 4)
        if iso_scores is not None:
            scores["isolation_forest"] = round(float(iso_scores[i]), 4)
        avg = float(np.mean(list(scores.values()))) if scores else 0.0
        rows.append(
            {
                "account_number": str(labels.iloc[i]),
                "risk_score": round(avg, 4),
                "risk_level": _score_level(avg),
                "model_scores": scores,
            }
        )

    counts = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
    for r in rows:
        counts[r["risk_level"]] += 1

    return {
        "total": len(rows),
        "missing_features": missing,
        "summary": counts,
        "results": rows,
    }