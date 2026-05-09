import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.services.llm_service import llm_service
from app.services.vector_store import vector_store_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    sources: list
    session_id: str
    has_context: bool
    has_documents: bool

@router.post("/message", response_model=ChatResponse)
async def chat_message(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    session_id = request.session_id or str(uuid.uuid4())
    has_documents = vector_store_service.has_documents()

    try:
        result = llm_service.generate_response(
            query=request.message,
            session_id=session_id,
            use_context=has_documents
        )
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
            session_id=session_id,
            has_context=result["has_context"],
            has_documents=has_documents
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")

@router.delete("/history/{session_id}")
async def clear_history(session_id: str):
    llm_service.clear_history(session_id)
    return {"message": "History cleared"}

@router.get("/status")
async def status():
    return {
        "ready": True,
        "has_documents": vector_store_service.has_documents(),
        "document_count": len(vector_store_service.get_documents()),
        "model": "llama-3.1-70b-versatile"
    }
