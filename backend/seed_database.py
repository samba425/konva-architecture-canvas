#!/usr/bin/env python3
"""
Database seeding script for Architecture Builder.
Run this script to populate the database with initial categories and components.

Usage:
    python seed_database.py [--force]
    
Options:
    --force    Force re-seed even if data exists (will skip duplicates)
"""

import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# Import seed data
from app.seed_data import SEED_CATEGORIES, SEED_COMPONENTS
from app.config import settings


async def seed_categories(db, force: bool = False) -> int:
    """Seed categories into the database."""
    count = 0
    
    for key, category in SEED_CATEGORIES.items():
        existing = await db.component_categories.find_one({"key": key})
        
        if existing and not force:
            print(f"  Category '{key}' already exists, skipping...")
            continue
        
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
            print(f"  + Created category: {category['name']}")
            count += 1
    
    return count


async def seed_components(db, force: bool = False) -> int:
    """Seed components into the database."""
    count = 0
    
    for comp_id, component in SEED_COMPONENTS.items():
        existing = await db.components.find_one({"component_id": comp_id})
        
        if existing and not force:
            print(f"  Component '{comp_id}' already exists, skipping...")
            continue
        
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
            print(f"  + Created component: {component['name']}")
            count += 1
    
    return count


async def create_indexes(db):
    """Create necessary database indexes."""
    print("\nCreating indexes...")
    
    # Users collection indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("username", unique=True)
    print("  + Created users indexes")
    
    # Categories collection indexes
    await db.component_categories.create_index("key", unique=True)
    await db.component_categories.create_index("order")
    print("  + Created categories indexes")
    
    # Components collection indexes
    await db.components.create_index("component_id", unique=True)
    await db.components.create_index("category")
    print("  + Created components indexes")
    
    # Diagrams collection indexes
    await db.diagrams.create_index("user_id")
    await db.diagrams.create_index([("user_id", 1), ("name", 1)])
    print("  + Created diagrams indexes")


async def main(force: bool = False):
    """Main seeding function."""
    print("=" * 50)
    print("Architecture Builder - Database Seeding")
    print("=" * 50)
    
    print(f"\nConnecting to MongoDB: {settings.MONGODB_URL}")
    print(f"Database: {settings.MONGODB_DB_NAME}")
    
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    try:
        # Test connection
        await client.admin.command('ping')
        print("Connected successfully!\n")
        
        # Create indexes
        await create_indexes(db)
        
        # Seed categories
        print("\nSeeding categories...")
        cat_count = await seed_categories(db, force)
        print(f"  Categories seeded: {cat_count}")
        
        # Seed components
        print("\nSeeding components...")
        comp_count = await seed_components(db, force)
        print(f"  Components seeded: {comp_count}")
        
        # Summary
        print("\n" + "=" * 50)
        print("Seeding completed!")
        print(f"  Total categories: {await db.component_categories.count_documents({})}")
        print(f"  Total components: {await db.components.count_documents({})}")
        print("=" * 50)
        
    except Exception as e:
        print(f"\nError: {e}")
        sys.exit(1)
    finally:
        client.close()


if __name__ == "__main__":
    force = "--force" in sys.argv
    if force:
        print("Force mode enabled - will attempt to add all seed data")
    
    asyncio.run(main(force))

