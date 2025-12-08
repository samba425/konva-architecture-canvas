from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime
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


class PositionModel(BaseModel):
    """Canvas position model."""
    x: float = 0
    y: float = 0


class CanvasModel(BaseModel):
    """Canvas configuration model."""
    width: int = Field(default=1600, description="Canvas width in pixels")
    height: int = Field(default=900, description="Canvas height in pixels")
    scale: float = Field(default=1.0, description="Canvas zoom scale")
    position: PositionModel = Field(default_factory=PositionModel)


class ShapeModel(BaseModel):
    """Shape model - can represent various shape types (Group, Arrow, Text, Rect, etc.)."""
    id: str = Field(..., description="Unique shape identifier")
    type: str = Field(..., description="Shape type: Group, Arrow, Text, Rect, etc.")
    x: float = Field(default=0, description="X position")
    y: float = Field(default=0, description="Y position")
    rotation: float = Field(default=0, description="Rotation angle")
    
    # Optional fields depending on shape type
    componentName: Optional[str] = None
    componentIcon: Optional[str] = None
    groupType: Optional[str] = None
    faIcon: Optional[str] = None
    iconColor: Optional[str] = None
    
    # Arrow specific
    points: Optional[List[float]] = None
    stroke: Optional[str] = None
    strokeWidth: Optional[float] = None
    fill: Optional[str] = None
    pointerLength: Optional[float] = None
    pointerWidth: Optional[float] = None
    dash: Optional[List[float]] = None
    
    # Text specific
    text: Optional[str] = None
    fontSize: Optional[int] = None
    fontFamily: Optional[str] = None
    fontStyle: Optional[str] = None
    width: Optional[float] = None
    
    # Rect specific
    height: Optional[float] = None
    cornerRadius: Optional[float] = None
    
    # Group specific
    scaleX: Optional[float] = None
    scaleY: Optional[float] = None
    children: Optional[List["ShapeModel"]] = None
    
    class Config:
        extra = "allow"  # Allow additional fields for flexibility


class DiagramModel(BaseModel):
    """Diagram model for MongoDB - stores complete diagram data."""
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: PyObjectId = Field(..., description="Owner user ID")
    name: str = Field(..., min_length=1, max_length=200, description="Diagram name")
    description: Optional[str] = Field(default=None, max_length=1000, description="Diagram description")
    version: str = Field(default="1.0", description="Diagram schema version")
    canvas: CanvasModel = Field(default_factory=CanvasModel, description="Canvas configuration")
    shapes: List[ShapeModel] = Field(default_factory=list, description="List of shapes in the diagram")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "name": "My Architecture Diagram",
                "description": "A sample architecture diagram",
                "version": "1.0",
                "canvas": {
                    "width": 1600,
                    "height": 900,
                    "scale": 1,
                    "position": {"x": 0, "y": 0}
                },
                "shapes": []
            }
        }

