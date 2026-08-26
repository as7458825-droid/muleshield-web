from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict, shap, str, graph, contrastive, performance, feeds, genai, freeze, bulk

app = FastAPI(title="MuleShield API", version="2.0.0",
              description="AI-powered mule account detection backend",
              docs_url="/docs", redoc_url="/redoc")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(shap.router, prefix="/shap", tags=["Explainability (SHAP)"])
app.include_router(str.router, prefix="/str", tags=["STR PDF Report"])
app.include_router(graph.router, prefix="/graph", tags=["Network Graph"])
app.include_router(contrastive.router, prefix="/contrastive", tags=["Contrastive Learning"])
app.include_router(performance.router, prefix="/performance", tags=["Model Performance"])
app.include_router(feeds.router, prefix="/feeds", tags=["Live Feeds"])
app.include_router(genai.router, prefix="/genai", tags=["GenAI Case Story"])
app.include_router(freeze.router, prefix="/freeze", tags=["Freeze Account"])
app.include_router(bulk.router, prefix="/bulk", tags=["Bulk CSV Screening"])

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "version": "2.0.0", "message": "MuleShield API is running"}

@app.get("/", tags=["Root"])
def root():
    return {"app": "MuleShield API", "version": "2.0.0", "docs": "/docs"}
