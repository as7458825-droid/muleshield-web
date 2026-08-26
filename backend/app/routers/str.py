from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from app.schemas.requests import StrRequest
from app.utils.str_report import generate_str_pdf

router = APIRouter()

@router.post("")
def generate_str(req: StrRequest):
    try:
        pdf = generate_str_pdf(
            account=req.account_number,
            branch=req.branch,
            officer=req.officer_name,
            risk_score=0.72,
            risk_level="High",
        )
        return Response(
            content=pdf.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="STR_{req.account_number}.pdf"'},
        )
    except Exception as e:
        raise HTTPException(500, f"PDF generation failed: {e}")
