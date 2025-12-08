from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials

from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
    PasswordReset,
    PasswordResetRequest,
)
from app.services.user_service import UserService
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    security,
)

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Register a new user.
    
    - **email**: Valid email address (must be unique)
    - **username**: Username (3-50 characters, must be unique)
    - **password**: Password (minimum 8 characters)
    """
    try:
        user = await UserService.create_user(user_data)
        return UserResponse(
            id=user["_id"],
            email=user["email"],
            username=user["username"],
            is_active=user["is_active"],
            created_at=user["created_at"],
            updated_at=user["updated_at"],
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Authenticate user and return JWT tokens.
    
    - **email**: User's email address
    - **password**: User's password
    
    Returns access and refresh tokens.
    """
    user = await UserService.authenticate_user(credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )
    
    access_token = create_access_token(data={"sub": user["_id"], "email": user["email"]})
    refresh_token = create_refresh_token(data={"sub": user["_id"], "email": user["email"]})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Refresh access token using a valid refresh token.
    
    Pass the refresh token in the Authorization header.
    """
    token = credentials.credentials
    token_data = decode_token(token)
    
    user = await UserService.get_user_by_id(token_data.user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    access_token = create_access_token(data={"sub": user["_id"], "email": user["email"]})
    new_refresh_token = create_refresh_token(data={"sub": user["_id"], "email": user["email"]})
    
    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        token_type="bearer"
    )


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(request: PasswordResetRequest):
    """
    Request a password reset token.
    
    - **email**: Email address of the account
    
    Note: For security, this endpoint always returns success even if email doesn't exist.
    In production, this would send an email with the reset link.
    """
    token = await UserService.create_password_reset_token(request.email)
    
    # In production, send email with reset link
    # For now, we'll return success regardless (security best practice)
    # The token would be sent via email in production
    
    return {
        "message": "If the email exists, a password reset link has been sent.",
        # Remove this in production - only for testing
        "debug_token": token if token else None
    }


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(reset_data: PasswordReset):
    """
    Reset password using the reset token.
    
    - **token**: Password reset token received via email
    - **new_password**: New password (minimum 8 characters)
    """
    success = await UserService.reset_password(reset_data.token, reset_data.new_password)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    return {"message": "Password has been reset successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user's profile.
    
    Requires a valid access token in the Authorization header.
    """
    return UserResponse(
        id=current_user["_id"],
        email=current_user["email"],
        username=current_user["username"],
        is_active=current_user["is_active"],
        created_at=current_user["created_at"],
        updated_at=current_user["updated_at"],
    )

