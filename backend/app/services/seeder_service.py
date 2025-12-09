"""
Smart Seeder Service for Architecture Builder

This service automatically syncs seed data from JSON file to MongoDB on application startup.
It only updates/inserts items that have changed or are new, leaving existing data untouched.

Features:
- Loads seed data from JSON file (backend/app/data/seed_data.json)
- Uses content hashing to detect changes
- Performs upsert operations (insert if new, update if changed)
- Skips items that haven't changed
- Logs all operations for transparency
"""

import json
import hashlib
import logging
from pathlib import Path
from typing import Dict, Any, Tuple
from datetime import datetime

from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)


class SeederService:
    """Smart seeder service for managing default data in MongoDB."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.seed_file_path = Path(__file__).parent.parent / "data" / "seed_data.json"
    
    def _compute_hash(self, data: Dict[str, Any]) -> str:
        """Compute a hash of the data for change detection."""
        # Sort keys to ensure consistent hashing
        json_str = json.dumps(data, sort_keys=True, ensure_ascii=False)
        return hashlib.sha256(json_str.encode()).hexdigest()[:16]
    
    def _load_seed_data(self) -> Dict[str, Any]:
        """Load seed data from JSON file."""
        if not self.seed_file_path.exists():
            logger.warning(f"Seed data file not found: {self.seed_file_path}")
            return {"categories": {}, "components": {}}
        
        with open(self.seed_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        logger.info(f"Loaded seed data from {self.seed_file_path}")
        return data
    
    async def _sync_categories(self, categories: Dict[str, Any]) -> Tuple[int, int, int]:
        """
        Sync categories to MongoDB.
        
        Returns: (inserted, updated, skipped) counts
        """
        inserted = 0
        updated = 0
        skipped = 0
        
        for key, category_data in categories.items():
            # Prepare document with hash for change detection
            doc_data = {
                "name": category_data["name"],
                "icon": category_data["icon"],
                "description": category_data["description"],
                "color": category_data["color"],
                "order": category_data["order"],
            }
            content_hash = self._compute_hash(doc_data)
            
            # Check if category exists
            existing = await self.db.component_categories.find_one({"key": key})
            
            if existing:
                # Check if content has changed
                if existing.get("_seed_hash") == content_hash:
                    skipped += 1
                    continue
                
                # Update existing category
                await self.db.component_categories.update_one(
                    {"key": key},
                    {
                        "$set": {
                            **doc_data,
                            "_seed_hash": content_hash,
                            "_seed_updated_at": datetime.utcnow(),
                        }
                    }
                )
                updated += 1
                logger.info(f"Updated category: {key}")
            else:
                # Insert new category with string _id
                from bson import ObjectId
                await self.db.component_categories.insert_one({
                    "_id": str(ObjectId()),
                    "key": key,
                    **doc_data,
                    "_seed_hash": content_hash,
                    "_seed_created_at": datetime.utcnow(),
                    "_is_default": True,
                })
                inserted += 1
                logger.info(f"Inserted category: {key}")
        
        return inserted, updated, skipped
    
    async def _sync_components(self, components: Dict[str, Any]) -> Tuple[int, int, int]:
        """
        Sync components to MongoDB.
        
        Returns: (inserted, updated, skipped) counts
        """
        inserted = 0
        updated = 0
        skipped = 0
        
        for component_id, component_data in components.items():
            # Prepare document with hash for change detection
            doc_data = {
                "name": component_data["name"],
                "icon": component_data["icon"],
                "fa_icon": component_data.get("fa_icon", ""),
                "category": component_data["category"],
                "provider": component_data["provider"],
                "description": component_data["description"],
                "color": component_data["color"],
            }
            content_hash = self._compute_hash(doc_data)
            
            # Check if component exists
            existing = await self.db.components.find_one({"component_id": component_id})
            
            if existing:
                # Check if content has changed
                if existing.get("_seed_hash") == content_hash:
                    skipped += 1
                    continue
                
                # Update existing component
                await self.db.components.update_one(
                    {"component_id": component_id},
                    {
                        "$set": {
                            **doc_data,
                            "_seed_hash": content_hash,
                            "_seed_updated_at": datetime.utcnow(),
                        }
                    }
                )
                updated += 1
                logger.info(f"Updated component: {component_id}")
            else:
                # Insert new component with string _id
                from bson import ObjectId
                await self.db.components.insert_one({
                    "_id": str(ObjectId()),
                    "component_id": component_id,
                    **doc_data,
                    "_seed_hash": content_hash,
                    "_seed_created_at": datetime.utcnow(),
                    "_is_default": True,
                })
                inserted += 1
                logger.info(f"Inserted component: {component_id}")
        
        return inserted, updated, skipped
    
    async def run_seed(self) -> Dict[str, Any]:
        """
        Run the seeding process.
        
        This method:
        1. Loads seed data from JSON file
        2. Syncs categories (insert new, update changed, skip unchanged)
        3. Syncs components (insert new, update changed, skip unchanged)
        
        Returns summary of operations performed.
        """
        logger.info("=" * 50)
        logger.info("Starting database seeding...")
        logger.info("=" * 50)
        
        # Load seed data
        seed_data = self._load_seed_data()
        
        categories = seed_data.get("categories", {})
        components = seed_data.get("components", {})
        
        # Sync categories
        logger.info(f"Syncing {len(categories)} categories...")
        cat_inserted, cat_updated, cat_skipped = await self._sync_categories(categories)
        
        # Sync components
        logger.info(f"Syncing {len(components)} components...")
        comp_inserted, comp_updated, comp_skipped = await self._sync_components(components)
        
        # Summary
        summary = {
            "categories": {
                "total": len(categories),
                "inserted": cat_inserted,
                "updated": cat_updated,
                "skipped": cat_skipped,
            },
            "components": {
                "total": len(components),
                "inserted": comp_inserted,
                "updated": comp_updated,
                "skipped": comp_skipped,
            }
        }
        
        logger.info("=" * 50)
        logger.info("Seeding completed!")
        logger.info(f"Categories: {cat_inserted} inserted, {cat_updated} updated, {cat_skipped} unchanged")
        logger.info(f"Components: {comp_inserted} inserted, {comp_updated} updated, {comp_skipped} unchanged")
        logger.info("=" * 50)
        
        return summary


async def run_seeder(db: AsyncIOMotorDatabase) -> Dict[str, Any]:
    """
    Convenience function to run the seeder.
    
    Args:
        db: MongoDB database instance
        
    Returns:
        Summary of seeding operations
    """
    seeder = SeederService(db)
    return await seeder.run_seed()

