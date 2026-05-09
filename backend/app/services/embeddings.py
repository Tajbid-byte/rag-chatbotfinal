# Lazy loaded - only imports when first used
_instance = None

class EmbeddingService:
    def __init__(self):
        print("Loading embeddings model (first request)...")
        from langchain_community.embeddings import HuggingFaceEmbeddings
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )
        print("Embeddings ready!")

    def get_embeddings(self):
        return self.embeddings

def get_embedding_service():
    global _instance
    if _instance is None:
        _instance = EmbeddingService()
    return _instance
