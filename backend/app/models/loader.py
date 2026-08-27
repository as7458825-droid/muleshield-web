import os
import json
import joblib
import numpy as np

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "models")
REPORTS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "mule", "reports")
_model_cache = {}

def load_model(name: str):
    if name not in _model_cache:
        path = os.path.join(MODELS_DIR, f"{name}.joblib")
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model not found: {path}")
        _model_cache[name] = joblib.load(path)
    return _model_cache[name]

def get_models():
    models = {}
    for m in ["xgboost", "random_forest", "isolation_forest"]:
        try:
            models[m] = load_model(m)
        except FileNotFoundError:
            continue
    return models

def get_contrastive_models():
    models = {}
    for m in ["contrastive_iforest", "autoencoder", "lof", "contrastive_scaler"]:
        try:
            models[m] = load_model(m)
        except FileNotFoundError:
            continue
    return models

def get_feature_names() -> list[str]:
    m = _model_cache.get("xgboost")
    if m is not None:
        return m.get_booster().feature_names
    m = _model_cache.get("random_forest")
    if m is not None:
        return list(m.feature_names_in_)
    return []

_SELECTED_CACHE = None

def get_selected_features() -> list[str]:
    global _SELECTED_CACHE
    if _SELECTED_CACHE is None:
        for json_path in [
            os.path.join(MODELS_DIR, "final_features.json"),
            os.path.join(REPORTS_DIR, "final_features.json"),
        ]:
            if os.path.exists(json_path):
                with open(json_path) as f:
                    _SELECTED_CACHE = json.load(f)
                break
        if _SELECTED_CACHE is None:
            m = _model_cache.get("xgboost")
            if m is not None:
                _SELECTED_CACHE = m.get_booster().feature_names
            else:
                _SELECTED_CACHE = []
    return _SELECTED_CACHE

SELECTED_FEATURES = get_selected_features()

def validate_features(features: dict) -> np.ndarray:
    arr = np.zeros((1, len(SELECTED_FEATURES)))
    for i, name in enumerate(SELECTED_FEATURES):
        arr[0, i] = features.get(name, 0.0)
    return arr

FEATURE_DESC = {}

def get_feature_descriptions() -> dict:
    """Return feature descriptions if available, otherwise empty dict."""
    return FEATURE_DESC