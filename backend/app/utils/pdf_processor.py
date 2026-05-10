import os
import tempfile
from typing import List
from app.config import settings

class PDFProcessor:
    def _get_splitter(self):
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        return RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len,
            # ✅ Better separators - splits at paragraph/sentence boundaries
            separators=["\n\n", "\n", ". ", "! ", "? ", ", ", " ", ""]
        )

    def process_pdf(self, file_bytes: bytes, filename: str) -> List:
        from pypdf import PdfReader
        from langchain_core.documents import Document

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as f:
            f.write(file_bytes)
            tmp_path = f.name

        try:
            reader = PdfReader(tmp_path)
            pages_text = []
            for i, page in enumerate(reader.pages, 1):
                page_text = page.extract_text()
                if page_text and page_text.strip():
                    # ✅ Tag each page so we know where content came from
                    pages_text.append((i, page_text.strip()))
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

        if not pages_text:
            raise ValueError("No text found in PDF. It may be a scanned image PDF.")

        # ✅ FIX: Process each page separately so page numbers are accurate
        all_chunks = []
        splitter = self._get_splitter()

        for page_num, text in pages_text:
            chunks = splitter.create_documents(
                texts=[text],
                metadatas=[{
                    "filename": filename,
                    "source": filename,
                    "page": page_num
                }]
            )
            all_chunks.extend(chunks)

        print(f"Processed '{filename}': {len(pages_text)} pages → {len(all_chunks)} chunks")
        return all_chunks
