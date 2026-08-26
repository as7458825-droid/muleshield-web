import numpy as np
from app.models.loader import SELECTED_FEATURES, FEATURE_DESC

def validate_features(features: dict) -> np.ndarray:
    arr = np.zeros((1, len(SELECTED_FEATURES)))
    for i, name in enumerate(SELECTED_FEATURES):
        arr[0, i] = features.get(name, 0.0)
    return arr

def get_top_features(shap_values: np.ndarray, feature_names: list[str], top_n: int = 10) -> list[dict]:
    abs_vals = np.abs(shap_values[0])
    indices = np.argsort(abs_vals)[::-1][:top_n]
    result = []
    for idx in indices:
        fname = feature_names[idx]
        display = FEATURE_DESC.get(fname, fname)
        result.append({
            "name": display,
            "code": fname,
            "importance": float(abs_vals[idx]),
            "shap_value": float(shap_values[0, idx]),
        })
    return result
