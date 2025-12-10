"""
User routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserUpdate, UserResponse, UserWithFriends

router = APIRouter()


@router.get("/")
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all users
    """
    
    try:
        users = db.query(User).offset(skip).limit(limit).all()
        return users
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting users: {str(e)}"
        )


@router.get("/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get user by ID with friends list
    """
    
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting user: {str(e)}"
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new user
    """
    
    try:
        # Check if username already exists
        existing_user = db.query(User).filter(User.username == user.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
        
        # Check if email already exists
        existing_email = db.query(User).filter(User.email == user.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )
        
        # Create user with default profile picture
        user_data = user.model_dump()
        user_data['profile_picture'] = "/uploads/profile_pictures/default.jpg"
        
        db_user = User(**user_data)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {str(e)}"
        )


@router.put("/{user_id}")
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db)
):
    """
    Update user information
    """
    
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )
        
        update_data = user_update.model_dump(exclude_unset=True)
        
        # Check username uniqueness if being updated
        if "username" in update_data:
            existing = db.query(User).filter(
                User.username == update_data["username"],
                User.id != user_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already exists"
                )
        
        # Check email uniqueness if being updated
        if "email" in update_data:
            existing = db.query(User).filter(
                User.email == update_data["email"],
                User.id != user_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already exists"
                )
        
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.commit()
        db.refresh(db_user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating user: {str(e)}"
        )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    current_user_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a user (own account or admin can delete any user)
    """
    
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )
        
        # Check if user is deleting their own account or is an admin
        current_user = db.query(User).filter(User.id == current_user_id).first()
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Current user not found"
            )
        
        if user_id != current_user_id and not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this user"
            )
        
        db.delete(db_user)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting user: {str(e)}"
        )
