from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional

from app.schemas.component import ComponentCreate, ComponentUpdate, ComponentResponse
from app.services.component_service import ComponentService
from app.utils.security import get_current_user

router = APIRouter()


@router.get("/", response_model=List[ComponentResponse])
async def get_all_components(
    category: Optional[str] = Query(None, description="Filter by category key"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get all components.
    
    - **category**: Optional filter by category key
    
    Returns components sorted alphabetically by name.
    Requires authentication.
    """
    components = await ComponentService.get_all_components(category=category)
    return [
        ComponentResponse(
            id=comp["_id"],
            component_id=comp["component_id"],
            name=comp["name"],
            icon=comp["icon"],
            fa_icon=comp["fa_icon"],
            category=comp["category"],
            provider=comp["provider"],
            description=comp["description"],
            color=comp["color"],
        )
        for comp in components
    ]


@router.get("/{component_id}", response_model=ComponentResponse)
async def get_component(component_id: str, current_user: dict = Depends(get_current_user)):
    """
    Get a specific component by its ID.
    
    - **component_id**: Component ID (e.g., 'gpt-4', 'kubernetes')
    
    Requires authentication.
    """
    component = await ComponentService.get_component_by_id(component_id)
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Component '{component_id}' not found"
        )
    
    return ComponentResponse(
        id=component["_id"],
        component_id=component["component_id"],
        name=component["name"],
        icon=component["icon"],
        fa_icon=component["fa_icon"],
        category=component["category"],
        provider=component["provider"],
        description=component["description"],
        color=component["color"],
    )


@router.post("/", response_model=ComponentResponse, status_code=status.HTTP_201_CREATED)
async def create_component(
    component_data: ComponentCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new component.
    
    - **component_id**: Unique component identifier
    - **name**: Display name
    - **icon**: Emoji icon
    - **fa_icon**: FontAwesome icon class
    - **category**: Category key (must exist)
    - **provider**: Provider/vendor name
    - **description**: Component description
    - **color**: Hex color code
    
    Requires authentication.
    """
    try:
        component = await ComponentService.create_component(component_data)
        return ComponentResponse(
            id=component["_id"],
            component_id=component["component_id"],
            name=component["name"],
            icon=component["icon"],
            fa_icon=component["fa_icon"],
            category=component["category"],
            provider=component["provider"],
            description=component["description"],
            color=component["color"],
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/{component_id}", response_model=ComponentResponse)
async def update_component(
    component_id: str,
    component_data: ComponentUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update an existing component.
    
    - **component_id**: Component ID to update
    
    Only provided fields will be updated.
    Requires authentication.
    """
    try:
        component = await ComponentService.update_component(component_id, component_data)
        
        if not component:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Component '{component_id}' not found"
            )
        
        return ComponentResponse(
            id=component["_id"],
            component_id=component["component_id"],
            name=component["name"],
            icon=component["icon"],
            fa_icon=component["fa_icon"],
            category=component["category"],
            provider=component["provider"],
            description=component["description"],
            color=component["color"],
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{component_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_component(component_id: str, current_user: dict = Depends(get_current_user)):
    """
    Delete a component.
    
    - **component_id**: Component ID to delete
    
    Requires authentication.
    """
    deleted = await ComponentService.delete_component(component_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Component '{component_id}' not found"
        )
    
    return None

