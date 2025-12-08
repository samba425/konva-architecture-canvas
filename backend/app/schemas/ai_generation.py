from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from enum import Enum


class LLMProvider(str, Enum):
    """Supported LLM providers."""
    OPENAI = "openai"
    AZURE = "azure"
    OLLAMA = "ollama"


class GenerateDiagramRequest(BaseModel):
    """Schema for generating a new architecture diagram from a prompt."""
    
    prompt: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="Detailed description of the architecture to generate",
        json_schema_extra={
            "example": "Create a RAG chatbot architecture with a React frontend, FastAPI backend, GPT-4 for LLM, and Pinecone for vector storage. Include data ingestion pipeline with S3 and Apache Airflow."
        }
    )
    provider: Optional[LLMProvider] = Field(
        default=None,
        description="LLM provider to use. If not specified, uses the default from environment."
    )
    canvas_width: int = Field(
        default=1600,
        ge=800,
        le=4000,
        description="Canvas width in pixels"
    )
    canvas_height: int = Field(
        default=900,
        ge=600,
        le=3000,
        description="Canvas height in pixels"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Design a microservices architecture for an e-commerce platform with user service, product catalog, shopping cart, payment gateway, and order management. Use Kubernetes for orchestration, PostgreSQL for databases, and Redis for caching.",
                "provider": "openai",
                "canvas_width": 1600,
                "canvas_height": 900
            }
        }


class UpdateDiagramRequest(BaseModel):
    """Schema for updating an existing diagram based on a prompt."""
    
    prompt: str = Field(
        ...,
        min_length=5,
        max_length=2000,
        description="Description of the changes to make to the diagram",
        json_schema_extra={
            "example": "Add a monitoring layer with Prometheus and Grafana connected to all backend services"
        }
    )
    existing_diagram: Dict[str, Any] = Field(
        ...,
        description="The existing diagram JSON to modify"
    )
    provider: Optional[LLMProvider] = Field(
        default=None,
        description="LLM provider to use. If not specified, uses the default from environment."
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Add a CDN (CloudFront) in front of the API Gateway and add a Redis cache layer between the backend and database",
                "existing_diagram": {
                    "version": "1.0",
                    "canvas": {"width": 1600, "height": 900, "scale": 1, "position": {"x": 0, "y": 0}},
                    "shapes": []
                },
                "provider": "openai"
            }
        }


class DiagramGenerationResponse(BaseModel):
    """Schema for diagram generation response."""
    
    success: bool = Field(description="Whether the generation was successful")
    diagram: Optional[Dict[str, Any]] = Field(
        default=None,
        description="The generated diagram JSON"
    )
    message: str = Field(description="Status message or error description")
    provider_used: str = Field(description="The LLM provider that was used")
    model_used: str = Field(description="The model that was used")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "diagram": {
                    "version": "1.0",
                    "canvas": {"width": 1600, "height": 900, "scale": 1, "position": {"x": 0, "y": 0}},
                    "shapes": []
                },
                "message": "Architecture diagram generated successfully",
                "provider_used": "openai",
                "model_used": "gpt-4o-mini"
            }
        }


class ProviderStatusResponse(BaseModel):
    """Schema for provider status check."""
    
    provider: str = Field(description="Provider name")
    configured: bool = Field(description="Whether the provider is configured")
    available: bool = Field(description="Whether the provider is currently available")
    model: str = Field(description="The configured model for this provider")
    
    class Config:
        json_schema_extra = {
            "example": {
                "provider": "openai",
                "configured": True,
                "available": True,
                "model": "gpt-4o-mini"
            }
        }

