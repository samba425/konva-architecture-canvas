import logging
import threading
import time
from typing import Optional, Dict, Any, Tuple

from ..config import settings

logger = logging.getLogger(__name__)


class CacheManager:
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
        
        self._llm_cache = {
            "llm": None,
            "model": None,
            "timestamp": 0.0
        }
        self._llm_lock = threading.Lock()
        
        self._embedding_cache: Dict[str, Tuple[list, float]] = {}
        self._embedding_lock = threading.Lock()
        
        logger.info("CacheManager initialized")
    
    def is_llm_cache_valid(self, model: str) -> bool:
        with self._llm_lock:
            if not self._llm_cache.get("llm"):
                return False
            
            if self._llm_cache.get("model") != model:
                return False
            
            now = time.time()
            cache_age = now - self._llm_cache.get("timestamp", 0)
            return cache_age < settings.llm_cache_ttl
    
    def get_cached_llm(self, model: str):
        if not settings.enable_llm_caching:
            return None
        
        if self.is_llm_cache_valid(model):
            logger.debug(f"LLM cache HIT for model: {model}")
            return self._llm_cache["llm"]
        
        logger.debug(f"LLM cache MISS for model: {model}")
        return None
    
    def cache_llm(self, llm, model: str):
        if not settings.enable_llm_caching:
            return
        
        with self._llm_lock:
            self._llm_cache["llm"] = llm
            self._llm_cache["model"] = model
            self._llm_cache["timestamp"] = time.time()
        
        logger.debug(f"Cached LLM for model: {model}")
    
    def clear_llm_cache(self):
        with self._llm_lock:
            self._llm_cache["llm"] = None
            self._llm_cache["model"] = None
            self._llm_cache["timestamp"] = 0.0
        logger.info("LLM cache cleared")
    
    def get_cached_embedding(self, query_hash: str) -> Optional[list]:
        if not settings.enable_embedding_caching:
            return None
        
        with self._embedding_lock:
            if query_hash in self._embedding_cache:
                embedding, timestamp = self._embedding_cache[query_hash]
                
                if time.time() - timestamp < settings.embedding_cache_ttl:
                    logger.debug(f"Embedding cache HIT")
                    return embedding
                else:
                    del self._embedding_cache[query_hash]
                    logger.debug(f"Embedding cache EXPIRED")
        
        logger.debug(f"Embedding cache MISS")
        return None
    
    def cache_embedding(self, query_hash: str, embedding: list):
        if not settings.enable_embedding_caching:
            return
        
        with self._embedding_lock:
            if len(self._embedding_cache) >= settings.embedding_cache_max_size:
                sorted_entries = sorted(
                    self._embedding_cache.items(),
                    key=lambda x: x[1][1]
                )
                num_to_remove = settings.embedding_cache_max_size // 10
                for key, _ in sorted_entries[:num_to_remove]:
                    del self._embedding_cache[key]
                logger.info(f"Embedding cache cleanup: removed {num_to_remove} entries")
            
            self._embedding_cache[query_hash] = (embedding, time.time())
        
        logger.debug(f"Embedding cached")
    
    def clear_embedding_cache(self):
        with self._embedding_lock:
            self._embedding_cache.clear()
        logger.info("Embedding cache cleared")
    
    def get_embedding_cache_stats(self) -> Dict[str, Any]:
        with self._embedding_lock:
            current_time = time.time()
            valid_entries = sum(
                1 for _, timestamp in self._embedding_cache.values()
                if current_time - timestamp < settings.embedding_cache_ttl
            )
            return {
                "total_entries": len(self._embedding_cache),
                "valid_entries": valid_entries,
                "max_size": settings.embedding_cache_max_size,
                "ttl_seconds": settings.embedding_cache_ttl
            }
    
    def get_llm_cache_stats(self) -> Dict[str, Any]:
        with self._llm_lock:
            return {
                "current_model": self._llm_cache.get("model"),
                "cache_valid": self.is_llm_cache_valid(self._llm_cache.get("model", "")),
                "cache_age": time.time() - self._llm_cache.get("timestamp", 0) if self._llm_cache.get("llm") else None,
                "ttl": settings.llm_cache_ttl
            }
    
    def clear_all_caches(self):
        self.clear_llm_cache()
        self.clear_embedding_cache()
        logger.info("All caches cleared")


_cache_manager = CacheManager()


def get_cache_manager() -> CacheManager:
    return _cache_manager

