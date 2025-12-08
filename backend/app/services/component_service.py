from typing import List, Optional
from bson import ObjectId

from app.database import get_database
from app.schemas.component import ComponentCreate, ComponentUpdate


class ComponentService:
    """Service class for component-related operations."""
    
    @staticmethod
    async def get_all_components(category: Optional[str] = None) -> List[dict]:
        """Get all components, optionally filtered by category."""
        db = get_database()
        
        query = {}
        if category:
            query["category"] = category
        
        cursor = db.components.find(query).sort("name", 1)
        return await cursor.to_list(length=None)
    
    @staticmethod
    async def get_component_by_id(component_id: str) -> Optional[dict]:
        """Get a component by its component_id."""
        db = get_database()
        return await db.components.find_one({"component_id": component_id})
    
    @staticmethod
    async def create_component(component_data: ComponentCreate) -> dict:
        """Create a new component."""
        db = get_database()
        
        # Check if component_id already exists
        existing = await db.components.find_one({"component_id": component_data.component_id})
        if existing:
            raise ValueError(f"Component with ID '{component_data.component_id}' already exists")
        
        # Verify category exists
        category = await db.component_categories.find_one({"key": component_data.category})
        if not category:
            raise ValueError(f"Category '{component_data.category}' does not exist")
        
        component_doc = {
            "_id": str(ObjectId()),
            "component_id": component_data.component_id,
            "name": component_data.name,
            "icon": component_data.icon,
            "fa_icon": component_data.fa_icon,
            "category": component_data.category,
            "provider": component_data.provider,
            "description": component_data.description,
            "color": component_data.color,
        }
        
        await db.components.insert_one(component_doc)
        return component_doc
    
    @staticmethod
    async def update_component(component_id: str, component_data: ComponentUpdate) -> Optional[dict]:
        """Update an existing component."""
        db = get_database()
        
        # Build update document with only provided fields
        update_fields = {}
        if component_data.name is not None:
            update_fields["name"] = component_data.name
        if component_data.icon is not None:
            update_fields["icon"] = component_data.icon
        if component_data.fa_icon is not None:
            update_fields["fa_icon"] = component_data.fa_icon
        if component_data.category is not None:
            # Verify new category exists
            category = await db.component_categories.find_one({"key": component_data.category})
            if not category:
                raise ValueError(f"Category '{component_data.category}' does not exist")
            update_fields["category"] = component_data.category
        if component_data.provider is not None:
            update_fields["provider"] = component_data.provider
        if component_data.description is not None:
            update_fields["description"] = component_data.description
        if component_data.color is not None:
            update_fields["color"] = component_data.color
        
        if not update_fields:
            # Nothing to update, return current component
            return await db.components.find_one({"component_id": component_id})
        
        result = await db.components.find_one_and_update(
            {"component_id": component_id},
            {"$set": update_fields},
            return_document=True
        )
        
        return result
    
    @staticmethod
    async def delete_component(component_id: str) -> bool:
        """Delete a component by component_id."""
        db = get_database()
        result = await db.components.delete_one({"component_id": component_id})
        return result.deleted_count > 0
    
    @staticmethod
    async def seed_components(components: dict) -> int:
        """Seed components from a dictionary (used for initial data population)."""
        db = get_database()
        count = 0
        
        for comp_id, component in components.items():
            existing = await db.components.find_one({"component_id": comp_id})
            if not existing:
                component_doc = {
                    "_id": str(ObjectId()),
                    "component_id": comp_id,
                    "name": component["name"],
                    "icon": component["icon"],
                    "fa_icon": component.get("faIcon", ""),
                    "category": component["category"],
                    "provider": component["provider"],
                    "description": component["description"],
                    "color": component["color"],
                }
                await db.components.insert_one(component_doc)
                count += 1
        
        return count

