from typing import Dict, Any, Optional
from langchain_core.prompts import ChatPromptTemplate
from .llm_factory import llm_factory
from .retriever import get_retriever_service

class RAGService:
    """
    Main RAG (Retrieval-Augmented Generation) service for the CivicPulse platform.
    """
    def __init__(self):
        # LLM is also initialized here, which might trigger API key check. 
        # We'll handle this by ensuring LLMFactory is also lazy if needed, 
        # but for now, we'll focus on the retriever.
        self.llm = None

    def get_llm(self):
        if self.llm is None:
            self.llm = llm_factory.get_groq_llm()
        return self.llm

    def ask(self, query: str, simplify: bool = False, lang: str = "English", fact_check: bool = False) -> Dict[str, Any]:
        """
        Processes a user query and returns a grounded response based on the voter guide.
        
        Args:
            query: The user's question.
            simplify: Whether to use ELI10 mode.
            lang: Target language for the response.
            fact_check: Whether to enable myth-busting mode.
            
        Returns:
            A dictionary containing the answer, sources, and suggested actions.
        """
        retriever = get_retriever_service()
        context_docs = retriever.retrieve(query)
        context_text = "\n\n".join([doc.page_content for doc in context_docs])
        sources = list(set([doc.metadata.get("Header 2", "General Guide") for doc in context_docs]))

        # Dynamic Instructions
        complexity = "Explain like I'm 10 (ELI10) using simple analogies" if simplify else "Provide a detailed, professional explanation"
        mode_instruction = ""
        if fact_check:
            mode_instruction = "IMPORTANT: Focus on debunking any potential election myths or misconceptions in the query. Use verified facts to clarify."

        system_prompt = f"""
        You are 'CivicPulse AI', a warm, authoritative, and helpful Civic Tutor. 
        Your goal is to educate users about the Indian election process with clarity and empathy.

        PERSONALITY RULES:
        1. GREETINGS: If the user says Hi/Hello, respond warmly and invite them to learn about elections.
        2. TONE: Be a mentor, not a robot. Use phrases like 'That's a great question' or 'Here is how it works'.
        3. LANGUAGE: Respond ENTIRELY in {lang}. 
        4. COMPLEXITY: {complexity}.
        5. GROUNDING: Use the [CONTEXT] for specific election details (EVMs, VVPAT, MCC, ID documents).
        6. GENERAL KNOWLEDGE: For general civic questions (e.g., 'What is a vote?'), use your internal knowledge to provide a helpful, non-partisan answer.
        7. NO DEFENSIVENESS: Do NOT use phrases like '[FACT CHECK]' or 'I haven't asked a specific question' unless correcting a major lie.
        
        {mode_instruction}

        [CONTEXT]
        {{context}}
        """

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{query}")
        ])

        llm = self.get_llm()
        chain = prompt | llm
        response = chain.invoke({
            "context": context_text,
            "query": query
        })

        return {
            "answer": response.content,
            "sources": sources,
            "chunks": [{"source": s, "content": context_text[:200] + "..."} for s in sources],
            "confidence": 0.95,
            "simulation_action": self._classify_action(query)
        }

    def _classify_action(self, query: str) -> Optional[str]:
        """
        Classifies user intent to suggest specific UI simulations.
        """
        q = query.lower()
        if "how to vote" in q or "process" in q: return "SUGGEST"
        if "evm" in q or "vvpat" in q: return "AUTO_LAUNCH"
        if "id" in q or "documents" in q: return "GUIDE"
        return None

rag_service = RAGService()
