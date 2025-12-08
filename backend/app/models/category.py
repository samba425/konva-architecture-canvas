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


class CategoryModel(BaseModel):
    """Category model for MongoDB - represents COMPONENT_CATEGORIES."""
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    key: str = Field(..., description="Unique category key, e.g., 'infrastructure'")
    name: str = Field(..., description="Display name of the category")
    icon: str = Field(..., description="FontAwesome icon class")
    description: str = Field(..., description="Category description")
    color: str = Field(..., description="Hex color code")
    order: int = Field(..., ge=1, description="Display order")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "key": "infrastructure",
                "name": "Infrastructure",
                "icon": "fas fa-server",
                "description": "Core computing and server infrastructure components",
                "color": "#2196F3",
                "order": 1
            }
        }

