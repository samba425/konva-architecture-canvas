import json
import logging
import time

from ..config import settings
from ..core.token_manager import get_token_manager

logger = logging.getLogger(__name__)


class AzureProvider:
    """
    Azure OpenAI provider matching the old working implementation.
    Uses TOKEN_URL for OAuth2 authentication and AZURE_* environment variables.
    """
    
    def __init__(self):
        self.token_manager = get_token_manager()
        logger.info("AzureProvider initialized")
    
    def create_llm(self):
        """
        Create Azure OpenAI LLM instance with OAuth token authentication.
        Matches the old working implementation exactly.
        """
        try:
            from langchain_openai import AzureChatOpenAI
        except ImportError:
            logger.error("AzureChatOpenAI not available - langchain_openai not installed")
            return None
        
        # Check if TOKEN_URL is configured (required for OAuth auth)
        if not settings.token_url:
            logger.error("TOKEN_URL not configured for Azure authentication")
            return None
        
        logger.info("Creating Azure OpenAI LLM instance")
        
        # Retry loop matching old implementation
        for attempt in range(1, settings.llm_max_retries + 1):
            try:
                logger.debug(f"Azure LLM initialization attempt {attempt}/{settings.llm_max_retries}")
                
                # Fetch OAuth access token
                access_token = self.token_manager.fetch_azure_token()
                
                # Build user payload for authentication (matching old code)
                user_payload = {"appkey": settings.azure_openai_app_key}
                if settings.azure_user_id:
                    user_payload["user_id"] = settings.azure_user_id
                
                # Create AzureChatOpenAI instance (exactly matching old implementation)
                llm = AzureChatOpenAI(
                    deployment_name=settings.graph_llm_model,
                    azure_endpoint=settings.azure_endpoint,  # Defaults to https://chat-ai.cisco.com
                    api_key=access_token,
                    api_version=settings.azure_api_version,  # Defaults to 2023-08-01-preview
                    temperature=settings.graph_llm_temperature,
                    max_tokens=settings.graph_llm_max_tokens,
                    model=settings.graph_llm_model,
                    tiktoken_model_name=settings.graph_llm_model,
                    model_kwargs={"user": json.dumps(user_payload)}
                )
                
                logger.info("Successfully created Azure OpenAI LLM instance")
                return llm
                
            except Exception as e:
                logger.error(f"Azure LLM initialization attempt {attempt} failed: {e}")
                
                # Clear token cache if authentication error (matching old code)
                if self.token_manager.is_token_error(e):
                    logger.debug("Token authentication error detected, clearing cache")
                    self.token_manager.clear_token_cache()
                
                # Retry logic (matching old implementation)
                if attempt < settings.llm_max_retries:
                    logger.info(f"Retrying in {settings.llm_retry_delay} seconds...")
                    time.sleep(settings.llm_retry_delay)
                else:
                    logger.error("Max retries exceeded for Azure LLM initialization")
                    raise RuntimeError("Azure LLM initialization failed after all retries") from e
        
        return None

