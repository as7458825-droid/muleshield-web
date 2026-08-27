import io

import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException, UploadFile, File, Response
from app.models.loader import get_models, SELECTED_FEATURES, get_feature_descriptions

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


@router.get("/template")
def download_template():
    """Download a template CSV with all required feature columns."""
    # Create a template with all required features + account_number
    template_df = pd.DataFrame(columns=["account_number"] + SELECTED_FEATURES)
    
    # Add one example row with zeros
    example_row = {"account_number": "ACC-0001"}
    example_row.update({feat: 0.0 for feat in SELECTED_FEATURES})
    template_df = pd.concat([template_df, pd.DataFrame([example_row])], ignore_index=True)
    
    csv_buffer = io.StringIO()
    template_df.to_csv(csv_buffer, index=False)
    
    return Response(
        content=csv_buffer.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=muleshield_template.csv"}
    )


@router.get("/sample")
def download_sample():
    """Download a sample CSV with realistic example data."""
    # Load the real dataset to extract a few real rows
    try:
        from app.utils.demo_accounts import _load
        features, X, y, demo = _load()
        
        # Get indices for the demo accounts
        demo_indices = list(demo.values())
        sample_df = pd.DataFrame(X[demo_indices], columns=features)
        sample_df["account_number"] = [f"ACC-{i:04d}" for i in demo_indices]
        
        # Reorder columns: account_number first
        cols = ["account_number"] + list(features)
        sample_df = sample_df[cols]
    except Exception:
        # Fallback: create synthetic sample with zeros
        sample_df = pd.DataFrame(columns=["account_number"] + SELECTED_FEATURES)
        for i in range(5):
            row = {"account_number": f"ACC-{i:04d}"}
            row.update({feat: 0.0 for feat in SELECTED_FEATURES})
            sample_df = pd.concat([sample_df, pd.DataFrame([row])], ignore_index=True)
    
    csv_buffer = io.StringIO()
    sample_df.to_csv(csv_buffer, index=False)
    
    return Response(
        content=csv_buffer.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=muleshield_sample.csv"}
    )


@router.get("/features")
def list_features():
    """List all required feature columns with descriptions."""
    try:
        descriptions = get_feature_descriptions()
    except:
        descriptions = {}
    
    features_info = [
        {"name": feat, "description": descriptions.get(feat, "")}
        for feat in SELECTED_FEATURES
    ]
    
    return {
        "total_features": len(SELECTED_FEATURES),
        "features": features_info,
        "note": "CSV must contain all these columns (or at least a subset). Missing features will be filled with 0."
    }


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
    
    For the correct format, download the template from GET /bulk/template
    or see the feature list at GET /bulk/features
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
            f"CSV must contain at least some of the required {len(SELECTED_FEATURES)} feature columns (F1, F2, F3...). "
            f"Found {len(df.columns)} columns but none match the required feature format. "
            f"Download the template from GET /bulk/template or see required features at GET /bulk/features. "
            f"Current columns: {list(df.columns)[:10]}{'...' if len(df.columns) > 10 else ''}"
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
        "missing_features_count": len(missing),
        "missing_features": missing[:50],  # Limit to first 50
        "present_features_count": len(present),
        "summary": counts,
        "results": rows,
    }