"""Map demo account numbers to REAL rows from the BOI dataset.

Lets the prototype demo show genuine model output (risk, SHAP, freeze flow)
on real feature vectors — a real mule and a real legitimate account.

Data sources (first available wins):
  1. Full dataset:      ../../../../mule/data/DataSet.csv        (local dev)
  2. Bundled demo rows: ../../data/demo_rows.csv                 (deployed)
"""
import json
import os

import numpy as np
import pandas as pd

_APP_UTILS = os.path.dirname(__file__)
_FULL_DATA = os.path.join(_APP_UTILS, "..", "..", "..", "..", "mule", "data", "DataSet.csv")
_DEMO_ROWS = os.path.join(_APP_UTILS, "..", "..", "data", "demo_rows.csv")
_FEATURES_JSON = os.path.join(
    os.path.dirname(_APP_UTILS), "..", "models", "final_features.json"
)

_cache = None


def _load():
    global _cache
    if _cache is not None:
        return _cache
    features = json.load(open(_FEATURES_JSON))
    if os.path.exists(_FULL_DATA):
        df = pd.read_csv(_FULL_DATA, low_memory=False)
        X = df[features].apply(pd.to_numeric, errors="coerce").fillna(0).astype(float).values
        y = df["F3924"].astype(int).values
        legit_idx = np.where(y == 0)[0]
        mule_idx = np.where(y == 1)[0]
        demo = {
            "LEGIT001": legit_idx[0],
            "MULE001": mule_idx[0],
            "MULE002": mule_idx[1],
        }
    else:
        df = pd.read_csv(_DEMO_ROWS, low_memory=False)
        X = df[features].apply(pd.to_numeric, errors="coerce").fillna(0).astype(float).values
        y = df["F3924"].astype(int).values
        demo = {"LEGIT001": 0, "MULE001": 1, "MULE002": 2}
    _cache = (features, X, y, demo)
    return _cache


def get_row(account_number):
    """Return (feature_names, row_vector) if account is a demo account, else None."""
    features, X, _, demo = _load()
    idx = demo.get(account_number)
    if idx is None:
        return None
    return features, X[idx : idx + 1]


def is_demo(account_number: str) -> bool:
    _, _, _, demo = _load()
    return account_number in demo


def demo_label(account_number: str) -> str:
    if account_number == "LEGIT001":
        return "LEGIT CONTROL ACCOUNT"
    if account_number in ("MULE001", "MULE002"):
        return "CONFIRMED MULE (DATASET)"
    return account_number