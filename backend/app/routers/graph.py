from fastapi import APIRouter

router = APIRouter()

@router.get("/{account_number}")
def graph_data(account_number: str):
    return {
        "nodes": [
            {"id": account_number, "label": f"Acc-{account_number[-4:]}", "type": "account", "risk_score": 0.82},
            {"id": "BR-001", "label": "Main Branch Mumbai", "type": "branch"},
            {"id": "ACC-002", "label": "Acc-8876", "type": "account", "risk_score": 0.45},
            {"id": "ACC-003", "label": "Acc-4432", "type": "account", "risk_score": 0.12},
            {"id": "ACC-004", "label": "Acc-2198", "type": "account", "risk_score": 0.73},
            {"id": "ACC-005", "label": "Acc-5510", "type": "account", "risk_score": 0.31},
            {"id": "BR-002", "label": "Delhi Branch", "type": "branch"},
            {"id": "EXT-BOI", "label": "Bank of India HQ", "type": "bank"},
        ],
        "edges": [
            {"source": account_number, "target": "ACC-002", "amount": 250000, "date": "2026-07-28"},
            {"source": "ACC-002", "target": "ACC-003", "amount": 150000, "date": "2026-07-27"},
            {"source": account_number, "target": "ACC-004", "amount": 500000, "date": "2026-07-26"},
            {"source": "ACC-004", "target": "ACC-005", "amount": 300000, "date": "2026-07-25"},
            {"source": "ACC-003", "target": "BR-001", "amount": 50000, "date": "2026-07-24"},
            {"source": "ACC-005", "target": "BR-002", "amount": 100000, "date": "2026-07-23"},
            {"source": "BR-001", "target": "EXT-BOI", "amount": 2000000, "date": "2026-07-22"},
        ],
    }
