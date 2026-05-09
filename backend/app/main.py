from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, documents

app = FastAPI(
    title="RAG Chatbot API",
    description="AI-powered document chat using Groq LLM",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

@app.get("/")
async def root():
    return {"message": "RAG Chatbot API", "status": "healthy", "version": "2.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "api": "online"}
