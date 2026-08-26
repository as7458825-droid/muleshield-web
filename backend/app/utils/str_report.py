from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER
from io import BytesIO
from datetime import datetime

def generate_str_pdf(account: str, branch: str, officer: str, risk_score: float, risk_level: str) -> BytesIO:
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, topMargin=20*mm, bottomMargin=15*mm)
    styles = getSampleStyleSheet()

    story = []
    story.append(Paragraph("SUSPICIOUS TRANSACTION REPORT (STR)", styles["Title"]))
    story.append(Paragraph("Under Rule 8 of Prevention of Money Laundering Act, 2002", ParagraphStyle('sub', parent=styles['Normal'], fontSize=9, alignment=TA_CENTER, spaceAfter=6*mm)))
    story.append(Paragraph(f"Date: {datetime.now().strftime('%d-%m-%Y')}", styles["Normal"]))
    story.append(Spacer(1, 4*mm))

    data = [
        ["Field", "Value"],
        ["Account Number", account],
        ["Branch", branch],
        ["Reporting Officer", officer],
        ["Risk Score", f"{risk_score:.2%}"],
        ["Risk Level", risk_level],
        ["Classification", "SUSPECTED MULE ACCOUNT"],
        ["Recommendation", "Freeze & Investigate"],
    ]
    t = Table(data, colWidths=[80*mm, 80*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0B3D91")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BACKGROUND", (0, 1), (0, -1), colors.HexColor("#F5F6F8")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph("This report is generated automatically by MuleShield AI System.", styles["Normal"]))
    story.append(Paragraph("For official use only. Not for public distribution.", styles["Normal"]))
    story.append(Spacer(1, 5*mm))
    story.append(Paragraph(f"Digital Signature: MuleShield-{account}-{datetime.now().strftime('%Y%m%d%H%M%S')}", ParagraphStyle('sig', parent=styles['Normal'], fontSize=8, textColor=colors.grey)))
    doc.build(story)
    buf.seek(0)
    return buf
