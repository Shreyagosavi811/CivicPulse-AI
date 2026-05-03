import os
from functools import lru_cache
from typing import List, Optional
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain_core.documents import Document

class RetrieverService:
    """
    Service to manage document retrieval and vector database operations.
    """
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        self.persist_directory = "./chroma_db"
        self._db: Optional[Chroma] = None

    def get_db(self) -> Chroma:
        """
        Initializes or returns the cached ChromaDB instance.
        """
        if self._db is None:
            if os.path.exists(self.persist_directory) and os.listdir(self.persist_directory):
                # Load existing DB
                self._db = Chroma(
                    persist_directory=self.persist_directory,
                    embedding_function=self.embeddings
                )
            else:
                # Initialize new DB
                self._db = self._initialize_db()
        return self._db

    def _initialize_db(self) -> Chroma:
        """
        Processes source documents and creates a new vector database.
        """
        guide_path = "data/voter_guide.md"
        if not os.path.exists(guide_path):
            raise FileNotFoundError(f"Voter guide not found at {guide_path}")

        with open(guide_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        headers_to_split_on = [("#", "Header 1"), ("##", "Header 2")]
        splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
        docs = splitter.split_text(content)
        
        return Chroma.from_documents(
            docs, 
            self.embeddings,
            persist_directory=self.persist_directory
        )

    def retrieve(self, query: str, k: int = 3) -> List[Document]:
        """
        Retrieves relevant documents for a given query.
        """
        db = self.get_db()
        return db.as_retriever(search_kwargs={"k": k}).invoke(query)

retriever_service = RetrieverService()
