from fastapi import APIRouter
import random
from datetime import datetime, timedelta

router = APIRouter()

ACCOUNTS = ["ACC-1001", "ACC-1002", "ACC-1003", "ACC-2001", "ACC-3001",
            "ACC-4001", "ACC-5001", "ACC-6102", "ACC-7221", "ACC-8340"]
TYPES = ["IMPS", "NEFT", "RTGS", "UPI", "Cash Deposit", "Cheque"]
RISKS = ["Low", "Low", "Medium", "High", "Critical"]
BRANCHES = ["Mumbai Main", "Delhi North", "Bengaluru", "Chennai", "Kolkata", "Pune", "Ahmedabad"]

@router.get("")
def live_feeds():
    feeds = []
    now = datetime.now()
    for i in range(8):
        ts = now - timedelta(minutes=random.randint(1, 120), seconds=random.randint(0, 59))
        feeds.append({
            "id": i + 1,
            "account": random.choice(ACCOUNTS),
            "amount": random.randint(1000, 500000),
            "type": random.choice(TYPES),
            "branch": random.choice(BRANCHES),
            "timestamp": ts.strftime("%Y-%m-%d %H:%M:%S"),
            "risk": random.choice(RISKS),
        })
    return feeds
