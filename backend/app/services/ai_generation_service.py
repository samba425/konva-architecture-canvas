import json
import logging
from typing import Optional, Dict, Any
from datetime import datetime

import litellm

from app.config import settings
from app.schemas.ai_generation import LLMProvider

logger = logging.getLogger(__name__)

# Disable verbose litellm logging
litellm.set_verbose = False


# System prompt for diagram generation
DIAGRAM_GENERATION_SYSTEM_PROMPT = """You are an expert architecture diagram generator. Your task is to create JSON structures that can be rendered as visual architecture diagrams.

The JSON structure you generate must follow this exact format:
{
  "version": "1.0",
  "created": "<ISO timestamp>",
  "canvas": {
    "width": <canvas_width>,
    "height": <canvas_height>,
    "scale": 1,
    "position": {"x": 0, "y": 0}
  },
  "shapes": [
    // Array of shape objects
  ]
}

Available shape types:

1. **Text** - For titles and labels:
{
  "id": "shape-<unique_id>",
  "type": "Text",
  "x": <x_position>,
  "y": <y_position>,
  "rotation": 0,
  "text": "<text_content>",
  "fontSize": <12-32>,
  "fontFamily": "Arial",
  "fill": "<hex_color>",
  "width": <width>,
  "fontStyle": "bold" or "normal"
}

2. **Rect** - For containers/groups/boundaries:
{
  "id": "shape-<unique_id>",
  "type": "Rect",
  "x": <x_position>,
  "y": <y_position>,
  "rotation": 0,
  "width": <width>,
  "height": <height>,
  "fill": "rgba(r, g, b, 0.08)",
  "stroke": "<hex_color>",
  "strokeWidth": 2,
  "cornerRadius": 8
}

3. **Group** - For components (this is the main building block for services/components):
{
  "id": "shape-<unique_id>",
  "type": "Group",
  "x": <x_position>,
  "y": <y_position>,
  "rotation": 0,
  "componentName": "<component_display_name>",
  "componentIcon": "📦",
  "groupType": "component-group",
  "faIcon": "<fontawesome_icon_class>",
  "iconColor": "<hex_color>"
}

Common faIcon values:
- AI/ML: "fas fa-brain", "fas fa-robot", "fas fa-microchip"
- Databases: "fas fa-database", "fas fa-server"
- APIs: "fas fa-door-open", "fas fa-plug", "fas fa-code"
- Storage: "fas fa-hdd", "fas fa-cloud", "fab fa-aws"
- Security: "fas fa-shield-alt", "fas fa-lock", "fas fa-key"
- Analytics: "fas fa-chart-line", "fas fa-chart-bar"
- Containers: "fas fa-cube", "fas fa-cubes", "fas fa-dharmachakra"
- Frontend: "fas fa-desktop", "fas fa-mobile-alt", "fas fa-globe"
- Network: "fas fa-network-wired", "fas fa-wifi"
- Processing: "fas fa-cogs", "fas fa-bolt", "fas fa-stream"

4. **Arrow** - For connections between components:
{
  "id": "shape-<unique_id>",
  "type": "Arrow",
  "x": 0,
  "y": 0,
  "rotation": 0,
  "points": [<start_x>, <start_y>, <end_x>, <end_y>],
  "stroke": "rgba(r, g, b, 1)",
  "strokeWidth": 2,
  "fill": "rgba(r, g, b, 1)",
  "pointerLength": 10,
  "pointerWidth": 10
}

IMPORTANT GUIDELINES:
1. Space components evenly with ~150-180px between them
2. Use containers (Rect) to group related components (e.g., Frontend Layer, Backend Layer, Data Layer)
3. Add a title Text at the top of the diagram
4. Use color coding: 
   - Purple (#7c3aed) for frontend
   - Green (#10b981) for backend
   - Blue (#3b82f6) for data/storage
   - Orange (#f59e0b) for AI/ML
   - Red (#ef4444) for security
5. Arrow points should connect from the center-bottom of source to center-top of target
6. Component sizes are typically 80x60 pixels
7. Container padding should be ~20-30px
8. Start IDs from shape-1 and increment

ONLY output valid JSON. Do not include any explanation or markdown code blocks."""


DIAGRAM_UPDATE_SYSTEM_PROMPT = """You are an expert architecture diagram editor. Your task is to modify existing JSON diagram structures based on user requests.

You will receive:
1. An existing diagram JSON structure
2. A user request describing what changes to make

Your job is to:
1. Analyze the existing diagram structure
2. Apply the requested changes
3. Return the COMPLETE modified diagram JSON

When adding new components:
- Generate unique IDs that don't conflict with existing ones
- Position new elements appropriately relative to existing ones
- Add necessary arrows to connect new components
- Update container boundaries if needed

When modifying existing components:
- Keep IDs of modified elements the same
- Update only the requested properties
- Maintain connections (arrows) unless explicitly asked to remove

When removing components:
- Remove the component shapes
- Remove any arrows connected to them
- Adjust remaining layout if necessary

ONLY output valid JSON. Do not include any explanation or markdown code blocks."""


class AIGenerationService:
    """Service for AI-powered diagram generation using LiteLLM."""
    
    def __init__(self):
        self._configure_litellm()
    
    def _configure_litellm(self):
        """Configure LiteLLM based on provider settings."""
        # Set API keys based on provider
        if settings.OPENAI_API_KEY:
            litellm.api_key = settings.OPENAI_API_KEY
        
        # Azure configuration
        if settings.AZURE_OPENAI_API_KEY and settings.AZURE_OPENAI_ENDPOINT:
            litellm.api_base = settings.AZURE_OPENAI_ENDPOINT
            litellm.api_version = settings.AZURE_OPENAI_API_VERSION
    
    def _get_model_string(self, provider: Optional[LLMProvider] = None) -> str:
        """Get the LiteLLM model string based on provider."""
        provider_str = provider.value if provider else settings.LLM_PROVIDER
        
        if provider_str == "azure":
            return f"azure/{settings.AZURE_OPENAI_DEPLOYMENT}"
        elif provider_str == "ollama":
            return f"ollama/{settings.OLLAMA_MODEL}"
        else:
            return settings.OPENAI_MODEL
    
    def _get_provider_credentials(self, provider: Optional[LLMProvider] = None) -> Dict[str, Any]:
        """Get credentials for the specified provider."""
        provider_str = provider.value if provider else settings.LLM_PROVIDER
        
        if provider_str == "azure":
            return {
                "api_key": settings.AZURE_OPENAI_API_KEY,
                "api_base": settings.AZURE_OPENAI_ENDPOINT,
                "api_version": settings.AZURE_OPENAI_API_VERSION,
            }
        elif provider_str == "ollama":
            return {
                "api_base": settings.OLLAMA_BASE_URL,
            }
        else:
            creds = {"api_key": settings.OPENAI_API_KEY}
            if settings.OPENAI_API_URL:
                creds["api_base"] = settings.OPENAI_API_URL
            return creds
    
    async def generate_diagram(
        self,
        prompt: str,
        provider: Optional[LLMProvider] = None,
        canvas_width: int = 1600,
        canvas_height: int = 900
    ) -> Dict[str, Any]:
        """
        Generate an architecture diagram JSON from a text prompt.
        
        Args:
            prompt: Description of the architecture to generate
            provider: LLM provider to use (optional, uses default if not specified)
            canvas_width: Width of the canvas
            canvas_height: Height of the canvas
            
        Returns:
            Dictionary containing the generated diagram JSON
        """
        model = self._get_model_string(provider)
        credentials = self._get_provider_credentials(provider)
        provider_str = provider.value if provider else settings.LLM_PROVIDER
        
        logger.info(f"Generating diagram with provider: {provider_str}, model: {model}")
        
        user_prompt = f"""Generate an architecture diagram for the following description:

{prompt}

Canvas dimensions: {canvas_width}x{canvas_height} pixels

Create a well-organized, visually appealing diagram with:
1. A clear title at the top
2. Logical grouping of related components using containers (Rect)
3. All necessary services and components as Group shapes
4. Arrows showing data flow and connections
5. Proper spacing and alignment"""
        
        messages = [
            {"role": "system", "content": DIAGRAM_GENERATION_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ]
        
        try:
            response = await litellm.acompletion(
                model=model,
                messages=messages,
                temperature=settings.LLM_TEMPERATURE,
                max_tokens=settings.LLM_MAX_TOKENS,
                timeout=settings.LLM_TIMEOUT,
                **credentials
            )
            
            content = response.choices[0].message.content
            
            # Clean the response (remove markdown code blocks if present)
            content = self._clean_json_response(content)
            
            # Parse and validate the JSON
            diagram = json.loads(content)
            
            # Add timestamp if not present
            if "created" not in diagram:
                diagram["created"] = datetime.utcnow().isoformat() + "Z"
            
            return {
                "success": True,
                "diagram": diagram,
                "message": "Architecture diagram generated successfully",
                "provider_used": provider_str,
                "model_used": model
            }
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response as JSON: {e}")
            return {
                "success": False,
                "diagram": None,
                "message": f"Failed to parse generated diagram: {str(e)}",
                "provider_used": provider_str,
                "model_used": model
            }
        except Exception as e:
            logger.error(f"LLM generation failed: {e}")
            return {
                "success": False,
                "diagram": None,
                "message": f"Generation failed: {str(e)}",
                "provider_used": provider_str,
                "model_used": model
            }
    
    async def update_diagram(
        self,
        prompt: str,
        existing_diagram: Dict[str, Any],
        provider: Optional[LLMProvider] = None
    ) -> Dict[str, Any]:
        """
        Update an existing diagram based on a text prompt.
        
        Args:
            prompt: Description of the changes to make
            existing_diagram: The existing diagram JSON
            provider: LLM provider to use (optional)
            
        Returns:
            Dictionary containing the updated diagram JSON
        """
        model = self._get_model_string(provider)
        credentials = self._get_provider_credentials(provider)
        provider_str = provider.value if provider else settings.LLM_PROVIDER
        
        logger.info(f"Updating diagram with provider: {provider_str}, model: {model}")
        
        user_prompt = f"""Update the following architecture diagram based on this request:

REQUEST: {prompt}

EXISTING DIAGRAM:
{json.dumps(existing_diagram, indent=2)}

Apply the requested changes and return the complete updated diagram JSON."""
        
        messages = [
            {"role": "system", "content": DIAGRAM_UPDATE_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ]
        
        try:
            response = await litellm.acompletion(
                model=model,
                messages=messages,
                temperature=settings.LLM_TEMPERATURE,
                max_tokens=settings.LLM_MAX_TOKENS,
                timeout=settings.LLM_TIMEOUT,
                **credentials
            )
            
            content = response.choices[0].message.content
            
            # Clean the response
            content = self._clean_json_response(content)
            
            # Parse and validate the JSON
            diagram = json.loads(content)
            
            # Update timestamp
            diagram["updated"] = datetime.utcnow().isoformat() + "Z"
            
            return {
                "success": True,
                "diagram": diagram,
                "message": "Diagram updated successfully",
                "provider_used": provider_str,
                "model_used": model
            }
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response as JSON: {e}")
            return {
                "success": False,
                "diagram": None,
                "message": f"Failed to parse updated diagram: {str(e)}",
                "provider_used": provider_str,
                "model_used": model
            }
        except Exception as e:
            logger.error(f"LLM update failed: {e}")
            return {
                "success": False,
                "diagram": None,
                "message": f"Update failed: {str(e)}",
                "provider_used": provider_str,
                "model_used": model
            }
    
    def _clean_json_response(self, content: str) -> str:
        """Clean LLM response to extract valid JSON."""
        content = content.strip()
        
        # Remove markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        
        if content.endswith("```"):
            content = content[:-3]
        
        return content.strip()
    
    def check_provider_status(self, provider: Optional[LLMProvider] = None) -> Dict[str, Any]:
        """Check if a provider is configured and available."""
        provider_str = provider.value if provider else settings.LLM_PROVIDER
        
        if provider_str == "openai":
            configured = bool(settings.OPENAI_API_KEY)
            model = settings.OPENAI_MODEL
        elif provider_str == "azure":
            configured = bool(settings.AZURE_OPENAI_API_KEY and settings.AZURE_OPENAI_ENDPOINT)
            model = settings.AZURE_OPENAI_DEPLOYMENT
        elif provider_str == "ollama":
            configured = bool(settings.OLLAMA_BASE_URL)
            model = settings.OLLAMA_MODEL
        else:
            configured = False
            model = "unknown"
        
        return {
            "provider": provider_str,
            "configured": configured,
            "available": configured,  # For now, assume configured = available
            "model": model
        }


# Singleton instance
_ai_service: Optional[AIGenerationService] = None


def get_ai_generation_service() -> AIGenerationService:
    """Get or create the AI generation service singleton."""
    global _ai_service
    if _ai_service is None:
        _ai_service = AIGenerationService()
    return _ai_service

