# 🏛️ CivicPulse AI: High-Fidelity Civic Intelligence Hub

**CivicPulse AI** is a production-grade, "Grounded" intelligence platform designed to empower Indian citizens with verified election knowledge, real-time localized news, and immersive digital voting simulations. 

Built using a **Dual-AI Architecture (Groq + Gemini)**, the platform solves the critical challenge of election misinformation by anchoring every response in official ECI (Election Commission of India) documentation.

---

## 🏆 Evaluation Focus Alignment

### 1. Smart, Dynamic Assistant (The Intelligence Core)
- **Hybrid RAG Engine**: Combines **Groq (Llama 3.3-70b)** for ultra-low latency chat and **Google Gemini 1.5 Pro** for complex reasoning (Quiz/News).
- **Behavioral Personas**: Features **ELI10 (Explain Like I'm 10)** mode and a **Myth-Buster** state to simplify complex laws and debunk misconceptions.
- **Contextual Actions**: Intelligent intent detection triggers UI changes (e.g., suggesting the EVM simulation when a user asks about the voting process).

### 2. Google Services Integration
- **Gemini 1.5 Pro Intelligence**: 
    - **Dynamic Quiz Engine**: Gemini analyzes source documents in real-time to generate educational quizzes.
    - **Localized AI Pulse**: Gemini summarizes live news headlines specifically for the user's selected State (Constituency Intelligence).
- **Google Generative AI SDK**: Deep integration for grounding and multimodal potential.

### 3. Practicality & Accessibility
- **Bilingual Interface**: Seamlessly switch between **English and Hindi** across the AI Tutor and UI.
- **Readability First**: Optimized "Medium" typography scale and high-contrast accessibility standards.
- **Voter Readiness Checklist**: Exportable PDF checklists generated after completing the immersive simulation.

### 4. Security & Responsibility
- **Strict Grounding**: Uses **ChromaDB** and `MarkdownHeaderTextSplitter` to ensure AI responses never hallucinate outside the provided Voter Guide.
- **Responsible AI Guardrails**: Implicit fact-checking logic that corrects user misconceptions without being defensive or robotic.

---

## 🚀 Technical Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion (Animations), Zustand (State).
- **Backend**: FastAPI (High-performance Async Python), LangChain v0.2+, Google Gemini LLM.
- **Data Store**: ChromaDB Vector Database for local vector search and RAG grounding.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- **Python 3.10+** & **Node.js 18+**
- **API Keys**: `GOOGLE_API_KEY` (Gemini) and `GROQ_API_KEY` (RAG Engine).

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
# Create .env with GOOGLE_API_KEY and GROQ_API_KEY
python -m uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

---

## 🐳 Docker Deployment (Recommended)
For a production-ready, zero-config setup, use Docker Compose:

1. **Configure Environment**: Ensure `./backend/.env` contains your `GOOGLE_API_KEY` and `GROQ_API_KEY`.
2. **Launch Platform**:
   ```bash
   docker-compose up --build
   ```
   - **Intelligence API**: [http://localhost:8000](http://localhost:8000)
   - **CivicPulse UI**: [http://localhost:3000](http://localhost:3000)

---

## 📦 Feature Deep-Dive

- **Live Booth Intelligence**: Real-time dashboard for assigned polling station data and queue monitoring.
- **Interactive Digital Ballot**: A 4-step immersive simulation of the Indian voting process (Verification -> Inking -> EVM -> VVPAT).
- **Civic Intelligence Hub**: A compact, sliding-tab glossary with deep-dive external links to ECI and Wikipedia resources.
- **Election Directory**: A categorical guide to National, State, and Local elections in India.

---

## 📜 Non-Partisan Initiative
This platform is a **Non-Partisan Initiative** designed strictly for educational and civic awareness purposes. It adheres to the democratic values of the Indian Constitution and the institutional standards of the Election Commission of India.

---
© 2026 CivicPulse AI Platform
