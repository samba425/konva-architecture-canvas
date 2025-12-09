import logging
import os
from typing import Dict, Optional

from ..config import settings

logger = logging.getLogger(__name__)


class LocalProvider:
    def __init__(self):
        self._models: Dict[str, any] = {}
        logger.info("LocalProvider initialized")
    
    def load_sentence_transformer(self, model_name: str):
        if model_name in self._models:
            logger.debug(f"Using cached local model: {model_name}")
            return self._models[model_name]
        
        try:
            from sentence_transformers import SentenceTransformer
            
            logger.info(f"Loading local SentenceTransformer model: {model_name}")
            
            cache_folder = settings.local_model_cache_dir if settings.local_model_cache_dir else None
            
            model = SentenceTransformer(model_name, cache_folder=cache_folder)
            self._models[model_name] = model
            
            logger.info(f"Successfully loaded local model: {model_name}")
            return model
            
        except ImportError:
            logger.error("sentence-transformers not available")
            return None
        except Exception as e:
            logger.error(f"Failed to load local model {model_name}: {e}")
            return None
    
    def get_model_dimension(self, model_name: str) -> Optional[int]:
        if model_name in settings.embedding_dimensions:
            return settings.embedding_dimensions[model_name]
        
        model = self.load_sentence_transformer(model_name)
        if model:
            try:
                test_embedding = model.encode(["test"])
                return len(test_embedding[0])
            except Exception as e:
                logger.error(f"Failed to get dimension for {model_name}: {e}")
        
        return None
    
    def clear_models(self):
        self._models.clear()
        logger.info("Cleared all local models")

