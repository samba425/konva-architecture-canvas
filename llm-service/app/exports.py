from typing import Optional, List, Dict, Any

from .core.llm_factory import get_llm as _get_llm
from .core.cache_manager import get_cache_manager
from .core.token_manager import get_token_manager
from .core.dimension_projector import DimensionProjector
from .providers.embeddings_provider import get_embeddings_provider, get_embeddings_function as _get_embeddings_function


def get_llm(provider: Optional[str] = None, force_refresh: bool = False):
    return _get_llm(provider, force_refresh)


def get_embeddings_function():
    return _get_embeddings_function()


def embed_query(text: str, embeddings_function=None) -> Optional[List[float]]:
    provider = get_embeddings_provider()
    return provider.embed_query(text, embeddings_function)


async def aembed_query(text: str, embeddings_function=None) -> Optional[List[float]]:
    provider = get_embeddings_provider()
    return await provider.aembed_query(text, embeddings_function)


def embed_documents(texts: List[str], embeddings_function=None) -> Optional[List[List[float]]]:
    provider = get_embeddings_provider()
    return provider.embed_documents(texts, embeddings_function)


async def aembed_documents(texts: List[str], embeddings_function=None) -> Optional[List[List[float]]]:
    provider = get_embeddings_provider()
    embeddings_function = embeddings_function or provider.get_embeddings_function()
    
    if embeddings_function is None:
        return None
    
    try:
        if hasattr(embeddings_function, 'aembed_documents'):
            return await embeddings_function.aembed_documents(texts)
        else:
            return embeddings_function.embed_documents(texts)
    except Exception:
        return None


def clear_llm_cache():
    cache_manager = get_cache_manager()
    token_manager = get_token_manager()
    cache_manager.clear_llm_cache()
    token_manager.clear_token_cache()


def clear_embedding_cache():
    cache_manager = get_cache_manager()
    cache_manager.clear_embedding_cache()


def clear_all_caches():
    cache_manager = get_cache_manager()
    token_manager = get_token_manager()
    cache_manager.clear_all_caches()
    token_manager.clear_token_cache()


def get_llm_info() -> Dict[str, Any]:
    cache_manager = get_cache_manager()
    token_manager = get_token_manager()
    
    return {
        "llm_cache": cache_manager.get_llm_cache_stats(),
        "token_info": token_manager.get_token_info()
    }


def get_embedding_cache_stats() -> Dict[str, Any]:
    cache_manager = get_cache_manager()
    return cache_manager.get_embedding_cache_stats()


__all__ = [
    'get_llm',
    'get_embeddings_function',
    'embed_query',
    'aembed_query',
    'embed_documents',
    'aembed_documents',
    'DimensionProjector',
    'clear_llm_cache',
    'clear_embedding_cache',
    'clear_all_caches',
    'get_llm_info',
    'get_embedding_cache_stats'
]

