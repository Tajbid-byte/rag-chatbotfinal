import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.utils.pdf_processor import PDFProcessor
from app.services.vector_store import vector_store_service
from app.config import settings

router = APIRouter()
pdf_processor = PDFProcessor()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds 10MB limit")

    try:
        doc_id = str(uuid.uuid4())
        chunks = pdf_processor.process_pdf(file_bytes, file.filename)
        count = vector_store_service.add_documents(chunks, doc_id, file.filename)
        return JSONResponse(status_code=200, content={
            "success": True,
            "message": f"Processed {file.filename}",
            "doc_id": doc_id,
            "filename": file.filename,
            "chunks_created": count,
            "file_size_bytes": len(file_bytes)
        })
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process: {str(e)}")

@router.get("/list")
async def list_documents():
    docs = vector_store_service.get_documents()
    return {"documents": docs, "count": len(docs)}

@router.delete("/clear/all")
async def clear_all():
    vector_store_service.clear_store()
    return {"message": "All documents cleared"}

@router.delete("/{doc_id}")
async def delete_document(doc_id: str):
    if not vector_store_service.delete_document(doc_id):
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Deleted"}
