from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from contextlib import asynccontextmanager

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routers import auth, categories, components, diagrams, ai_generation


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


def custom_openapi():
    """Custom OpenAPI schema with better documentation."""
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="""
## Architecture Builder API

Backend API for the Architecture Builder application - Create, manage, and AI-generate architecture diagrams.

### Features

- **Authentication**: JWT-based authentication with registration, login, and password reset
- **Categories**: Manage component categories for organizing diagram elements
- **Components**: CRUD operations for reusable architecture components
- **Diagrams**: User-scoped diagram management with save/load functionality
- **AI Generation**: Generate and update diagrams using LLM (OpenAI, Azure OpenAI, Ollama)

### Authentication

Most endpoints require authentication. Use the `/api/v1/auth/login` endpoint to get a JWT token,
then include it in the `Authorization` header as `Bearer <token>`.

### AI-Powered Features

The `/api/v1/ai` endpoints allow you to:
- Generate complete architecture diagrams from text descriptions
- Update existing diagrams using natural language commands
- Supports multiple LLM providers: OpenAI, Azure OpenAI, and local Ollama
        """,
        routes=app.routes,
    )
    
    # Add security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token obtained from /api/v1/auth/login"
        }
    }
    
    # Apply security to all paths except auth endpoints
    for path in openapi_schema["paths"]:
        if not path.startswith("/api/v1/auth/login") and not path.startswith("/api/v1/auth/register"):
            for method in openapi_schema["paths"][path]:
                if method in ["get", "post", "put", "delete", "patch"]:
                    openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]
    
    # Add tags metadata
    openapi_schema["tags"] = [
        {
            "name": "Authentication",
            "description": "User authentication and authorization endpoints"
        },
        {
            "name": "Categories",
            "description": "Component category management"
        },
        {
            "name": "Components",
            "description": "Architecture component management"
        },
        {
            "name": "Diagrams",
            "description": "User diagram CRUD operations"
        },
        {
            "name": "AI Generation",
            "description": "AI-powered diagram generation and modification using LLM"
        }
    ]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Architecture Builder - Create and manage architecture diagrams",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Override OpenAPI schema
app.openapi = custom_openapi

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(components.router, prefix="/api/v1/components", tags=["Components"])
app.include_router(diagrams.router, prefix="/api/v1/diagrams", tags=["Diagrams"])
app.include_router(ai_generation.router, prefix="/api/v1/ai", tags=["AI Generation"])


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for container orchestration."""
    return {"status": "healthy"}
