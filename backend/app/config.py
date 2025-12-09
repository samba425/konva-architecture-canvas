from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = Field(default="Architecture Builder API")
    APP_VERSION: str = Field(default="1.0.0")
    DEBUG: bool = Field(default=False)
    
    # MongoDB
    MONGODB_URL: str = Field(default="mongodb://mongodb:27017")
    MONGODB_DB_NAME: str = Field(default="architecture_builder")
    
    # JWT Settings
    JWT_SECRET_KEY: str = Field(default="your-super-secret-key-change-in-production")
    JWT_ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7)
    
    # Password Reset
    PASSWORD_RESET_TOKEN_EXPIRE_HOURS: int = Field(default=24)
    
    # CORS
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:4200", "http://frontend:4200"])
    
    # =============================================================================
    # LLM Configuration
    # =============================================================================
    
    # Provider selection: openai | azure | ollama
    LLM_PROVIDER: str = Field(default="openai")
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = Field(default="")
    OPENAI_API_URL: str = Field(default="https://api.openai.com/v1")
    OPENAI_MODEL: str = Field(default="gpt-4o-mini")
    
    # Azure OpenAI Configuration
    AZURE_OPENAI_API_KEY: str = Field(default="")
    AZURE_OPENAI_ENDPOINT: str = Field(default="https://chat-ai.cisco.com")
    AZURE_OPENAI_API_VERSION: str = Field(default="2023-08-01-preview")
    AZURE_OPENAI_DEPLOYMENT: str = Field(default="gpt-4.1")
    AZURE_OPENAI_APP_KEY: str = Field(default="")
    AZURE_USER_ID: str = Field(default="")
    
    # OAuth2 Token Authentication (for Cisco Azure)
    TOKEN_URL: str = Field(default="")
    CLIENT_ID: str = Field(default="")
    CLIENT_SECRET: str = Field(default="")
    ENABLE_TOKEN_CACHING: bool = Field(default=True)
    TOKEN_CACHE_TTL: float = Field(default=3300.0)  # 55 minutes
    
    # Ollama Configuration (Local LLM)
    OLLAMA_BASE_URL: str = Field(default="http://localhost:11434")
    OLLAMA_MODEL: str = Field(default="llama3.2")
    
    # LLM Parameters
    LLM_TEMPERATURE: float = Field(default=0.7)
    LLM_MAX_TOKENS: int = Field(default=4096)
    LLM_MAX_RETRIES: int = Field(default=3)
    LLM_TIMEOUT: int = Field(default=120)
    
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
