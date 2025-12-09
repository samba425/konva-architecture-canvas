import logging
from openai import AsyncOpenAI

from ..config import settings

logger = logging.getLogger(__name__)


class OpenAIProvider:
    def __init__(self):
        self._async_client = None
        logger.info("OpenAIProvider initialized")
    
    def create_llm(self):
        try:
            from langchain_openai import ChatOpenAI
        except ImportError:
            logger.error("ChatOpenAI not available - langchain_openai not installed")
            return None
        
        if not settings.openai_api_key:
            logger.error("OPENAI_API_KEY not configured")
            return None
        
        try:
            llm = ChatOpenAI(
                model=settings.openai_fallback_model,
                temperature=settings.graph_llm_temperature,
                max_tokens=settings.graph_llm_max_tokens,
                openai_api_key=settings.openai_api_key,
                openai_api_base=settings.openai_api_url if settings.openai_api_url else None
            )
            
            logger.info(f"Successfully created OpenAI LLM with model: {settings.openai_fallback_model}")
            return llm
            
        except Exception as e:
            logger.error(f"Failed to create OpenAI LLM: {e}")
            return None
    
    def get_async_client(self) -> AsyncOpenAI:
        if self._async_client is None:
            if not settings.openai_api_key:
                raise RuntimeError("OPENAI_API_KEY not configured")
            
            kwargs = {
                "api_key": settings.openai_api_key
            }
            
            if settings.openai_api_url:
                kwargs["base_url"] = settings.openai_api_url
            
            self._async_client = AsyncOpenAI(**kwargs)
            logger.info("Created AsyncOpenAI client")
        
        return self._async_client

