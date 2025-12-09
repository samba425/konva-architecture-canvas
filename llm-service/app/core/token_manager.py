import logging
import threading
import time
from typing import Optional
import requests

from ..config import settings

logger = logging.getLogger(__name__)


class TokenManager:
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
            "ttl": settings.token_cache_ttl
        }
        self._token_lock = threading.Lock()
        logger.info("TokenManager initialized")
    
    def is_token_valid(self) -> bool:
        with self._token_lock:
            if not self._token_cache["token"]:
                return False
            now = time.time()
            age = now - self._token_cache["fetched_at"]
            return age < self._token_cache["ttl"]
    
    def is_token_error(self, exc: Exception) -> bool:
        msg = str(exc).lower()
        indicators = [
            "401", "unauthorized", "invalid token", "token invalid",
            "token expired", "expired token", "invalid_auth", "authentication"
        ]
        return any(ind in msg for ind in indicators)
    
    def fetch_azure_token(self, force_refresh: bool = False) -> str:
        if not force_refresh and self.is_token_valid() and settings.enable_token_caching:
            logger.debug("Using cached Azure token")
            return self._token_cache["token"]
        
        logger.debug("Fetching new Azure access token")
        
        if not settings.token_url:
            raise RuntimeError("TOKEN_URL not configured for Azure authentication")
        
        auth_headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        }
        
        auth_payload = {
            "grant_type": "client_credentials",
            "client_id": settings.client_id,
            "client_secret": settings.client_secret
        }
        
        try:
            with requests.Session() as session:
                response = session.post(
                    settings.token_url,
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
            
            logger.debug("Successfully fetched and cached Azure token")
            return access_token
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch Azure token: {e}")
            raise RuntimeError(f"Azure token fetch failed: {e}") from e
        except Exception as e:
            logger.error(f"Unexpected error fetching Azure token: {e}")
            raise RuntimeError(f"Azure token fetch failed: {e}") from e
    
    def clear_token_cache(self):
        with self._token_lock:
            self._token_cache["token"] = None
            self._token_cache["fetched_at"] = 0.0
        logger.info("Token cache cleared")
    
    def get_token_info(self) -> dict:
        with self._token_lock:
            return {
                "token_valid": self.is_token_valid(),
                "token_age": time.time() - self._token_cache["fetched_at"] if self._token_cache["token"] else None,
                "ttl": self._token_cache["ttl"]
            }


_token_manager = TokenManager()


def get_token_manager() -> TokenManager:
    return _token_manager

