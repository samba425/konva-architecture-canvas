from typing import List, Optional
from bson import ObjectId

from app.database import get_database
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    """Service class for category-related operations."""
    
    @staticmethod
    async def get_all_categories() -> List[dict]:
        """Get all categories sorted by order."""
        db = get_database()
        cursor = db.component_categories.find().sort("order", 1)
        return await cursor.to_list(length=None)
    
    @staticmethod
    async def get_category_by_key(key: str) -> Optional[dict]:
        """Get a category by its key."""
        db = get_database()
        return await db.component_categories.find_one({"key": key})
    
    @staticmethod
    async def create_category(category_data: CategoryCreate) -> dict:
        """Create a new category."""
        db = get_database()
        
        # Check if key already exists
        existing = await db.component_categories.find_one({"key": category_data.key})
        if existing:
            raise ValueError(f"Category with key '{category_data.key}' already exists")
        
        category_doc = {
            "_id": str(ObjectId()),
            "key": category_data.key,
            "name": category_data.name,
            "icon": category_data.icon,
            "description": category_data.description,
            "color": category_data.color,
            "order": category_data.order,
        }
        
        await db.component_categories.insert_one(category_doc)
        return category_doc
    
    @staticmethod
    async def update_category(key: str, category_data: CategoryUpdate) -> Optional[dict]:
        """Update an existing category."""
        db = get_database()
        
        # Build update document with only provided fields
        update_fields = {}
        if category_data.name is not None:
            update_fields["name"] = category_data.name
        if category_data.icon is not None:
            update_fields["icon"] = category_data.icon
        if category_data.description is not None:
            update_fields["description"] = category_data.description
        if category_data.color is not None:
            update_fields["color"] = category_data.color
        if category_data.order is not None:
            update_fields["order"] = category_data.order
        
        if not update_fields:
            # Nothing to update, return current category
            return await db.component_categories.find_one({"key": key})
        
        result = await db.component_categories.find_one_and_update(
            {"key": key},
            {"$set": update_fields},
            return_document=True
        )
        
        return result
    
    @staticmethod
    async def delete_category(key: str) -> bool:
        """Delete a category by key."""
        db = get_database()
        result = await db.component_categories.delete_one({"key": key})
        return result.deleted_count > 0
    
    @staticmethod
    async def seed_categories(categories: dict) -> int:
        """Seed categories from a dictionary (used for initial data population)."""
        db = get_database()
        count = 0
        
        for key, category in categories.items():
            existing = await db.component_categories.find_one({"key": key})
            if not existing:
                category_doc = {
                    "_id": str(ObjectId()),
                    "key": key,
                    "name": category["name"],
                    "icon": category["icon"],
                    "description": category["description"],
                    "color": category["color"],
                    "order": category["order"],
                }
                await db.component_categories.insert_one(category_doc)
                count += 1
        
        return count

