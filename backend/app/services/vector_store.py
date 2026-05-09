from typing import List, Dict, Optional

class VectorStoreService:
    def __init__(self):
        self.vector_store = None
        self.document_registry: Dict[str, dict] = {}

    def _embeddings(self):
        from app.services.embeddings import get_embedding_service
        return get_embedding_service().get_embeddings()

    def add_documents(self, documents: list, doc_id: str, filename: str) -> int:
        from langchain_community.vectorstores import FAISS
        if self.vector_store is None:
            self.vector_store = FAISS.from_documents(documents, self._embeddings())
        else:
            new_store = FAISS.from_documents(documents, self._embeddings())
            self.vector_store.merge_from(new_store)
        self.document_registry[doc_id] = {
            "doc_id": doc_id, "filename": filename, "chunk_count": len(documents)
        }
        return len(documents)

    def similarity_search(self, query: str, k: int = 4) -> list:
        if self.vector_store is None:
            return []
        return self.vector_store.similarity_search_with_score(query, k=k)

    def get_documents(self) -> list:
        return list(self.document_registry.values())

    def has_documents(self) -> bool:
        return self.vector_store is not None

    def delete_document(self, doc_id: str) -> bool:
        if doc_id in self.document_registry:
            del self.document_registry[doc_id]
            if not self.document_registry:
                self.vector_store = None
            return True
        return False

    def clear_store(self):
        self.vector_store = None
        self.document_registry = {}

vector_store_service = VectorStoreService()
