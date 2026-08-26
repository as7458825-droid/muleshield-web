from pydantic import BaseModel
from typing import Optional

class PredictRequest(BaseModel):
    account_number: str
    features: dict[str, float]

class StrRequest(BaseModel):
    account_number: str
    branch: str
    officer_name: str

class GenAIRequest(BaseModel):
    account_number: str
