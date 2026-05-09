from typing import Dict, List
from app.config import settings

class LLMService:
    def __init__(self):
        self._llm = None
        self.chat_histories: Dict[str, List[dict]] = {}

    def _get_llm(self):
        if self._llm is None:
            from langchain_groq import ChatGroq
            self._llm = ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model=settings.GROQ_MODEL,
                temperature=settings.TEMPERATURE,
                max_tokens=settings.MAX_TOKENS,
            )
            print(f"Groq LLM ready: {settings.GROQ_MODEL}")
        return self._llm

    def generate_response(self, query: str, session_id: str, use_context: bool = True) -> dict:
        from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
        from app.services.vector_store import vector_store_service

        context_docs = []
        sources = []

        if use_context and vector_store_service.has_documents():
            try:
                results = vector_store_service.similarity_search(query, k=settings.SIMILARITY_TOP_K)
                for doc, score in results:
                    if score < settings.SIMILARITY_THRESHOLD:
                        context_docs.append(doc.page_content)
                        sources.append({
                            "filename": doc.metadata.get("filename", "Unknown"),
                            "page": doc.metadata.get("page", "N/A"),
                            "relevance_score": round(float(score), 3)
                        })
            except Exception as e:
                print(f"Search error: {e}")

        system_prompt = """You are a helpful AI assistant that answers questions about documents.
- If document context is provided, base your answer on it
- If no context found, still respond helpfully and say the info wasn't in the document
- For greetings or general questions, respond normally and friendly
- Use bullet points for clarity when listing things"""

        if session_id not in self.chat_histories:
            self.chat_histories[session_id] = []
        history = self.chat_histories[session_id]

        messages = [SystemMessage(content=system_prompt)]
        for h in history[-6:]:
            messages.append(HumanMessage(content=h["human"]))
            messages.append(AIMessage(content=h["ai"]))

        if context_docs:
            context = "\n\n---\n\n".join(context_docs)
            user_msg = f"Document context:\n{context}\n\nQuestion: {query}"
        else:
            user_msg = query

        messages.append(HumanMessage(content=user_msg))

        response = self._get_llm().invoke(messages)
        answer = response.content

        history.append({"human": query, "ai": answer})
        if len(history) > settings.MAX_CHAT_HISTORY:
            self.chat_histories[session_id] = history[-settings.MAX_CHAT_HISTORY:]

        return {"answer": answer, "sources": sources, "has_context": bool(context_docs)}

    def clear_history(self, session_id: str):
        self.chat_histories.pop(session_id, None)

llm_service = LLMService()
