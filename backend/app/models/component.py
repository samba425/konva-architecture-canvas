from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId


class PyObjectId(str):
    """Custom type for MongoDB ObjectId."""
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v, handler):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str) and ObjectId.is_valid(v):
            return v
        raise ValueError("Invalid ObjectId")


class ComponentModel(BaseModel):
    """Component model for MongoDB - represents COMPONENTS."""
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    component_id: str = Field(..., description="Unique component identifier, e.g., 'gpt-4'")
    name: str = Field(..., description="Display name of the component")
    icon: str = Field(..., description="Emoji icon for the component")
    fa_icon: str = Field(..., description="FontAwesome icon class")
    category: str = Field(..., description="Category key this component belongs to")
    provider: str = Field(..., description="Provider/vendor name")
    description: str = Field(..., description="Component description")
    color: str = Field(..., description="Hex color code")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "component_id": "gpt-4",
                "name": "GPT-4",
                "icon": "🟢",
                "fa_icon": "fas fa-brain",
                "category": "ai_models",
                "provider": "OpenAI",
                "description": "GPT-4 is a large multimodal model",
                "color": "#10A37F"
            }
        }

