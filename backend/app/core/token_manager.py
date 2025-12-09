"""
Token Manager for Azure OAuth2 authentication.
Handles fetching and caching OAuth2 tokens for Azure OpenAI.
"""
import logging
import threading
import time
from typing import Optional
import requests

from app.config import settings

logger = logging.getLogger(__name__)


class TokenManager:
    """Singleton token manager for Azure OAuth2 authentication."""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        self._initialized = True
        self._token_cache = {
            "token": None,
            "fetched_at": 0.0,
            "ttl": settings.TOKEN_CACHE_TTL
        }
        self._token_lock = threading.Lock()
        logger.info("TokenManager initialized")
    
    def is_token_valid(self) -> bool:
        """Check if cached token is still valid."""
        with self._token_lock:
            if not self._token_cache["token"]:
                return False
            now = time.time()
            age = now - self._token_cache["fetched_at"]
            return age < self._token_cache["ttl"]
    
    def is_token_error(self, exc: Exception) -> bool:
        """Check if exception is a token-related error."""
        msg = str(exc).lower()
        indicators = [
            "401", "unauthorized", "invalid token", "token invalid",
            "token expired", "expired token", "invalid_auth", "authentication"
        ]
        return any(ind in msg for ind in indicators)
    
    def fetch_azure_token(self, force_refresh: bool = False) -> str:
        """
        Fetch OAuth2 access token from TOKEN_URL.
        Uses client credentials grant type.
        """
        if not force_refresh and self.is_token_valid() and settings.ENABLE_TOKEN_CACHING:
            logger.debug("Using cached Azure token")
            return self._token_cache["token"]
        
        logger.info("Fetching new Azure access token from TOKEN_URL")
        
        if not settings.TOKEN_URL:
            raise RuntimeError("TOKEN_URL not configured for Azure authentication")
        
        if not settings.CLIENT_ID or not settings.CLIENT_SECRET:
            raise RuntimeError("CLIENT_ID and CLIENT_SECRET required for Azure authentication")
        
        auth_headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        }
        
        auth_payload = {
            "grant_type": "client_credentials",
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET
        }
        
        try:
            with requests.Session() as session:
                response = session.post(
                    settings.TOKEN_URL,
                    headers=auth_headers,
                    data=auth_payload,
                    timeout=30
                )
                response.raise_for_status()
            
            token_data = response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                raise RuntimeError("No access_token in response")
            
            with self._token_lock:
                self._token_cache["token"] = access_token
                self._token_cache["fetched_at"] = time.time()
            
            logger.info("Successfully fetched and cached Azure token")
            return access_token
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch Azure token: {e}")
            raise RuntimeError(f"Azure token fetch failed: {e}") from e
        except Exception as e:
            logger.error(f"Unexpected error fetching Azure token: {e}")
            raise RuntimeError(f"Azure token fetch failed: {e}") from e
    
    def clear_token_cache(self):
        """Clear the cached token."""
        with self._token_lock:
            self._token_cache["token"] = None
            self._token_cache["fetched_at"] = 0.0
        logger.info("Token cache cleared")
    
    def get_token_info(self) -> dict:
        """Get information about the current token state."""
        with self._token_lock:
            return {
                "token_valid": self.is_token_valid(),
                "token_age": time.time() - self._token_cache["fetched_at"] if self._token_cache["token"] else None,
                "ttl": self._token_cache["ttl"]
            }


# Singleton instance
_token_manager: Optional[TokenManager] = None


def get_token_manager() -> TokenManager:
    """Get or create the token manager singleton."""
    global _token_manager
    if _token_manager is None:
        _token_manager = TokenManager()
    return _token_manager

