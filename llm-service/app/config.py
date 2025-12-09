import os
from typing import Dict, Any
from pydantic import Field
from pydantic_settings import BaseSettings


class LLMServiceSettings(BaseSettings):
    llm_provider: str = Field(default="azure", description="LLM provider: azure | openai | local")
    embedding_provider: str = Field(default="hybrid", description="Embedding provider: openai | local | hybrid")
    
    enable_token_caching: bool = Field(default=True, description="Enable token caching")
    token_cache_ttl: float = Field(default=3300.0, description="Token cache TTL in seconds (55 minutes)")
    
    enable_llm_caching: bool = Field(default=True, description="Enable LLM instance caching")
    llm_cache_ttl: float = Field(default=3600.0, description="LLM cache TTL in seconds (1 hour)")
    
    enable_embedding_caching: bool = Field(default=True, description="Enable embedding caching")
    embedding_cache_ttl: float = Field(default=3600.0, description="Embedding cache TTL in seconds")
    embedding_cache_max_size: int = Field(default=1000, description="Max embedding cache size")
    
    token_url: str = Field(default="", description="Azure token URL for OAuth2")
    client_id: str = Field(default="", description="Azure client ID")
    client_secret: str = Field(default="", description="Azure client secret")
    azure_openai_app_key: str = Field(default="", description="Azure OpenAI app key")
    azure_user_id: str = Field(default="", description="Azure user ID (optional)")
    azure_endpoint: str = Field(default="https://chat-ai.cisco.com", description="Azure OpenAI endpoint")
    azure_api_version: str = Field(default="2023-08-01-preview", description="Azure API version")
    
    openai_api_key: str = Field(default="", description="OpenAI API key")
    openai_api_url: str = Field(default="", description="OpenAI API base URL")
    openai_embedding_model: str = Field(default="text-embedding-3-small", description="OpenAI embedding model")
    
    graph_llm_model: str = Field(default="gpt-4.1", description="Primary LLM model")
    graph_llm_temperature: float = Field(default=0.0, description="LLM temperature")
    graph_llm_max_tokens: int = Field(default=1000, description="LLM max tokens")
    
    openai_fallback_model: str = Field(default="gpt-4o-mini", description="OpenAI fallback model")
    llm_max_retries: int = Field(default=3, description="Max LLM retries")
    llm_retry_delay: int = Field(default=2, description="LLM retry delay in seconds")
    
    fallback_embedding_model: str = Field(default="sentence-transformers/all-mpnet-base-v2", description="Fallback local embedding model")
    tertiary_embedding_model: str = Field(default="sentence-transformers/all-MiniLM-L6-v2", description="Tertiary fallback embedding model")
    local_model_cache_dir: str = Field(default="/models", description="Local model cache directory")
    
    enable_dimension_projection: bool = Field(default=True, description="Enable dimension projection for fallback models")
    target_embedding_dimension: int = Field(default=1536, description="Target dimension for all embeddings")
    projection_method: str = Field(default="learned", description="Projection method: learned | interpolate | pad")
    projection_cache_key: str = Field(default="embedding:projection:weights", description="Redis key for projection weights")
    
    redis_url: str = Field(default="redis://localhost:6379/0", description="Redis URL for caching")
    
    embedding_dimensions: Dict[str, int] = Field(
        default_factory=lambda: {
            "text-embedding-3-large": 3072,
            "text-embedding-3-small": 1536,
            "text-embedding-ada-002": 1536,
            "sentence-transformers/all-mpnet-base-v2": 768,
            "sentence-transformers/all-MiniLM-L6-v2": 384,
            "bge-large-en-v1.5": 1024,
            "bge-base-en-v1.5": 768
        },
        description="Mapping of model names to their embedding dimensions"
    )
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        env_prefix = ""
        extra = "ignore"  # Ignore extra environment variables from other services


def get_settings() -> LLMServiceSettings:
    return LLMServiceSettings(
        llm_provider=os.getenv("LLM_PROVIDER", "azure"),
        embedding_provider=os.getenv("EMBEDDING_PROVIDER", "hybrid"),
        enable_token_caching=os.getenv("ENABLE_TOKEN_CACHING", "true").lower() == "true",
        token_cache_ttl=float(os.getenv("TOKEN_CACHE_TTL", "3300")),
        enable_llm_caching=os.getenv("ENABLE_LLM_CACHING", "true").lower() == "true",
        llm_cache_ttl=float(os.getenv("LLM_CACHE_TTL", "3600")),
        enable_embedding_caching=os.getenv("ENABLE_EMBEDDING_CACHING", "true").lower() == "true",
        embedding_cache_ttl=float(os.getenv("EMBEDDING_CACHE_TTL", "3600")),
        embedding_cache_max_size=int(os.getenv("EMBEDDING_CACHE_MAX_SIZE", "1000")),
        token_url=os.getenv("TOKEN_URL", ""),
        client_id=os.getenv("CLIENT_ID", ""),
        client_secret=os.getenv("CLIENT_SECRET", ""),
        azure_openai_app_key=os.getenv("AZURE_OPENAI_APP_KEY", ""),
        azure_user_id=os.getenv("AZURE_USER_ID", ""),
        azure_endpoint=os.getenv("AZURE_ENDPOINT", "https://chat-ai.cisco.com"),
        azure_api_version=os.getenv("AZURE_API_VERSION", "2023-08-01-preview"),
        openai_api_key=os.getenv("OPENAI_API_KEY", ""),
        openai_api_url=os.getenv("OPENAI_API_URL", ""),
        openai_embedding_model=os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"),
        graph_llm_model=os.getenv("GRAPH_LLM_MODEL", "gpt-4.1"),
        graph_llm_temperature=float(os.getenv("GRAPH_LLM_TEMPERATURE", "0")),
        graph_llm_max_tokens=int(os.getenv("GRAPH_LLM_MAX_TOKENS", "1000")),
        openai_fallback_model=os.getenv("OPENAI_FALLBACK_MODEL", "gpt-4o-mini"),
        llm_max_retries=int(os.getenv("LLM_MAX_RETRIES", "3")),
        llm_retry_delay=int(os.getenv("LLM_RETRY_DELAY", "2")),
        fallback_embedding_model=os.getenv("FALLBACK_EMBEDDING_MODEL", "sentence-transformers/all-mpnet-base-v2"),
        tertiary_embedding_model=os.getenv("TERTIARY_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"),
        local_model_cache_dir=os.getenv("LOCAL_MODEL_CACHE_DIR", "/models"),
        enable_dimension_projection=os.getenv("ENABLE_DIMENSION_PROJECTION", "true").lower() == "true",
        target_embedding_dimension=int(os.getenv("TARGET_EMBEDDING_DIMENSION", "1536")),
        projection_method=os.getenv("PROJECTION_METHOD", "learned"),
        projection_cache_key=os.getenv("PROJECTION_CACHE_KEY", "embedding:projection:weights"),
        redis_url=os.getenv("REDIS_URL", "redis://localhost:6379/0")
    )


settings = get_settings()

