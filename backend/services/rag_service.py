import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

load_dotenv()

class RAGService:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.2)
        self.db = None
        self._initialize_db()

    def _initialize_db(self):
        guide_path = "data/voter_guide.md"
        if os.path.exists(guide_path):
            with open(guide_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            headers_to_split_on = [("#", "Header 1"), ("##", "Header 2")]
            splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
            docs = splitter.split_text(content)
            
            self.db = Chroma.from_documents(
                docs, 
                self.embeddings,
                persist_directory="./chroma_db"
            )

    def ask(self, query: str, simplify: bool = False, lang: str = "English", fact_check: bool = False):
        if not self.db:
            return {"answer": "I'm still learning. Please wait a moment.", "sources": []}

        retriever = self.db.as_retriever(search_kwargs={"k": 3})
        context_docs = retriever.invoke(query)
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

        chain = prompt | self.llm
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

    def _classify_action(self, query: str):
        q = query.lower()
        if "how to vote" in q or "process" in q: return "SUGGEST"
        if "evm" in q or "vvpat" in q: return "AUTO_LAUNCH"
        if "id" in q or "documents" in q: return "GUIDE"
        return None

rag_service = RAGService()
