from datetime import datetime
from typing import List, Optional
from bson import ObjectId

from app.database import get_database
from app.schemas.diagram import DiagramCreate, DiagramUpdate


class DiagramService:
    """Service class for diagram-related operations."""
    
    @staticmethod
    async def get_user_diagrams(user_id: str) -> List[dict]:
        """Get all diagrams for a specific user."""
        db = get_database()
        cursor = db.diagrams.find({"user_id": user_id}).sort("updated_at", -1)
        return await cursor.to_list(length=None)
    
    @staticmethod
    async def get_diagram_by_id(diagram_id: str, user_id: str) -> Optional[dict]:
        """Get a specific diagram by ID, ensuring it belongs to the user."""
        db = get_database()
        return await db.diagrams.find_one({
            "_id": diagram_id,
            "user_id": user_id
        })
    
    @staticmethod
    async def create_diagram(user_id: str, diagram_data: DiagramCreate) -> dict:
        """Create a new diagram for a user."""
        db = get_database()
        
        now = datetime.utcnow()
        
        # Convert shapes to dict format
        shapes_list = [shape.model_dump(exclude_none=True) for shape in diagram_data.shapes]
        
        diagram_doc = {
            "_id": str(ObjectId()),
            "user_id": user_id,
            "name": diagram_data.name,
            "description": diagram_data.description,
            "version": diagram_data.version,
            "canvas": diagram_data.canvas.model_dump(),
            "shapes": shapes_list,
            "created_at": now,
            "updated_at": now,
        }
        
        await db.diagrams.insert_one(diagram_doc)
        return diagram_doc
    
    @staticmethod
    async def update_diagram(diagram_id: str, user_id: str, diagram_data: DiagramUpdate) -> Optional[dict]:
        """Update an existing diagram."""
        db = get_database()
        
        # Build update document with only provided fields
        update_fields = {"updated_at": datetime.utcnow()}
        
        if diagram_data.name is not None:
            update_fields["name"] = diagram_data.name
        if diagram_data.description is not None:
            update_fields["description"] = diagram_data.description
        if diagram_data.version is not None:
            update_fields["version"] = diagram_data.version
        if diagram_data.canvas is not None:
            update_fields["canvas"] = diagram_data.canvas.model_dump()
        if diagram_data.shapes is not None:
            update_fields["shapes"] = [shape.model_dump(exclude_none=True) for shape in diagram_data.shapes]
        
        result = await db.diagrams.find_one_and_update(
            {"_id": diagram_id, "user_id": user_id},
            {"$set": update_fields},
            return_document=True
        )
        
        return result
    
    @staticmethod
    async def delete_diagram(diagram_id: str, user_id: str) -> bool:
        """Delete a diagram by ID, ensuring it belongs to the user."""
        db = get_database()
        result = await db.diagrams.delete_one({
            "_id": diagram_id,
            "user_id": user_id
        })
        return result.deleted_count > 0
    
    @staticmethod
    async def duplicate_diagram(diagram_id: str, user_id: str, new_name: Optional[str] = None) -> Optional[dict]:
        """Duplicate an existing diagram."""
        db = get_database()
        
        # Get the original diagram
        original = await db.diagrams.find_one({
            "_id": diagram_id,
            "user_id": user_id
        })
        
        if not original:
            return None
        
        now = datetime.utcnow()
        
        # Create a copy with new ID and updated timestamps
        new_diagram = {
            "_id": str(ObjectId()),
            "user_id": user_id,
            "name": new_name or f"{original['name']} (Copy)",
            "description": original.get("description"),
            "version": original.get("version", "1.0"),
            "canvas": original.get("canvas", {}),
            "shapes": original.get("shapes", []),
            "created_at": now,
            "updated_at": now,
        }
        
        await db.diagrams.insert_one(new_diagram)
        return new_diagram

