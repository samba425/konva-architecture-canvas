import logging
from typing import Optional

from ..config import settings
from ..core.cache_manager import get_cache_manager
from ..providers.azure_provider import AzureProvider
from ..providers.openai_provider import OpenAIProvider
from ..providers.local_provider import LocalProvider

logger = logging.getLogger(__name__)


class LLMFactory:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        self._initialized = True
        self.azure_provider = AzureProvider()
        self.openai_provider = OpenAIProvider()
        self.local_provider = LocalProvider()
        self.cache_manager = get_cache_manager()
        logger.info("LLMFactory initialized")
    
    def get_llm(self, provider: Optional[str] = None, force_refresh: bool = False):
        if provider is None:
            provider = settings.llm_provider
        
        model_key = f"{provider}:{settings.graph_llm_model}"
        
        if not force_refresh and settings.enable_llm_caching:
            cached_llm = self.cache_manager.get_cached_llm(model_key)
            if cached_llm:
                logger.debug(f"Using cached LLM for provider: {provider}")
                return cached_llm
        
        logger.info(f"Creating new LLM instance for provider: {provider}")
        
        llm = None
        
        if provider == "azure":
            try:
                llm = self.azure_provider.create_llm()
            except Exception as e:
                logger.error(f"Azure provider failed: {e}")
        
        elif provider == "openai":
            try:
                llm = self.openai_provider.create_llm()
            except Exception as e:
                logger.error(f"OpenAI provider failed: {e}")
        
        elif provider == "local":
            logger.warning("Local LLM provider not yet implemented")
            return None
        
        else:
            logger.error(f"Unknown LLM provider: {provider}")
            return None
        
        if llm and settings.enable_llm_caching:
            self.cache_manager.cache_llm(llm, model_key)
        
        return llm
    
    def clear_cache(self):
        self.cache_manager.clear_llm_cache()
        logger.info("LLM cache cleared")


_llm_factory = LLMFactory()


def get_llm(provider: Optional[str] = None, force_refresh: bool = False):
    return _llm_factory.get_llm(provider, force_refresh)

