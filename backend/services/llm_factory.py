from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()

class LLMFactory:
    """
    Factory class to initialize and provide LLM instances.
    """
    
    @staticmethod
    def get_gemini_llm(model: str = "gemini-1.5-flash", temperature: float = 0.7) -> ChatGoogleGenerativeAI:
        """
        Returns an instance of Google Gemini LLM with Responsible AI safety filters.
        """
        from langchain_google_genai import HarmCategory, HarmBlockThreshold
        
        safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        }

        return ChatGoogleGenerativeAI(
            model=model,
            temperature=temperature,
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            safety_settings=safety_settings
        )

    @staticmethod
    def get_groq_llm(model: str = "llama-3.3-70b-versatile", temperature: float = 0.2) -> ChatGroq:
        """
        Returns an instance of Groq LLM.
        """
        return ChatGroq(
            model_name=model,
            temperature=temperature,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )

llm_factory = LLMFactory()
