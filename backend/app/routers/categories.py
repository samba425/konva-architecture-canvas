from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services.category_service import CategoryService
from app.utils.security import get_current_user

router = APIRouter()


@router.get("/", response_model=List[CategoryResponse])
async def get_all_categories(current_user: dict = Depends(get_current_user)):
    """
    Get all component categories.
    
    Returns categories sorted by their display order.
    Requires authentication.
    """
    categories = await CategoryService.get_all_categories()
    return [
        CategoryResponse(
            id=cat["_id"],
            key=cat["key"],
            name=cat["name"],
            icon=cat["icon"],
            description=cat["description"],
            color=cat["color"],
            order=cat["order"],
        )
        for cat in categories
    ]


@router.get("/{key}", response_model=CategoryResponse)
async def get_category(key: str, current_user: dict = Depends(get_current_user)):
    """
    Get a specific category by its key.
    
    - **key**: Category key (e.g., 'infrastructure', 'ai_models')
    
    Requires authentication.
    """
    category = await CategoryService.get_category_by_key(key)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{key}' not found"
        )
    
    return CategoryResponse(
        id=category["_id"],
        key=category["key"],
        name=category["name"],
        icon=category["icon"],
        description=category["description"],
        color=category["color"],
        order=category["order"],
    )


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new component category.
    
    - **key**: Unique category key
    - **name**: Display name
    - **icon**: FontAwesome icon class
    - **description**: Category description
    - **color**: Hex color code
    - **order**: Display order
    
    Requires authentication.
    """
    try:
        category = await CategoryService.create_category(category_data)
        return CategoryResponse(
            id=category["_id"],
            key=category["key"],
            name=category["name"],
            icon=category["icon"],
            description=category["description"],
            color=category["color"],
            order=category["order"],
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/{key}", response_model=CategoryResponse)
async def update_category(
    key: str,
    category_data: CategoryUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update an existing category.
    
    - **key**: Category key to update
    
    Only provided fields will be updated.
    Requires authentication.
    """
    category = await CategoryService.update_category(key, category_data)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{key}' not found"
        )
    
    return CategoryResponse(
        id=category["_id"],
        key=category["key"],
        name=category["name"],
        icon=category["icon"],
        description=category["description"],
        color=category["color"],
        order=category["order"],
    )


@router.delete("/{key}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(key: str, current_user: dict = Depends(get_current_user)):
    """
    Delete a category.
    
    - **key**: Category key to delete
    
    Warning: This will not delete components in this category.
    Requires authentication.
    """
    deleted = await CategoryService.delete_category(key)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{key}' not found"
        )
    
    return None

