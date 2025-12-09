import logging
import numpy as np
from typing import Optional, List

from ..config import settings
from ..core.cache_manager import get_cache_manager
from ..core.dimension_projector import DimensionProjector
from .openai_provider import OpenAIProvider
from .local_provider import LocalProvider

logger = logging.getLogger(__name__)


class LocalEmbeddingsWithProjection:
    def __init__(self, model, input_dim: int, target_dim: int = 1536, projector: Optional[DimensionProjector] = None):
        self.model = model
        self.input_dim = input_dim
        self.target_dim = target_dim
        self.projector = projector
        self.needs_projection = input_dim != target_dim
        
        logger.info(f"LocalEmbeddings: {input_dim}d → {target_dim}d projection")
    
    def _project_embedding(self, embedding: np.ndarray) -> np.ndarray:
        if not self.needs_projection or self.projector is None:
            return embedding
        
        return self.projector.project(embedding)
    
    def embed_query(self, text: str) -> List[float]:
        try:
            embedding = self.model.encode([text])[0]
            
            if self.needs_projection:
                embedding = self._project_embedding(embedding)
            
            if isinstance(embedding, np.ndarray):
                embedding = embedding.tolist()
            
            return embedding
            
        except Exception as e:
            logger.error(f"Local embedding generation failed: {e}")
            random_vec = np.random.randn(self.target_dim).astype(np.float32)
            random_vec = random_vec / np.linalg.norm(random_vec)
            return random_vec.tolist()
    
    async def aembed_query(self, text: str) -> List[float]:
        import asyncio
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.embed_query, text)
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        try:
            embeddings = self.model.encode(texts)
            
            if self.needs_projection:
                projected_embeddings = []
                for emb in embeddings:
                    projected = self._project_embedding(emb)
                    projected_embeddings.append(projected)
                embeddings = np.array(projected_embeddings)
            
            if isinstance(embeddings, np.ndarray):
                embeddings = embeddings.tolist()
            
            return embeddings
            
        except Exception as e:
            logger.error(f"Batch local embedding generation failed: {e}")
            random_vecs = np.random.randn(len(texts), self.target_dim).astype(np.float32)
            random_vecs = random_vecs / np.linalg.norm(random_vecs, axis=1, keepdims=True)
            return random_vecs.tolist()
    
    async def aembed_documents(self, texts: List[str]) -> List[List[float]]:
        import asyncio
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.embed_documents, texts)


class EmbeddingsProvider:
    def __init__(self):
        self.openai_provider = OpenAIProvider()
        self.local_provider = LocalProvider()
        self.cache_manager = get_cache_manager()
        self._projectors: dict = {}
        logger.info("EmbeddingsProvider initialized")
    
    async def initialize_projectors(self):
        if not settings.enable_dimension_projection:
            return
        
        target_dim = settings.target_embedding_dimension
        
        fallback_dim = settings.embedding_dimensions.get(settings.fallback_embedding_model)
        if fallback_dim and fallback_dim != target_dim:
            projector = DimensionProjector(
                input_dim=fallback_dim,
                output_dim=target_dim,
                method=settings.projection_method
            )
            await projector.initialize()
            self._projectors[f"{fallback_dim}_{target_dim}"] = projector
            logger.info(f"Initialized projector for fallback model: {fallback_dim}d → {target_dim}d")
        
        tertiary_dim = settings.embedding_dimensions.get(settings.tertiary_embedding_model)
        if tertiary_dim and tertiary_dim != target_dim:
            projector = DimensionProjector(
                input_dim=tertiary_dim,
                output_dim=target_dim,
                method=settings.projection_method
            )
            await projector.initialize()
            self._projectors[f"{tertiary_dim}_{target_dim}"] = projector
            logger.info(f"Initialized projector for tertiary model: {tertiary_dim}d → {target_dim}d")
    
    def get_embeddings_function(self):
        if settings.embedding_provider == "openai" or settings.embedding_provider == "hybrid":
            try:
                from langchain_openai import OpenAIEmbeddings
                
                if settings.openai_api_key:
                    try:
                        embeddings = OpenAIEmbeddings(
                            model=settings.openai_embedding_model,
                            openai_api_key=settings.openai_api_key,
                            openai_api_base=settings.openai_api_url if settings.openai_api_url else None,
                        )
                        
                        logger.info(f"Created OpenAI embeddings with model: {settings.openai_embedding_model} (1536d)")
                        return embeddings
                        
                    except Exception as e:
                        logger.warning(f"Failed to create OpenAI embeddings: {e}, falling back to local model")
                else:
                    logger.warning("OPENAI_API_KEY not configured, using local embeddings fallback")
                    
            except ImportError:
                logger.warning("OpenAIEmbeddings not available, using local embeddings fallback")
        
        if settings.embedding_provider == "local" or settings.embedding_provider == "hybrid":
            try:
                logger.info("Attempting to use local embedding model fallback")
                local_embeddings = self._get_local_embeddings_with_projection()
                
                if local_embeddings:
                    logger.info("Successfully initialized local embeddings fallback")
                    return local_embeddings
                else:
                    logger.error("Local embeddings fallback failed")
                    return None
                    
            except Exception as e:
                logger.error(f"All embedding methods failed: {e}")
                return None
        
        logger.error(f"Unknown embedding provider: {settings.embedding_provider}")
        return None
    
    def _get_local_embeddings_with_projection(self):
        try:
            target_dim = settings.target_embedding_dimension
            
            model = self.local_provider.load_sentence_transformer(settings.fallback_embedding_model)
            if model:
                model_dim = self.local_provider.get_model_dimension(settings.fallback_embedding_model)
                if model_dim:
                    projector = self._projectors.get(f"{model_dim}_{target_dim}")
                    return LocalEmbeddingsWithProjection(model, model_dim, target_dim, projector)
            
            logger.warning(f"Primary local model failed, trying tertiary model")
            
            model = self.local_provider.load_sentence_transformer(settings.tertiary_embedding_model)
            if model:
                model_dim = self.local_provider.get_model_dimension(settings.tertiary_embedding_model)
                if model_dim:
                    projector = self._projectors.get(f"{model_dim}_{target_dim}")
                    return LocalEmbeddingsWithProjection(model, model_dim, target_dim, projector)
            
            logger.error("All local models failed")
            return None
            
        except Exception as e:
            logger.error(f"Failed to initialize local embeddings: {e}")
            return None
    
    def embed_query(self, text: str, embeddings_function=None) -> Optional[List[float]]:
        if embeddings_function is None:
            embeddings_function = self.get_embeddings_function()
        
        if embeddings_function is None:
            return None
        
        try:
            import xxhash
            query_hash = xxhash.xxh64(text.lower().strip().encode()).hexdigest()
        except ImportError:
            import hashlib
            query_hash = hashlib.md5(text.lower().strip().encode()).hexdigest()
        
        cached_embedding = self.cache_manager.get_cached_embedding(query_hash)
        if cached_embedding:
            return cached_embedding
        
        try:
            embedding = embeddings_function.embed_query(text)
            self.cache_manager.cache_embedding(query_hash, embedding)
            return embedding
        except Exception as e:
            logger.error(f"Failed to generate embedding: {e}")
            return None
    
    async def aembed_query(self, text: str, embeddings_function=None) -> Optional[List[float]]:
        if embeddings_function is None:
            embeddings_function = self.get_embeddings_function()
        
        if embeddings_function is None:
            return None
        
        try:
            import xxhash
            query_hash = xxhash.xxh64(text.lower().strip().encode()).hexdigest()
        except ImportError:
            import hashlib
            query_hash = hashlib.md5(text.lower().strip().encode()).hexdigest()
        
        cached_embedding = self.cache_manager.get_cached_embedding(query_hash)
        if cached_embedding:
            return cached_embedding
        
        try:
            if hasattr(embeddings_function, 'aembed_query'):
                embedding = await embeddings_function.aembed_query(text)
            else:
                embedding = embeddings_function.embed_query(text)
            
            self.cache_manager.cache_embedding(query_hash, embedding)
            return embedding
        except Exception as e:
            logger.error(f"Failed to generate embedding: {e}")
            return None
    
    def embed_documents(self, texts: List[str], embeddings_function=None) -> Optional[List[List[float]]]:
        if embeddings_function is None:
            embeddings_function = self.get_embeddings_function()
        
        if embeddings_function is None:
            return None
        
        try:
            embeddings = embeddings_function.embed_documents(texts)
            return embeddings
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            return None


_embeddings_provider = None


def get_embeddings_provider() -> EmbeddingsProvider:
    global _embeddings_provider
    if _embeddings_provider is None:
        _embeddings_provider = EmbeddingsProvider()
    return _embeddings_provider


def get_embeddings_function():
    provider = get_embeddings_provider()
    return provider.get_embeddings_function()

