from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from app.schemas.diagram import (
    DiagramCreate,
    DiagramUpdate,
    DiagramResponse,
    DiagramListResponse,
    CanvasSchema,
    ShapeSchema,
)
from app.services.diagram_service import DiagramService
from app.utils.security import get_current_user_id

router = APIRouter()


def diagram_to_response(diagram: dict) -> DiagramResponse:
    """Convert diagram document to response schema."""
    return DiagramResponse(
        id=diagram["_id"],
        user_id=diagram["user_id"],
        name=diagram["name"],
        description=diagram.get("description"),
        version=diagram.get("version", "1.0"),
        canvas=CanvasSchema(**diagram.get("canvas", {})),
        shapes=[ShapeSchema(**shape) for shape in diagram.get("shapes", [])],
        created_at=diagram["created_at"],
        updated_at=diagram["updated_at"],
    )


def diagram_to_list_response(diagram: dict) -> DiagramListResponse:
    """Convert diagram document to list response schema (without shapes)."""
    return DiagramListResponse(
        id=diagram["_id"],
        name=diagram["name"],
        description=diagram.get("description"),
        version=diagram.get("version", "1.0"),
        created_at=diagram["created_at"],
        updated_at=diagram["updated_at"],
    )


@router.get("/", response_model=List[DiagramListResponse])
async def get_user_diagrams(user_id: str = Depends(get_current_user_id)):
    """
    Get all diagrams for the current authenticated user.
    
    Returns a list of diagrams (without full shape data) sorted by last updated.
    Requires authentication.
    """
    diagrams = await DiagramService.get_user_diagrams(user_id)
    return [diagram_to_list_response(d) for d in diagrams]


@router.get("/{diagram_id}", response_model=DiagramResponse)
async def get_diagram(diagram_id: str, user_id: str = Depends(get_current_user_id)):
    """
    Get a specific diagram with full JSON data.
    
    - **diagram_id**: The diagram ID
    
    Returns the complete diagram including all shapes for rendering.
    Requires authentication. User can only access their own diagrams.
    """
    diagram = await DiagramService.get_diagram_by_id(diagram_id, user_id)
    
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    return diagram_to_response(diagram)


@router.post("/", response_model=DiagramResponse, status_code=status.HTTP_201_CREATED)
async def create_diagram(
    diagram_data: DiagramCreate,
    user_id: str = Depends(get_current_user_id)
):
    """
    Create a new diagram.
    
    - **name**: Diagram name
    - **description**: Optional description
    - **version**: Schema version (default: "1.0")
    - **canvas**: Canvas configuration
    - **shapes**: List of shapes in the diagram
    
    Requires authentication. Diagram is associated with the current user.
    """
    diagram = await DiagramService.create_diagram(user_id, diagram_data)
    return diagram_to_response(diagram)


@router.put("/{diagram_id}", response_model=DiagramResponse)
async def update_diagram(
    diagram_id: str,
    diagram_data: DiagramUpdate,
    user_id: str = Depends(get_current_user_id)
):
    """
    Update an existing diagram.
    
    - **diagram_id**: Diagram ID to update
    
    Only provided fields will be updated.
    Requires authentication. User can only update their own diagrams.
    """
    diagram = await DiagramService.update_diagram(diagram_id, user_id, diagram_data)
    
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    return diagram_to_response(diagram)


@router.delete("/{diagram_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_diagram(diagram_id: str, user_id: str = Depends(get_current_user_id)):
    """
    Delete a diagram.
    
    - **diagram_id**: Diagram ID to delete
    
    Requires authentication. User can only delete their own diagrams.
    """
    deleted = await DiagramService.delete_diagram(diagram_id, user_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    return None


@router.post("/{diagram_id}/duplicate", response_model=DiagramResponse, status_code=status.HTTP_201_CREATED)
async def duplicate_diagram(
    diagram_id: str,
    new_name: str = None,
    user_id: str = Depends(get_current_user_id)
):
    """
    Duplicate an existing diagram.
    
    - **diagram_id**: Source diagram ID to duplicate
    - **new_name**: Optional name for the new diagram (defaults to "Original Name (Copy)")
    
    Requires authentication. User can only duplicate their own diagrams.
    """
    diagram = await DiagramService.duplicate_diagram(diagram_id, user_id, new_name)
    
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source diagram not found"
        )
    
    return diagram_to_response(diagram)

