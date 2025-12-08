from pydantic import BaseModel, Field, EmailStr
from typing import Optional
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


class UserModel(BaseModel):
    """User model for MongoDB."""
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserInDB(UserModel):
    """User model with hashed password for database storage."""
    
    hashed_password: str
    password_reset_token: Optional[str] = None
    password_reset_expires: Optional[datetime] = None

