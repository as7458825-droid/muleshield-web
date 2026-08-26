from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class FreezeRequest(BaseModel):
    account_number: str

frozen_accounts: set[str] = set()

@router.post("")
def freeze_account(req: FreezeRequest):
    if not req.account_number.strip():
        raise HTTPException(400, "Account number required")
    frozen_accounts.add(req.account_number)
    return {
        "status": "frozen",
        "account_number": req.account_number,
        "message": f"Account {req.account_number} frozen successfully",
        "timestamp": __import__("datetime").datetime.now().isoformat(),
    }

@router.get("/status/{account_number}")
def freeze_status(account_number: str):
    return {
        "account_number": account_number,
        "is_frozen": account_number in frozen_accounts,
    }
