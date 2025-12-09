# LLM Service

Centralized LLM and embeddings service for the Novus RAG platform. This microservice consolidates all language model and embedding operations, providing a unified API with intelligent fallback strategies, caching, and dimension projection.

## Features

### LLM Management
- **Multi-Provider Support**: Azure OpenAI, OpenAI, and local models
- **Automatic Fallback**: Configurable provider fallback chains
- **Token Management**: Thread-safe OAuth2 token caching with automatic refresh
- **Instance Caching**: LLM instance pooling with TTL-based eviction
- **Context Management**: Efficient handling of token limits and context windows

### Embeddings Generation
- **Hybrid Strategy**: OpenAI + local model fallback with dimension matching
- **Multi-Level Fallback**:
  1. OpenAI `text-embedding-3-small` (1536d)
  2. Local `all-mpnet-base-v2` (768d) → projected to 1536d
  3. Local `all-MiniLM-L6-v2` (384d) → projected to 1536d
  4. Random normalized fallback (emergency)
- **Dimension Projection**: Automatic transformation to unified 1536d space
- **Batch Processing**: Efficient batch embedding generation
- **Content-Aware Caching**: TTL optimization based on content type

### Performance Optimization
- **Redis Caching**: Fast embedding and projection weight caching
- **xxHash**: 10x faster cache key generation vs MD5
- **Lazy Loading**: Models loaded on-demand to reduce memory footprint
- **Thread Safety**: All caches protected with locks for concurrent access

## Architecture

```
services/llm-service/
├── app/
│   ├── __init__.py              # Package initialization
│   ├── config.py                # Unified configuration
│   ├── exports.py               # Public API
│   ├── core/                    # Core functionality
│   │   ├── token_manager.py     # OAuth2 token management
│   │   ├── cache_manager.py     # Unified caching layer
│   │   ├── dimension_projector.py # 768d/384d → 1536d projection
│   │   └── llm_factory.py       # LLM creation factory
│   └── providers/               # Provider implementations
│       ├── azure_provider.py    # Azure OpenAI provider
│       ├── openai_provider.py   # OpenAI provider
│       ├── local_provider.py    # Local transformer models
│       └── embeddings_provider.py # Unified embeddings
├── Dockerfile
├── setup.py
├── requirements.txt
└── README.md
```

## Installation

### As a Python Package

```bash
cd services/llm-service
pip install -e .
```

### Docker

```bash
docker build -t novus-llm-service services/llm-service/
docker run --env-file .env.llm-service novus-llm-service
```

## Configuration

### Environment Variables

Copy `env.llm-service.example` to `.env` and configure:

#### Provider Selection
```bash
LLM_PROVIDER=azure              # azure | openai | local
EMBEDDING_PROVIDER=hybrid       # openai | local | hybrid
```

#### Azure OpenAI Configuration
```bash
TOKEN_URL=https://your-oauth-endpoint.com/token
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
AZURE_OPENAI_APP_KEY=your-app-key
AZURE_ENDPOINT=https://your-azure-endpoint.openai.azure.com
AZURE_API_VERSION=2023-08-01-preview
```

#### OpenAI Configuration
```bash
OPENAI_API_KEY=sk-...
OPENAI_API_URL=https://api.openai.com/v1  # optional
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

#### Model Configuration
```bash
GRAPH_LLM_MODEL=gpt-4
GRAPH_LLM_TEMPERATURE=0
GRAPH_LLM_MAX_TOKENS=1000
OPENAI_FALLBACK_MODEL=gpt-4o-mini
```

#### Local Model Configuration
```bash
FALLBACK_EMBEDDING_MODEL=sentence-transformers/all-mpnet-base-v2
TERTIARY_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LOCAL_MODEL_CACHE_DIR=/models
```

#### Caching Configuration
```bash
ENABLE_TOKEN_CACHING=true
TOKEN_CACHE_TTL=3300           # 55 minutes
ENABLE_LLM_CACHING=true
LLM_CACHE_TTL=3600             # 1 hour
ENABLE_EMBEDDING_CACHING=true
EMBEDDING_CACHE_TTL=3600
EMBEDDING_CACHE_MAX_SIZE=1000
```

#### Dimension Projection
```bash
ENABLE_DIMENSION_PROJECTION=true
TARGET_EMBEDDING_DIMENSION=1536
PROJECTION_METHOD=learned       # learned | interpolate | pad
PROJECTION_CACHE_KEY=embedding:projection:weights
```

#### Redis Configuration
```bash
REDIS_URL=redis://localhost:6379/0
```

## Usage

### Import in Other Services

```python
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../llm-service'))

from app.exports import (
    get_llm,
    get_embeddings_function,
    embed_query,
    embed_documents,
    DimensionProjector,
    clear_llm_cache,
    clear_embedding_cache,
    get_llm_info,
    get_embedding_cache_stats
)
```

### LLM Operations

```python
# Get LLM instance (cached, with fallback)
llm = get_llm()

# Use with LangChain
from langchain.schema import HumanMessage
response = llm.invoke([HumanMessage(content="Your query")])

# Force refresh LLM instance
llm = get_llm(force_refresh=True)

# Get specific provider
llm = get_llm(provider="openai")

# Clear LLM cache
clear_llm_cache()

# Get LLM info and stats
info = get_llm_info()
print(info['llm_cache'])  # Cache statistics
print(info['token_info'])  # Token status
```

### Embedding Operations

```python
# Get embeddings function (hybrid with fallback)
embeddings_func = get_embeddings_function()

# Embed single query
query_embedding = embed_query("What is RAG?")
print(f"Dimension: {len(query_embedding)}")  # 1536

# Embed multiple documents
doc_embeddings = embed_documents([
    "Document 1 text",
    "Document 2 text",
    "Document 3 text"
])

# Async embedding
query_embedding = await aembed_query("What is RAG?")
doc_embeddings = await aembed_documents(["Doc 1", "Doc 2"])

# Use with LangChain
from langchain.vectorstores import Weaviate
vectorstore = Weaviate(
    embedding=embeddings_func,
    # ... other params
)

# Clear embedding cache
clear_embedding_cache()

# Get cache statistics
stats = get_embedding_cache_stats()
print(f"Cache size: {stats['total_entries']}")
print(f"Valid entries: {stats['valid_entries']}")
print(f"TTL: {stats['ttl_seconds']}s")
```

### Dimension Projection

```python
from app.core.dimension_projector import DimensionProjector
import numpy as np

# Create projector (768d → 1536d)
projector = DimensionProjector(
    input_dim=768,
    output_dim=1536,
    method="learned",  # learned | interpolate | pad
    redis_client=redis_client,
    cache_key="projection:weights"
)

# Initialize (loads from cache or creates new)
await projector.initialize()

# Project embedding
small_embedding = np.random.randn(768)
large_embedding = projector.project(small_embedding)
print(f"Projected: {len(large_embedding)}d")  # 1536

# Batch projection
batch_embeddings = np.random.randn(10, 768)
projected_batch = projector.project(batch_embeddings)
print(projected_batch.shape)  # (10, 1536)
```

## Provider Configuration

### Azure OpenAI Provider

Requires OAuth2 authentication with token endpoint:

```python
from app.providers.azure_provider import AzureProvider

provider = AzureProvider()
llm = provider.create_llm()
```

Features:
- Automatic token refresh
- Token cache with 55min TTL
- Retry logic with exponential backoff
- Error detection and recovery

### OpenAI Provider

Standard OpenAI API with optional base URL:

```python
from app.providers.openai_provider import OpenAIProvider

provider = OpenAIProvider()
llm = provider.create_llm()
async_client = provider.get_async_client()
```

Features:
- AsyncOpenAI client support
- Custom API endpoints
- Rate limiting ready

### Local Provider

SentenceTransformer models for offline operation:

```python
from app.providers.local_provider import LocalProvider

provider = LocalProvider()
model = provider.load_sentence_transformer("all-mpnet-base-v2")
dim = provider.get_model_dimension("all-mpnet-base-v2")  # 768
```

Features:
- Lazy model loading
- Model caching
- Dimension auto-detection
- Configurable cache directory

### Embeddings Provider

Unified embeddings with intelligent fallback:

```python
from app.providers.embeddings_provider import EmbeddingsProvider

provider = EmbeddingsProvider()
await provider.initialize_projectors()  # Setup dimension projection

embeddings_func = provider.get_embeddings_function()
query_emb = provider.embed_query("Query text")
doc_embs = provider.embed_documents(["Doc 1", "Doc 2"])
```

Fallback chain:
1. OpenAI API (if configured)
2. Local all-mpnet-base-v2 with projection
3. Local all-MiniLM-L6-v2 with projection
4. Random normalized vector (emergency)

## Cache Management

### Token Cache

- Thread-safe with locks
- TTL: 55 minutes (configurable)
- Automatic refresh before expiry
- Error-triggered invalidation

### LLM Instance Cache

- Per-model caching
- TTL: 1 hour (configurable)
- Thread-safe access
- Model version tracking

### Embedding Cache

- xxHash for fast key generation
- Content-type aware TTL
- Redis-backed persistence
- Size-limited with LRU eviction
- Configurable max size

### Projection Weights Cache

- Redis-backed storage
- 7-day TTL
- Per-dimension caching
- Automatic serialization

## Dimension Projection Methods

### Learned Projection (Recommended)

Linear transformation with He initialization:
```
y = Wx + b
where W ∈ ℝ^(output_dim × input_dim)
```

- Best semantic preservation
- Normalized output (unit vectors)
- Cached in Redis

### Interpolation

Linear interpolation for upsampling, average pooling for downsampling:

- Good for quick fallback
- No training required
- Deterministic

### Padding

Repetition for upsampling, truncation for downsampling:

- Fastest method
- Preserves original values
- Less semantic preservation

## Performance Tuning

### Batch Sizes

```bash
OPENAI_EMBEDDING_BATCH_SIZE=100  # Adjust based on text length
LOCAL_BATCH_SIZE=32              # GPU memory dependent
```

### Cache Sizes

```bash
EMBEDDING_CACHE_MAX_SIZE=1000    # Increase for better hit rate
TOKEN_CACHE_TTL=3300             # Lower for faster refresh
LLM_CACHE_TTL=3600               # Higher for fewer recreations
```

### Content-Type TTL Multipliers

In `cache_manager.py`:
```python
ttl_multipliers = {
    "technical": 2.0,     # 48 hours
    "code": 2.0,          # 48 hours  
    "configuration": 1.5, # 36 hours
    "text": 1.0,          # 24 hours (default)
    "summary": 0.5        # 12 hours
}
```

## Error Handling

### Automatic Fallback

LLM providers try in order until success:
1. Azure OpenAI (if configured)
2. OpenAI (if configured)
3. Local model (if configured)
4. Return None

Embeddings try in order:
1. OpenAI API
2. Local all-mpnet-base-v2 (768d → 1536d)
3. Local all-MiniLM-L6-v2 (384d → 1536d)
4. Random normalized vector

### Token Errors

Automatically detected and handled:
- 401 Unauthorized
- Token expired
- Invalid token
- Authentication failed

Response: Clear cache, retry with fresh token

### Retry Logic

- Token fetch: 3 retries with 2s delay
- LLM creation: 3 retries with exponential backoff
- Embeddings: 3 retries with exponential backoff (tenacity)

## Monitoring

### Cache Statistics

```python
# LLM cache stats
info = get_llm_info()
print(info['llm_cache']['cache_valid'])
print(info['llm_cache']['cache_age'])

# Embedding cache stats
stats = get_embedding_cache_stats()
print(f"Hit rate: {stats['valid_entries']}/{stats['total_entries']}")

# Token status
info = get_llm_info()
print(f"Token valid: {info['token_info']['token_valid']}")
print(f"Token age: {info['token_info']['token_age']}s")
```

### Logging

Set log level:
```python
import logging
logging.getLogger('app').setLevel(logging.DEBUG)
```

Key log messages:
- Token fetch/refresh
- LLM creation/caching
- Embedding generation
- Cache hits/misses
- Fallback triggers
- Error recovery

## Migration Guide

### From Query Service

Replace:
```python
from .agents.llm_provider import get_llm, get_embeddings_function
```

With:
```python
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../llm-service'))
from app.exports import get_llm, get_embeddings_function
```

### From Upload Service

Replace:
```python
from .services.llm_provider import get_llm
```

With:
```python
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../llm-service'))
from app.exports import get_llm
```

### From Metadata Extractor

Replace:
```python
from llm_provider import get_llm
```

With:
```python
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../services/llm-service'))
from app.exports import get_llm
```

### From Embedding Service

Import DimensionProjector:
```python
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../llm-service'))
from app.core.dimension_projector import DimensionProjector
```

## Dependencies

```
langchain-openai>=0.2.14
openai>=1.107.0
pydantic>=2.11.10
pydantic-settings>=2.11.0
python-dotenv>=1.1.1
requests>=2.32.3
sentence-transformers>=5.1.0
numpy>=2.2.6
redis>=5.2.1
xxhash>=3.5.0
```

## License

Open source - see main project LICENSE file.

## Contributing

When contributing:
1. Maintain backward compatibility with existing services
2. Add tests for new providers
3. Update this README with new features
4. Follow existing code style and patterns
5. Ensure thread safety for all caches
6. Document environment variables

## Troubleshooting

### "OpenAI client not initialized"
- Check `OPENAI_API_KEY` is set
- Verify API key format (starts with `sk-`)
- Check network connectivity

### "Azure token fetch failed"
- Verify `TOKEN_URL`, `CLIENT_ID`, `CLIENT_SECRET`
- Check token endpoint accessibility
- Review token expiry settings

### "Projection dimensions mismatch"
- Ensure `TARGET_EMBEDDING_DIMENSION=1536`
- Check model dimension in `embedding_dimensions` config
- Verify projection method is valid

### "Cache connection failed"
- Verify Redis is running
- Check `REDIS_URL` configuration
- Test Redis connectivity: `redis-cli ping`

### "Model not found"
- Check model name spelling
- Verify HuggingFace model exists
- Check `LOCAL_MODEL_CACHE_DIR` permissions

## Support

For issues and questions:
- Check logs with DEBUG level enabled
- Review configuration settings
- Verify all environment variables
- Test connectivity to external services
- Check cache statistics for anomalies

