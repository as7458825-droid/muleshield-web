import json
import os
from fastapi import APIRouter

router = APIRouter()

_CURVES_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "curves_data.json")

def _load_curves():
    try:
        with open(_CURVES_PATH) as f:
            return json.load(f)
    except Exception:
        return {
            "fpr": [0.0, 1.0], "tpr": [0.0, 1.0],
            "pr_precision": [0.009, 1.0], "pr_recall": [1.0, 0.0],
        }

@router.get("")
def performance_metrics():
    c = _load_curves()
    return {
        "accuracy": 0.9983,
        "precision": 0.9024,
        "recall": 0.9136,
        "f1": 0.9080,
        "auc_roc": 0.9913,
        "average_precision": 0.9365,
        "leakage_notes": "F3912 (corr 0.969) and F2230 (month cohort) excluded; 2116 features; 5-fold OOF",
        "roc_curve": {
            "fpr": c["fpr"],
            "tpr": c["tpr"],
        },
        "pr_curve": {
            "precision": c["pr_precision"],
            "recall": c["pr_recall"],
        },
        "confusion_matrix": [[8993, 8], [7, 74]],
    }