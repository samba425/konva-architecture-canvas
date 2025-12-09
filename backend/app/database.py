from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Global database client
client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo():
    """Create database connection and run seeder."""
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    # Create indexes
    await create_indexes()
    
    # Run seeder to sync default data
    await run_seed_data()
    
    logger.info(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")


async def close_mongo_connection():
    """Close database connection."""
    global client
    if client:
        client.close()
        logger.info("Closed MongoDB connection")


async def create_indexes():
    """Create necessary indexes for collections."""
    global db
    if db is None:
        return
    
    # Users collection indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("username", unique=True)
    
    # Categories collection indexes
    await db.component_categories.create_index("key", unique=True)
    await db.component_categories.create_index("order")
    
    # Components collection indexes
    await db.components.create_index("component_id", unique=True)
    await db.components.create_index("category")
    
    # Diagrams collection indexes
    await db.diagrams.create_index("user_id")
    await db.diagrams.create_index([("user_id", 1), ("name", 1)])
    
    logger.info("Database indexes created")


async def run_seed_data():
    """
    Run the smart seeder to sync default data.
    
    This will:
    - Load seed data from JSON file (backend/app/data/seed_data.json)
    - Insert new categories and components
    - Update existing items if they've changed
    - Skip items that haven't changed
    """
    global db
    if db is None:
        return
    
    try:
        from app.services.seeder_service import run_seeder
        summary = await run_seeder(db)
        
        # Log summary
        cat_summary = summary.get("categories", {})
        comp_summary = summary.get("components", {})
        
        if cat_summary.get("inserted", 0) > 0 or cat_summary.get("updated", 0) > 0:
            logger.info(f"Categories seeded: {cat_summary}")
        
        if comp_summary.get("inserted", 0) > 0 or comp_summary.get("updated", 0) > 0:
            logger.info(f"Components seeded: {comp_summary}")
            
    except Exception as e:
        logger.error(f"Seeding failed: {e}")
        # Don't fail startup if seeding fails
        pass


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance."""
    if db is None:
        raise RuntimeError("Database not initialized")
    return db
