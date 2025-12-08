# Architecture Builder - Backend API

FastAPI-based backend for the Architecture Builder application with AI-powered diagram generation.

## Features

- JWT-based authentication (register, login, password reset)
- CRUD APIs for component categories
- CRUD APIs for components
- User-scoped diagram management
- **AI-powered diagram generation using LLM**
- MongoDB storage
- Swagger UI and ReDoc documentation

## Quick Start

### Prerequisites

- Python 3.12+
- MongoDB 8.0+
- (Optional) OpenAI API key, Azure OpenAI, or Ollama for AI features

### Local Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp ../env.example .env
# Edit .env with your configuration
```

4. Seed the database:
```bash
python seed_database.py
```

5. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker

Run with Docker Compose from the project root:
```bash
docker-compose up -d
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login and get JWT tokens |
| POST | `/refresh` | Refresh access token |
| POST | `/forgot-password` | Request password reset |
| POST | `/reset-password` | Reset password |
| GET | `/me` | Get current user profile |

### Categories (`/api/v1/categories`) - Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all categories |
| GET | `/{key}` | Get category by key |
| POST | `/` | Create category |
| PUT | `/{key}` | Update category |
| DELETE | `/{key}` | Delete category |

### Components (`/api/v1/components`) - Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all components |
| GET | `/{component_id}` | Get component |
| POST | `/` | Create component |
| PUT | `/{component_id}` | Update component |
| DELETE | `/{component_id}` | Delete component |

### Diagrams (`/api/v1/diagrams`) - Protected, User-scoped
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List user's diagrams |
| GET | `/{diagram_id}` | Get diagram JSON |
| POST | `/` | Save new diagram |
| PUT | `/{diagram_id}` | Update diagram |
| DELETE | `/{diagram_id}` | Delete diagram |
| POST | `/{diagram_id}/duplicate` | Duplicate diagram |

### AI Generation (`/api/v1/ai`) - Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate` | Generate diagram from text prompt |
| POST | `/update` | Update existing diagram with text prompt |
| GET | `/providers` | List available LLM providers |
| GET | `/providers/{provider}` | Get provider status |

## AI-Powered Diagram Generation

The AI endpoints allow you to generate and modify architecture diagrams using natural language.

### Generate a New Diagram

```bash
curl -X POST "http://localhost:8000/api/v1/ai/generate" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a microservices architecture for an e-commerce platform with user service, product catalog, shopping cart, and payment gateway using Kubernetes",
    "provider": "openai",
    "canvas_width": 1600,
    "canvas_height": 900
  }'
```

### Update an Existing Diagram

```bash
curl -X POST "http://localhost:8000/api/v1/ai/update" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Add a Redis caching layer between the API Gateway and backend services",
    "existing_diagram": { ... your diagram JSON ... },
    "provider": "openai"
  }'
```

### Supported LLM Providers

1. **OpenAI** (`provider: "openai"`)
   - Models: gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo
   - Best for: Production use, highest quality

2. **Azure OpenAI** (`provider: "azure"`)
   - Enterprise-grade, data residency compliance
   - Requires Azure subscription

3. **Ollama** (`provider: "ollama"`)
   - Local LLM, no API costs
   - Models: llama3.2, mistral, codellama, etc.
   - Best for: Development, privacy-sensitive use

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Settings (including LLM config)
│   ├── database.py          # MongoDB connection
│   ├── seed_data.py         # Seed data definitions
│   ├── models/              # Pydantic models
│   ├── schemas/             # Request/Response schemas
│   │   ├── ai_generation.py # AI generation schemas
│   │   └── ...
│   ├── routers/             # API route handlers
│   │   ├── ai_generation.py # AI endpoints
│   │   └── ...
│   ├── services/            # Business logic
│   │   ├── ai_generation_service.py
│   │   └── ...
│   └── utils/               # Utilities (JWT, etc.)
├── seed_database.py         # Database seeding script
├── requirements.txt
└── Dockerfile
```

## Environment Variables

### Core Settings
| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URL | MongoDB connection URL | mongodb://localhost:27017 |
| MONGODB_DB_NAME | Database name | architecture_builder |
| JWT_SECRET_KEY | Secret for JWT signing | (required) |
| DEBUG | Enable debug mode | false |

### LLM Settings
| Variable | Description | Default |
|----------|-------------|---------|
| LLM_PROVIDER | Provider: openai, azure, ollama | openai |
| OPENAI_API_KEY | OpenAI API key | - |
| OPENAI_MODEL | OpenAI model | gpt-4o-mini |
| AZURE_OPENAI_API_KEY | Azure OpenAI key | - |
| AZURE_OPENAI_ENDPOINT | Azure endpoint URL | - |
| AZURE_OPENAI_DEPLOYMENT | Azure deployment name | gpt-4 |
| OLLAMA_BASE_URL | Ollama server URL | http://localhost:11434 |
| OLLAMA_MODEL | Ollama model | llama3.2 |
| LLM_TEMPERATURE | Response creativity (0-1) | 0.7 |
| LLM_MAX_TOKENS | Max response tokens | 4096 |

## Example Prompts for AI Generation

### Simple RAG Chatbot
```
Create a RAG chatbot architecture with a React frontend, FastAPI backend, 
GPT-4 for the LLM, and Pinecone for vector storage. Include a data 
ingestion pipeline with S3.
```

### Microservices E-commerce
```
Design a microservices architecture for an e-commerce platform with:
- User authentication service
- Product catalog service
- Shopping cart service
- Payment gateway integration
- Order management service
Use Kubernetes for orchestration, PostgreSQL for databases, and Redis for caching.
```

### Data Pipeline
```
Build a real-time data pipeline with Apache Kafka for streaming, 
Apache Spark for processing, S3 for storage, and Grafana/Prometheus 
for monitoring.
```
