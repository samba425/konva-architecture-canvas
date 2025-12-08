from pydantic import BaseModel, Field
from typing import Optional


class ComponentCreate(BaseModel):
    """Schema for creating a new component."""
    component_id: str = Field(..., min_length=1, max_length=50, description="Unique component ID")
    name: str = Field(..., min_length=1, max_length=100, description="Display name")
    icon: str = Field(..., description="Emoji icon")
    fa_icon: str = Field(..., description="FontAwesome icon class")
    category: str = Field(..., description="Category key")
    provider: str = Field(..., max_length=100, description="Provider/vendor name")
    description: str = Field(..., max_length=500, description="Component description")
    color: str = Field(..., pattern=r"^#[0-9A-Fa-f]{6}$", description="Hex color code")
    
    class Config:
        json_schema_extra = {
            "example": {
                "component_id": "mistral",
                "name": "Mistral AI",
                "icon": "🌀",
                "fa_icon": "fas fa-wind",
                "category": "ai_models",
                "provider": "Mistral",
                "description": "Open-source large language model",
                "color": "#FF6B35"
            }
        }


class ComponentUpdate(BaseModel):
    """Schema for updating a component."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    icon: Optional[str] = None
    fa_icon: Optional[str] = None
    category: Optional[str] = None
    provider: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")


class ComponentResponse(BaseModel):
    """Schema for component response."""
    id: str
    component_id: str
    name: str
    icon: str
    fa_icon: str
    category: str
    provider: str
    description: str
    color: str
    
    class Config:
        from_attributes = True

