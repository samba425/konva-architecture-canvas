import logging
import pickle
from typing import Optional, Tuple
import numpy as np

from ..config import settings

logger = logging.getLogger(__name__)


class DimensionProjector:
    def __init__(self, input_dim: int, output_dim: int, method: str = "learned", redis_client=None, cache_key: str = "embedding:projection:weights"):
        self.input_dim = input_dim
        self.output_dim = output_dim
        self.method = method
        self.redis_client = redis_client
        self.cache_key = f"{cache_key}:{input_dim}:{output_dim}"
        
        self.projection_matrix: Optional[np.ndarray] = None
        self.bias: Optional[np.ndarray] = None
        
        logger.info(f"Initializing DimensionProjector: {input_dim}d → {output_dim}d using {method} method")
    
    async def initialize(self):
        try:
            if self.redis_client and self.method == "learned":
                cached_weights = await self._load_from_cache()
                if cached_weights:
                    self.projection_matrix, self.bias = cached_weights
                    logger.info(f"Loaded projection weights from cache for {self.input_dim}d → {self.output_dim}d")
                    return
            
            if self.method == "learned":
                self.projection_matrix = np.random.randn(self.output_dim, self.input_dim).astype(np.float32)
                self.projection_matrix *= np.sqrt(2.0 / self.input_dim)
                self.bias = np.zeros(self.output_dim, dtype=np.float32)
                logger.info(f"Initialized new projection weights with He initialization")
                
                if self.redis_client:
                    await self._save_to_cache()
            
            elif self.method == "interpolate":
                logger.info(f"Using interpolation method - no weights required")
            
            elif self.method == "pad":
                logger.info(f"Using padding method - no weights required")
                
        except Exception as e:
            logger.error(f"Failed to initialize projection weights: {e}")
            self.projection_matrix = None
            self.bias = None
    
    async def _load_from_cache(self) -> Optional[Tuple[np.ndarray, np.ndarray]]:
        try:
            cached_data = await self.redis_client.get(self.cache_key)
            if cached_data:
                weights_dict = pickle.loads(cached_data)
                projection_matrix = np.frombuffer(weights_dict['matrix'], dtype=np.float32).reshape(self.output_dim, self.input_dim)
                bias = np.frombuffer(weights_dict['bias'], dtype=np.float32)
                return projection_matrix, bias
            return None
        except Exception as e:
            logger.warning(f"Failed to load projection weights from cache: {e}")
            return None
    
    async def _save_to_cache(self):
        try:
            if self.projection_matrix is not None and self.bias is not None:
                weights_dict = {
                    'matrix': self.projection_matrix.tobytes(),
                    'bias': self.bias.tobytes()
                }
                cached_data = pickle.dumps(weights_dict)
                await self.redis_client.setex(self.cache_key, 86400 * 7, cached_data)
                logger.info(f"Saved projection weights to cache")
        except Exception as e:
            logger.warning(f"Failed to save projection weights to cache: {e}")
    
    def project(self, embedding: np.ndarray) -> np.ndarray:
        try:
            if not isinstance(embedding, np.ndarray):
                embedding = np.array(embedding, dtype=np.float32)
            
            is_batch = len(embedding.shape) > 1
            if not is_batch:
                embedding = embedding.reshape(1, -1)
            
            if embedding.shape[1] != self.input_dim:
                logger.error(f"Input dimension mismatch: expected {self.input_dim}, got {embedding.shape[1]}")
                return self._emergency_projection(embedding, is_batch)
            
            if self.method == "learned" and self.projection_matrix is not None:
                projected = np.dot(embedding, self.projection_matrix.T) + self.bias
                
            elif self.method == "interpolate":
                projected = self._interpolate_projection(embedding)
                
            elif self.method == "pad":
                projected = self._pad_projection(embedding)
                
            else:
                projected = self._emergency_projection(embedding, is_batch=True)
            
            norms = np.linalg.norm(projected, axis=1, keepdims=True)
            norms = np.where(norms > 0, norms, 1.0)
            projected = projected / norms
            
            if not is_batch:
                projected = projected[0]
            
            return projected.astype(np.float32)
            
        except Exception as e:
            logger.error(f"Projection failed: {e}")
            return self._create_random_normalized_vector(is_batch)
    
    def _interpolate_projection(self, embedding: np.ndarray) -> np.ndarray:
        batch_size = embedding.shape[0]
        
        if self.output_dim > self.input_dim:
            ratio = self.input_dim / self.output_dim
            indices = np.arange(self.output_dim) * ratio
            
            lower_indices = np.floor(indices).astype(int)
            upper_indices = np.minimum(lower_indices + 1, self.input_dim - 1)
            weights = indices - lower_indices
            
            projected = np.zeros((batch_size, self.output_dim), dtype=np.float32)
            for i in range(batch_size):
                projected[i] = (1 - weights) * embedding[i, lower_indices] + weights * embedding[i, upper_indices]
        else:
            ratio = self.output_dim / self.input_dim
            projected = np.zeros((batch_size, self.output_dim), dtype=np.float32)
            for i in range(self.output_dim):
                start_idx = int(i / ratio)
                end_idx = int((i + 1) / ratio)
                projected[:, i] = np.mean(embedding[:, start_idx:end_idx], axis=1)
        
        return projected
    
    def _pad_projection(self, embedding: np.ndarray) -> np.ndarray:
        batch_size = embedding.shape[0]
        
        if self.output_dim > self.input_dim:
            repeats = (self.output_dim + self.input_dim - 1) // self.input_dim
            projected = np.tile(embedding, (1, repeats))[:, :self.output_dim]
        else:
            projected = embedding[:, :self.output_dim]
        
        return projected.astype(np.float32)
    
    def _emergency_projection(self, embedding: np.ndarray, is_batch: bool) -> np.ndarray:
        batch_size = embedding.shape[0]
        current_dim = embedding.shape[1]
        
        if self.output_dim > current_dim:
            repeats = (self.output_dim + current_dim - 1) // current_dim
            projected = np.tile(embedding, (1, repeats))[:, :self.output_dim]
        else:
            projected = embedding[:, :self.output_dim]
        
        norms = np.linalg.norm(projected, axis=1, keepdims=True)
        norms = np.where(norms > 0, norms, 1.0)
        projected = projected / norms
        
        if not is_batch:
            projected = projected[0]
        
        return projected.astype(np.float32)
    
    def _create_random_normalized_vector(self, is_batch: bool) -> np.ndarray:
        if is_batch:
            vector = np.random.randn(1, self.output_dim).astype(np.float32)
        else:
            vector = np.random.randn(self.output_dim).astype(np.float32)
        
        if is_batch:
            norm = np.linalg.norm(vector)
            vector = vector / max(norm, 1e-8)
        else:
            norm = np.linalg.norm(vector)
            vector = vector / max(norm, 1e-8)
        
        logger.warning("Using random normalized vector as emergency fallback")
        return vector

