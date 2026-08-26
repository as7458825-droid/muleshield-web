import numpy as np
import shap
from fastapi import APIRouter, HTTPException
from app.models.loader import get_models, validate_features, get_feature_names, FEATURE_DESC
from app.utils.demo_accounts import get_row, is_demo, demo_label

router = APIRouter()

@router.get("/{account_number}")
def shap_explain(account_number: str):
    models = get_models()
    if "xgboost" not in models:
        raise HTTPException(503, "XGBoost model not available")

    model = models["xgboost"]
    demo = get_row(account_number)
    if demo is not None:
        feats, row = demo
        X = validate_features(dict(zip(feats, row[0].tolist())))
    else:
        X = validate_features({})

    try:
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X)
    except Exception as e:
        raise HTTPException(500, f"SHAP computation failed: {e}")

    if isinstance(shap_values, list):
        shap_vals = shap_values[1] if len(shap_values) > 1 else shap_values[0]
    else:
        shap_vals = shap_values

    fnames = get_feature_names() or []
    base_value = float(explainer.expected_value) if not isinstance(explainer.expected_value, (list, np.ndarray)) else float(explainer.expected_value[1] if len(explainer.expected_value) > 1 else explainer.expected_value[0])
    pred = float(model.predict_proba(X)[0][1])

    features_list = []
    for i, name in enumerate(fnames):
        display = FEATURE_DESC.get(name, name)
        features_list.append({
            "name": display,
            "code": name,
            "value": float(X[0, i]),
            "shap_value": round(float(shap_vals[0, i]), 6),
        })

    abs_vals = np.abs(shap_vals[0])
    top_idx = np.argsort(abs_vals)[::-1][:15]
    waterfall = []
    for idx in top_idx:
        display = FEATURE_DESC.get(fnames[idx], fnames[idx])
        waterfall.append({
            "feature": display,
            "contribution": round(float(shap_vals[0, idx]), 6),
        })

    return {
        "account_number": account_number,
        "base_value": round(base_value, 4),
        "prediction": round(pred, 4),
        "features": features_list[:20],
        "waterfall": waterfall,
        "demo_label": demo_label(account_number) if is_demo(account_number) else None,
    }
