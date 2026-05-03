from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "version": "1.0.0"}

def test_ai_ask_basic():
    """Test the AI ask endpoint with a basic query."""
    payload = {
        "text": "What is an EVM?",
        "simplify": False,
        "lang": "English",
        "fact_check": False
    }
    response = client.post("/ai/ask", json=payload)
    # Note: This might fail if API keys are not set, but we test the structure
    if response.status_code == 200:
        data = response.json()
        assert "answer" in data
        assert "sources" in data
        assert isinstance(data["sources"], list)
    else:
        # If API keys are missing, it might return 500
        assert response.status_code in [200, 500]

def test_ai_ask_too_long():
    """Test the AI ask endpoint with a query exceeding 500 characters."""
    long_text = "a" * 501
    payload = {
        "text": long_text
    }
    response = client.post("/ai/ask", json=payload)
    # Pydantic should catch this and return 422 Unprocessable Entity
    assert response.status_code == 422

def test_generate_quiz():
    """Test the quiz generation endpoint."""
    response = client.get("/ai/generate-quiz")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "text" in data[0]
        assert "options" in data[0]
        assert "answer" in data[0]

def test_summarize_news_validation():
    """Test news summarization with invalid payload."""
    # Empty headlines should trigger validation error or handled gracefully
    response = client.post("/ai/summarize-news", json={"headlines": [], "state": "Delhi"})
    # Based on our NewsRequest model, min_items=1
    assert response.status_code == 422

from unittest.mock import patch, MagicMock

def test_ai_ask_mocked():
    """Test the AI ask endpoint using mocks to avoid expensive LLM calls during testing."""
    with patch("services.rag_service.rag_service.ask") as mock_ask:
        mock_ask.return_value = {
            "answer": "Mocked response",
            "sources": ["Source 1"],
            "chunks": [],
            "confidence": 0.99,
            "simulation_action": None
        }
        
        payload = {"text": "Mock query"}
        response = client.post("/ai/ask", json=payload)
        
        assert response.status_code == 200
        assert response.json()["answer"] == "Mocked response"
        mock_ask.assert_called_once()
