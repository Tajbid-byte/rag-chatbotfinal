import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    MAX_FILE_SIZE: int = 10 * 1024 * 1024
    CHUNK_SIZE: int = 800        # ✅ smaller chunks = better matches
    CHUNK_OVERLAP: int = 150

    SIMILARITY_TOP_K: int = 6            # ✅ retrieve more candidates
    SIMILARITY_THRESHOLD: float = 10.0   # ✅ FIX: was 1.5 — FAISS L2 scores
                                         # range 0-∞, NOT 0-1. 1.5 rejected
                                         # almost everything! 10.0 keeps all.
    TEMPERATURE: float = 0.3             # ✅ lower = more factual answers
    MAX_TOKENS: int = 1024
    MAX_CHAT_HISTORY: int = 10

settings = Settings()
