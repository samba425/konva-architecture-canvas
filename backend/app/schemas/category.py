from pydantic import BaseModel, Field
from typing import Optional


class CategoryCreate(BaseModel):
    """Schema for creating a new category."""
    key: str = Field(..., min_length=1, max_length=50, description="Unique category key")
    name: str = Field(..., min_length=1, max_length=100, description="Display name")
    icon: str = Field(..., description="FontAwesome icon class")
    description: str = Field(..., max_length=500, description="Category description")
    color: str = Field(..., pattern=r"^#[0-9A-Fa-f]{6}$", description="Hex color code")
    order: int = Field(..., ge=1, description="Display order")
    
    class Config:
        json_schema_extra = {
            "example": {
                "key": "security",
                "name": "Security",
                "icon": "fas fa-shield-alt",
                "description": "Security and compliance components",
                "color": "#E91E63",
                "order": 10
            }
        }


class CategoryUpdate(BaseModel):
    """Schema for updating a category."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    icon: Optional[str] = None
    description: Optional[str] = Field(None, max_length=500)
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")
    order: Optional[int] = Field(None, ge=1)


class CategoryResponse(BaseModel):
    """Schema for category response."""
    id: str
    key: str
    name: str
    icon: str
    description: str
    color: str
    order: int
    
    class Config:
        from_attributes = True

