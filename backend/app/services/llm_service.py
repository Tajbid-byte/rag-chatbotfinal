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
                print(f"[DEBUG] Found {len(results)} results for query: '{query}'")

                for doc, score in results:
                    print(f"[DEBUG] score={score:.4f} threshold={settings.SIMILARITY_THRESHOLD} text='{doc.page_content[:60]}...'")
                    # ✅ FIX: FAISS L2 distance — lower score = more similar
                    # Accept ALL results under threshold (was too strict at 1.5)
                    if score < settings.SIMILARITY_THRESHOLD:
                        context_docs.append(doc.page_content)
                        sources.append({
                            "filename": doc.metadata.get("filename", "Unknown"),
                            "page": doc.metadata.get("page", "N/A"),
                            "relevance_score": round(float(score), 3)
                        })

                # ✅ FIX: If threshold filtered everything out, just use top 3 anyway
                if not context_docs and results:
                    print("[DEBUG] Threshold filtered all results — using top 3 anyway")
                    for doc, score in results[:3]:
                        context_docs.append(doc.page_content)
                        sources.append({
                            "filename": doc.metadata.get("filename", "Unknown"),
                            "page": doc.metadata.get("page", "N/A"),
                            "relevance_score": round(float(score), 3)
                        })

            except Exception as e:
                print(f"[ERROR] Search failed: {e}")

        # ✅ FIX: Much stronger system prompt that forces document answers
        if context_docs:
            context = "\n\n---\n\n".join(context_docs)
            system_prompt = """You are a precise document analysis assistant.

IMPORTANT RULES:
1. Your answers must be based ONLY on the document context provided below
2. Quote or reference specific parts of the document in your answer
3. If asked about a topic, search the context carefully before saying it's not there
4. Be thorough — the user uploaded this document specifically to get answers from it
5. If something is genuinely not in the document, say: "This specific information is not in the uploaded document"
6. Use bullet points and clear formatting for readability"""

            user_msg = f"""=== DOCUMENT CONTEXT ===
{context}

=== USER QUESTION ===
{query}

Please answer the question using the document context above. Be specific and cite relevant parts."""

        else:
            system_prompt = """You are a helpful AI assistant.
The user has not uploaded any documents yet, or no relevant content was found in the document.
Be friendly and helpful. If they ask about document content, remind them to upload a PDF."""
            user_msg = query

        if session_id not in self.chat_histories:
            self.chat_histories[session_id] = []
        history = self.chat_histories[session_id]

        messages = [SystemMessage(content=system_prompt)]
        # ✅ FIX: Don't include old chat history when answering doc questions
        # Old history confuses the model when context changes
        if not context_docs:
            for h in history[-4:]:
                messages.append(HumanMessage(content=h["human"]))
                messages.append(AIMessage(content=h["ai"]))

        messages.append(HumanMessage(content=user_msg))

        response = self._get_llm().invoke(messages)
        answer = response.content

        history.append({"human": query, "ai": answer})
        if len(history) > settings.MAX_CHAT_HISTORY:
            self.chat_histories[session_id] = history[-settings.MAX_CHAT_HISTORY:]

        print(f"[DEBUG] context_docs={len(context_docs)}, sources={len(sources)}")
        return {"answer": answer, "sources": sources, "has_context": bool(context_docs)}

    def clear_history(self, session_id: str):
        self.chat_histories.pop(session_id, None)

llm_service = LLMService()
