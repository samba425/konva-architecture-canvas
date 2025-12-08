from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from app.config import settings

# Global database client
client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo():
    """Create database connection."""
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    # Create indexes
    await create_indexes()
    
    print(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")


async def close_mongo_connection():
    """Close database connection."""
    global client
    if client:
        client.close()
        print("Closed MongoDB connection")


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


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance."""
    if db is None:
        raise RuntimeError("Database not initialized")
    return db

