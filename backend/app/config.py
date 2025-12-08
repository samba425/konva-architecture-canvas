from pydantic_settings import BaseSettings
from typing import Optional, List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "Architecture Builder API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # MongoDB
    MONGODB_URL: str = "mongodb://mongodb:27017"
    MONGODB_DB_NAME: str = "architecture_builder"
    
    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Password Reset
    PASSWORD_RESET_TOKEN_EXPIRE_HOURS: int = 24
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:4200", "http://frontend:4200"]
    
    # =============================================================================
    # LLM Configuration
    # =============================================================================
    
    # Provider selection: openai | azure | ollama
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "openai")
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_API_URL: str = os.getenv("OPENAI_API_URL", "https://api.openai.com/v1")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    # Azure OpenAI Configuration
    AZURE_OPENAI_API_KEY: str = os.getenv("AZURE_OPENAI_API_KEY", "")
    AZURE_OPENAI_ENDPOINT: str = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    AZURE_OPENAI_API_VERSION: str = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
    AZURE_OPENAI_DEPLOYMENT: str = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-5")
    
    # Ollama Configuration (Local LLM)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    
    # LLM Parameters
    LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.7"))
    LLM_MAX_TOKENS: int = int(os.getenv("LLM_MAX_TOKENS", "4096"))
    LLM_MAX_RETRIES: int = int(os.getenv("LLM_MAX_RETRIES", "3"))
    LLM_TIMEOUT: int = int(os.getenv("LLM_TIMEOUT", "120"))
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"
    
    def get_llm_model(self) -> str:
        """Get the model name based on selected provider."""
        if self.LLM_PROVIDER == "azure":
            return self.AZURE_OPENAI_DEPLOYMENT
        elif self.LLM_PROVIDER == "ollama":
            return self.OLLAMA_MODEL
        else:
            return self.OPENAI_MODEL
    
    def get_litellm_model_string(self) -> str:
        """Get model string in LiteLLM format."""
        if self.LLM_PROVIDER == "azure":
            return f"azure/{self.AZURE_OPENAI_DEPLOYMENT}"
        elif self.LLM_PROVIDER == "ollama":
            return f"ollama/{self.OLLAMA_MODEL}"
        else:
            return self.OPENAI_MODEL


settings = Settings()
