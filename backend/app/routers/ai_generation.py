from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from app.schemas.ai_generation import (
    GenerateDiagramRequest,
    UpdateDiagramRequest,
    DiagramGenerationResponse,
    ProviderStatusResponse,
    LLMProvider,
)
from app.services.ai_generation_service import get_ai_generation_service
from app.utils.security import get_current_user

router = APIRouter()


@router.post(
    "/generate",
    response_model=DiagramGenerationResponse,
    summary="Generate Architecture Diagram",
    description="""
Generate a new architecture diagram from a text description using AI.

The LLM will analyze your description and create a complete diagram JSON including:
- Title and labels
- Component groups for services
- Container boundaries for logical grouping
- Arrows showing connections and data flow

**Example prompts:**
- "Create a microservices architecture for an e-commerce platform"
- "Design a RAG chatbot with vector database and LLM"
- "Build a data pipeline with Kafka, Spark, and S3"
    """,
    responses={
        200: {
            "description": "Diagram generated successfully",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "diagram": {"version": "1.0", "shapes": []},
                        "message": "Architecture diagram generated successfully",
                        "provider_used": "openai",
                        "model_used": "gpt-4o-mini"
                    }
                }
            }
        },
        400: {"description": "Invalid request or generation failed"},
        401: {"description": "Authentication required"},
    }
)
async def generate_diagram(
    request: GenerateDiagramRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a new architecture diagram from a text prompt using AI.
    
    - **prompt**: Detailed description of the architecture (10-5000 chars)
    - **provider**: Optional LLM provider (openai, azure, ollama)
    - **canvas_width**: Canvas width in pixels (default: 1600)
    - **canvas_height**: Canvas height in pixels (default: 900)
    
    Returns the generated diagram JSON that can be rendered in the frontend.
    """
    service = get_ai_generation_service()
    
    # Check provider availability
    provider_status = service.check_provider_status(request.provider)
    if not provider_status["configured"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"LLM provider '{provider_status['provider']}' is not configured. Please set the required environment variables."
        )
    
    result = await service.generate_diagram(
        prompt=request.prompt,
        provider=request.provider,
        canvas_width=request.canvas_width,
        canvas_height=request.canvas_height
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    
    return DiagramGenerationResponse(**result)


@router.post(
    "/update",
    response_model=DiagramGenerationResponse,
    summary="Update Architecture Diagram",
    description="""
Update an existing architecture diagram based on a modification request.

The LLM will analyze your request and the existing diagram, then apply changes such as:
- Adding new components or services
- Removing components
- Modifying connections
- Reorganizing layout
- Adding new layers or groups

**Example update prompts:**
- "Add a caching layer with Redis between the API and database"
- "Remove the monitoring service and add Prometheus instead"
- "Add a CDN in front of the load balancer"
    """,
    responses={
        200: {"description": "Diagram updated successfully"},
        400: {"description": "Invalid request or update failed"},
        401: {"description": "Authentication required"},
    }
)
async def update_diagram(
    request: UpdateDiagramRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Update an existing diagram based on a modification prompt.
    
    - **prompt**: Description of changes to make (5-2000 chars)
    - **existing_diagram**: The current diagram JSON to modify
    - **provider**: Optional LLM provider (openai, azure, ollama)
    
    Returns the complete updated diagram JSON.
    """
    service = get_ai_generation_service()
    
    # Check provider availability
    provider_status = service.check_provider_status(request.provider)
    if not provider_status["configured"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"LLM provider '{provider_status['provider']}' is not configured."
        )
    
    result = await service.update_diagram(
        prompt=request.prompt,
        existing_diagram=request.existing_diagram,
        provider=request.provider
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    
    return DiagramGenerationResponse(**result)


@router.get(
    "/providers",
    response_model=List[ProviderStatusResponse],
    summary="List Available LLM Providers",
    description="Get the status of all supported LLM providers and their configuration.",
)
async def list_providers(current_user: dict = Depends(get_current_user)):
    """
    List all available LLM providers and their configuration status.
    
    Returns status for:
    - **openai**: OpenAI API (GPT-4, GPT-3.5, etc.)
    - **azure**: Azure OpenAI Service
    - **ollama**: Local Ollama instance
    """
    service = get_ai_generation_service()
    
    providers = []
    for provider in LLMProvider:
        status = service.check_provider_status(provider)
        providers.append(ProviderStatusResponse(**status))
    
    return providers


@router.get(
    "/providers/{provider}",
    response_model=ProviderStatusResponse,
    summary="Get Provider Status",
    description="Get the configuration status for a specific LLM provider.",
)
async def get_provider_status(
    provider: LLMProvider,
    current_user: dict = Depends(get_current_user)
):
    """
    Get status for a specific LLM provider.
    
    - **provider**: The provider to check (openai, azure, ollama)
    """
    service = get_ai_generation_service()
    status = service.check_provider_status(provider)
    return ProviderStatusResponse(**status)

