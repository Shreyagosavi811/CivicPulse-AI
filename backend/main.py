from fastapi import FastAPI, HTTPException
from langchain_core.prompts import ChatPromptTemplate
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from services.rag_service import rag_service
import uvicorn
import json

app = FastAPI(title="CivicPulse Intelligence API")

# Initialize Gemini for Quiz
gemini_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    text: str
    simplify: bool = False
    lang: str = "English"
    fact_check: bool = False

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/ai/ask")
async def ask_ai(request: QueryRequest):
    try:
        response = rag_service.ask(request.text, request.simplify, request.lang, request.fact_check)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai/generate-quiz")
async def generate_quiz():
    try:
        with open("data/voter_guide.md", "r", encoding="utf-8") as f:
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
        clean_json = response.content.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        return [
            {
                "id": 1,
                "text": "How long is the VVPAT slip visible?",
                "options": ["3 seconds", "7 seconds", "10 seconds", "15 seconds"],
                "answer": 1,
                "explanation": "The slip is visible for 7 seconds."
            }
        ]

@app.post("/ai/summarize-news")
async def summarize_news(request: dict):
    try:
        headlines = request.get("headlines", [])
        state = request.get("state", "India")
        if not headlines: return {"summary": "No active headlines to analyze."}

        prompt = f"""
        Analyze these election headlines and provide exactly 3 bullet points of 'Civic Pulse' specifically for {state}.
        Focus on:
        1. Actionable information for voters in {state}.
        2. Important deadlines or legal changes.
        3. Neutral, factual turnout or process trends.

        Headlines:
        {chr(10).join(headlines)}
        
        Format as clear bullet points. Be professional and warm.
        """
        
        response = gemini_llm.invoke(prompt)
        return {"summary": response.content}
    except Exception as e:
        return {"summary": "• Stay informed via official ECI channels.\n• Verify your polling station details early.\n• Ensure you have valid identification ready."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
