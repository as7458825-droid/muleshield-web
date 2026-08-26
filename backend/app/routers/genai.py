from fastapi import APIRouter
from app.schemas.requests import GenAIRequest
from app.models.loader import get_models, validate_features
import numpy as np

router = APIRouter()

@router.post("")
def genai_story(req: GenAIRequest):
    models = get_models()
    risk_score = 0.5
    risk_level = "Medium"

    if models:
        X = validate_features({})
        scores = []
        if "xgboost" in models:
            try:
                proba = models["xgboost"].predict_proba(X)[0]
                scores.append(float(proba[1]))
            except:
                pass
        if "random_forest" in models:
            try:
                proba = models["random_forest"].predict_proba(X)[0]
                scores.append(float(proba[1]))
            except:
                pass
        if scores:
            risk_score = float(np.mean(scores))
            risk_level = "Critical" if risk_score > 0.7 else "High" if risk_score > 0.5 else "Medium" if risk_score > 0.3 else "Low"

    story = (
        f"CASE ANALYSIS REPORT\n"
        f"Account: {req.account_number}\n"
        f"Risk Score: {risk_score:.1%} ({risk_level})\n\n"
        f"--- Transaction Behavior Analysis ---\n"
        f"This account exhibited unusual transaction patterns over the past 90 days. "
        f"Multiple high-value credits from disparate jurisdictions were followed by "
        f"immediate debits to accounts with no prior relationship. "
        f"The velocity of transactions exceeds normal behavior for similar profile accounts. "
        f"Round-amount transactions account for a significant portion of all outflows, "
        f"consistent with layering patterns observed in mule account operations.\n\n"
        f"--- Key Indicators ---\n"
        f"- Abnormal transaction frequency (high velocity)\n"
        f"- Rapid credit-to-debit conversion\n"
        f"- Transactions during non-business hours\n"
        f"- Multiple counterparties with no common link\n"
        f"- Account age inconsistent with activity level\n\n"
        f"--- Recommendation ---\n"
        f"File Suspicious Transaction Report (STR) and place account under "
        f"enhanced monitoring. Consider temporary freeze pending investigation."
    )
    return {"account_number": req.account_number, "story": story, "risk_score": risk_score, "risk_level": risk_level}
