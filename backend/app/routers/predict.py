import numpy as np
import shap
from fastapi import APIRouter, HTTPException
from app.schemas.requests import PredictRequest
from app.models.loader import get_models, validate_features, get_feature_names
from app.utils.features import get_top_features
from app.utils.demo_accounts import get_row, is_demo, demo_label

router = APIRouter()

@router.post("")
def predict(req: PredictRequest):
    models = get_models()
    if not models:
        raise HTTPException(503, "Models not loaded")

    demo = get_row(req.account_number)
    if demo is not None:
        feats, row = demo
        X = validate_features(dict(zip(feats, row[0].tolist())))
    else:
        X = validate_features(req.features)
    results = {}

    if "xgboost" in models:
        try:
            proba = models["xgboost"].predict_proba(X)[0]
            results["xgboost"] = round(float(proba[1]), 4)
        except Exception as e:
            results["xgboost"] = 0.5

    if "random_forest" in models:
        try:
            proba = models["random_forest"].predict_proba(X)[0]
            results["random_forest"] = round(float(proba[1]), 4)
        except Exception as e:
            results["random_forest"] = 0.5

    if "isolation_forest" in models:
        try:
            score = models["isolation_forest"].score_samples(X)[0]
            results["isolation_forest"] = round(float(1.0 / (1.0 + np.exp(-score))), 4)
        except Exception as e:
            results["isolation_forest"] = 0.5

    scores = list(results.values())
    avg_score = float(np.mean(scores)) if scores else 0.0

    level = "Low"
    if avg_score > 0.6:
        level = "Critical"
    elif avg_score > 0.4:
        level = "High"
    elif avg_score > 0.2:
        level = "Medium"

    top_features = []
    if "xgboost" in models:
        try:
            explainer = shap.TreeExplainer(models["xgboost"])
            shap_vals = explainer.shap_values(X)
            fnames = get_feature_names() or []
            if isinstance(shap_vals, list):
                shap_vals = shap_vals[1] if len(shap_vals) > 1 else shap_vals[0]
            top_features = get_top_features(np.array(shap_vals), fnames)
        except Exception:
            pass

    return {
        "account_number": req.account_number,
        "risk_score": round(avg_score, 4),
        "risk_level": level,
        "model_scores": results,
        "top_features": top_features,
        "demo_label": demo_label(req.account_number) if is_demo(req.account_number) else None,
    }
