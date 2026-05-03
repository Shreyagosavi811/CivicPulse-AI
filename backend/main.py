from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uvicorn
import json
import os
from dotenv import load_dotenv

from services.rag_service import rag_service
from services.llm_factory import llm_factory

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("civic-pulse-api")

load_dotenv()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="CivicPulse Intelligence API",
    description="Backend API for grounded civic education and election intelligence.",
    version="1.0.0"
)

# Efficiency: Enable GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Initialize Gemini for Quiz and News
gemini_llm = llm_factory.get_gemini_llm()

# Security: CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security: Secure Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

class QueryRequest(BaseModel):
    """
    Request model for AI chat queries.
    """
    text: str = Field(..., max_length=500, description="The user's query text.")
    simplify: bool = Field(False, description="Whether to simplify the response (ELI10).")
    lang: str = Field("English", description="Target language for the response.")
    fact_check: bool = Field(False, description="Whether to enable fact-checking/myth-busting mode.")

class NewsRequest(BaseModel):
    """
    Request model for news summarization.
    """
    headlines: List[str] = Field(..., min_length=1)
    state: str = Field("India")

@app.get("/health")
async def health_check() -> Dict[str, str]:
    """
    Checks the health status of the API.
    """
    return {"status": "healthy", "version": "1.0.0"}

def get_rag_service():
    """Dependency provider for RAGService."""
    return rag_service

import asyncio

@app.post("/ai/ask")
@limiter.limit("5/minute")
async def ask_ai(request: Request, query_request: QueryRequest, rag: Any = Depends(get_rag_service)) -> Dict[str, Any]:
    """
    Endpoint to ask the AI tutor a question with timeout protection.
    """
    try:
        logger.info(f"AI Query received: {query_request.text[:50]}...")
        # Add timeout to ensure API resilience
        response = await asyncio.wait_for(
            asyncio.to_thread(rag.ask, query_request.text, query_request.simplify, query_request.lang, query_request.fact_check),
            timeout=15.0
        )
        return response
    except asyncio.TimeoutError:
        logger.warning(f"AI Query timed out: {query_request.text[:50]}")
        return {
            "answer": "I'm processing a lot of civic data right now. Please try asking again in a few moments.",
            "sources": [],
            "chunks": [],
            "confidence": 0.0,
            "simulation_action": None
        }
    except Exception as e:
        logger.error(f"AI Query failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/ai/generate-quiz")
@limiter.limit("2/minute")
async def generate_quiz(request: Request) -> List[Dict[str, Any]]:
    """
    Generates a dynamic 3-question quiz based on the voter guide.
    """
    try:
        logger.info("Generating dynamic quiz...")
        # Load guide content (Consider caching this if it doesn't change often)
        guide_path = "data/voter_guide.md"
        with open(guide_path, "r", encoding="utf-8") as f:
            guide_content = f.read()

        prompt = f"""
        You are a CivicPulse Quiz Master. Based on the following voter guide, generate exactly 3 multiple-choice questions.
        Return the result ONLY as a JSON array of objects with this structure:
        [
          {{
            "id": 1,
            "text": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": 0,
            "explanation": "Brief educational insight"
          }}
        ]

        Context:
        {guide_content}
        """
        
        response = gemini_llm.invoke(prompt)
        # Robust JSON parsing
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        return json.loads(content)
    except Exception as e:
        # Fallback to static quiz if AI fails
        return [
            {
                "id": 1,
                "text": "How long is the VVPAT slip visible?",
                "options": ["3 seconds", "7 seconds", "10 seconds", "15 seconds"],
                "answer": 1,
                "explanation": "The slip is visible for 7 seconds for the voter to verify their choice."
            }
        ]

@app.post("/ai/summarize-news")
@limiter.limit("5/minute")
async def summarize_news(request: Request, news_request: NewsRequest) -> Dict[str, str]:
    """
    Summarizes news headlines for a specific state.
    """
    try:
        prompt = f"""
        Analyze these election headlines and provide exactly 3 bullet points of 'Civic Pulse' specifically for {news_request.state}.
        Focus on:
        1. Actionable information for voters in {news_request.state}.
        2. Important deadlines or legal changes.
        3. Neutral, factual turnout or process trends.

        Headlines:
        {chr(10).join(news_request.headlines)}
        
        Format as clear bullet points. Be professional and warm.
        """
        
        response = gemini_llm.invoke(prompt)
        return {"summary": response.content}
    except Exception as e:
        return {"summary": "• Stay informed via official ECI channels.\n• Verify your polling station details early.\n• Ensure you have valid identification ready."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
