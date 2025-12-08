from datetime import datetime, timedelta
from typing import Optional
from bson import ObjectId

from app.database import get_database
from app.schemas.user import UserCreate
from app.utils.security import get_password_hash, verify_password, create_password_reset_token
from app.config import settings


class UserService:
    """Service class for user-related operations."""
    
    @staticmethod
    async def create_user(user_data: UserCreate) -> dict:
        """Create a new user."""
        db = get_database()
        
        # Check if email already exists
        existing_email = await db.users.find_one({"email": user_data.email})
        if existing_email:
            raise ValueError("Email already registered")
        
        # Check if username already exists
        existing_username = await db.users.find_one({"username": user_data.username})
        if existing_username:
            raise ValueError("Username already taken")
        
        # Create user document
        user_doc = {
            "_id": str(ObjectId()),
            "email": user_data.email,
            "username": user_data.username,
            "hashed_password": get_password_hash(user_data.password),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "password_reset_token": None,
            "password_reset_expires": None,
        }
        
        await db.users.insert_one(user_doc)
        return user_doc
    
    @staticmethod
    async def authenticate_user(email: str, password: str) -> Optional[dict]:
        """Authenticate a user by email and password."""
        db = get_database()
        user = await db.users.find_one({"email": email})
        
        if not user:
            return None
        
        if not verify_password(password, user["hashed_password"]):
            return None
        
        return user
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[dict]:
        """Get user by ID."""
        db = get_database()
        return await db.users.find_one({"_id": user_id})
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[dict]:
        """Get user by email."""
        db = get_database()
        return await db.users.find_one({"email": email})
    
    @staticmethod
    async def create_password_reset_token(email: str) -> Optional[str]:
        """Create a password reset token for a user."""
        db = get_database()
        user = await db.users.find_one({"email": email})
        
        if not user:
            return None
        
        token = create_password_reset_token()
        expires = datetime.utcnow() + timedelta(hours=settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS)
        
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "password_reset_token": token,
                    "password_reset_expires": expires,
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        
        return token
    
    @staticmethod
    async def reset_password(token: str, new_password: str) -> bool:
        """Reset user password using reset token."""
        db = get_database()
        
        user = await db.users.find_one({
            "password_reset_token": token,
            "password_reset_expires": {"$gt": datetime.utcnow()}
        })
        
        if not user:
            return False
        
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "hashed_password": get_password_hash(new_password),
                    "password_reset_token": None,
                    "password_reset_expires": None,
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        
        return True

