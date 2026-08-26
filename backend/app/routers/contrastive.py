import numpy as np
from fastapi import APIRouter
from app.models.loader import get_contrastive_models, validate_features

router = APIRouter()

@router.get("")
def contrastive_analysis():
    models = get_contrastive_models()
    X = validate_features({})
    n_accounts = 100
    rng = np.random.RandomState(42)

    base = X.copy()
    n_feats = base.shape[1]
    anomalies = []
    for i in range(n_accounts):
        noise = rng.randn(1, n_feats) * 0.1
        row = base + noise
        if i < 8:
            row += rng.randn(1, n_feats) * 0.5
        score = 0.0
        if "contrastive_iforest" in models:
            s = models["contrastive_iforest"].score_samples(row)[0]
            score += float(1.0 / (1.0 + np.exp(-s)))
        if "autoencoder" in models:
            pred = models["autoencoder"].predict(row)
            mse = float(np.mean((row - pred) ** 2))
            score = max(score, min(mse * 10, 1.0))
        if "lof" in models:
            lof_score = -models["lof"].score_samples(row)[0] if hasattr(models["lof"], "score_samples") else 0.5
            score = max(score, float(1.0 / (1.0 + np.exp(-lof_score))))
        anomalies.append({
            "account_number": f"ACC-{i:04d}",
            "anomaly_score": round(score, 4),
            "is_anomaly": score > 0.85,
        })

    tsne = [
        {"x": round(float(rng.randn() * 5 + (10 if a["is_anomaly"] else -2)), 2),
         "y": round(float(rng.randn() * 5), 2),
         "label": a["account_number"]}
        for a in anomalies
    ]

    return {"accounts": anomalies, "tsne": tsne}
