from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime


class PositionSchema(BaseModel):
    """Canvas position schema."""
    x: float = 0
    y: float = 0


class CanvasSchema(BaseModel):
    """Canvas configuration schema."""
    width: int = Field(default=1600, ge=100)
    height: int = Field(default=900, ge=100)
    scale: float = Field(default=1.0, gt=0)
    position: PositionSchema = Field(default_factory=PositionSchema)


class ShapeSchema(BaseModel):
    """Shape schema - flexible to accommodate all shape types."""
    id: str
    type: str
    x: float = 0
    y: float = 0
    rotation: float = 0
    
    # All optional fields for different shape types
    componentName: Optional[str] = None
    componentIcon: Optional[str] = None
    groupType: Optional[str] = None
    faIcon: Optional[str] = None
    iconColor: Optional[str] = None
    points: Optional[List[float]] = None
    stroke: Optional[str] = None
    strokeWidth: Optional[float] = None
    fill: Optional[str] = None
    pointerLength: Optional[float] = None
    pointerWidth: Optional[float] = None
    dash: Optional[List[float]] = None
    text: Optional[str] = None
    fontSize: Optional[int] = None
    fontFamily: Optional[str] = None
    fontStyle: Optional[str] = None
    width: Optional[float] = None
    height: Optional[float] = None
    cornerRadius: Optional[float] = None
    scaleX: Optional[float] = None
    scaleY: Optional[float] = None
    children: Optional[List["ShapeSchema"]] = None
    
    class Config:
        extra = "allow"


class DiagramCreate(BaseModel):
    """Schema for creating a new diagram."""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    version: str = Field(default="1.0")
    canvas: CanvasSchema = Field(default_factory=CanvasSchema)
    shapes: List[ShapeSchema] = Field(default_factory=list)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "My Architecture",
                "description": "Sample architecture diagram",
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


class DiagramUpdate(BaseModel):
    """Schema for updating a diagram."""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    version: Optional[str] = None
    canvas: Optional[CanvasSchema] = None
    shapes: Optional[List[ShapeSchema]] = None


class DiagramResponse(BaseModel):
    """Schema for full diagram response."""
    id: str
    user_id: str
    name: str
    description: Optional[str]
    version: str
    canvas: CanvasSchema
    shapes: List[ShapeSchema]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DiagramListResponse(BaseModel):
    """Schema for diagram list item (without full shape data)."""
    id: str
    name: str
    description: Optional[str]
    version: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

