import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "llama-3.1-70b-versatile"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    SIMILARITY_TOP_K: int = 4
    SIMILARITY_THRESHOLD: float = 1.5
    TEMPERATURE: float = 0.7
    MAX_TOKENS: int = 1024
    MAX_CHAT_HISTORY: int = 10

settings = Settings()
