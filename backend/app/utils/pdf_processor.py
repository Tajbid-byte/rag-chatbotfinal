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
            separators=["\n\n", "\n", ".", " ", ""]
        )

    def process_pdf(self, file_bytes: bytes, filename: str) -> List:
        from pypdf import PdfReader
        from langchain_core.documents import Document

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as f:
            f.write(file_bytes)
            tmp_path = f.name

        try:
            reader = PdfReader(tmp_path)
            text = ""
            for i, page in enumerate(reader.pages, 1):
                page_text = page.extract_text()
                if page_text and page_text.strip():
                    text += f"\n\n[Page {i}]\n{page_text}"
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

        if not text.strip():
            raise ValueError("No text found in PDF. It may contain only images.")

        splitter = self._get_splitter()
        chunks = splitter.create_documents(
            texts=[text],
            metadatas=[{"filename": filename, "source": filename}]
        )
        print(f"Processed '{filename}': {len(chunks)} chunks")
        return chunks
