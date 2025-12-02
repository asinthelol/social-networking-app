"""
Friend routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User
from app.schemas import UserResponse, FriendRequest

router = APIRouter(prefix="/friends", tags=["friends"])


@router.get("/{user_id}")
def get_user_friends(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all friends of a user
    """
    
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )
        
        return user.friends
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting user friends: {str(e)}"
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
def add_friend(
    friend_request: FriendRequest,
    db: Session = Depends(get_db)
):
    """
    Add a friend connection between two users
    """
    
    try:
        user = db.query(User).filter(User.id == friend_request.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {friend_request.user_id} not found"
            )
        
        friend = db.query(User).filter(User.id == friend_request.friend_id).first()
        if not friend:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {friend_request.friend_id} not found"
            )
        
        # Check if already friends
        if friend in user.friends:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Users are already friends"
            )
        
        # Add bidirectional friendship
        user.friends.append(friend)
        friend.friends.append(user)
        
        db.commit()
        return {"message": "Friend added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error adding friend: {str(e)}"
        )


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def remove_friend(
    friend_request: FriendRequest,
    db: Session = Depends(get_db)
):
    """
    Remove a friend connection between two users
    """
    
    try:
        user = db.query(User).filter(User.id == friend_request.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {friend_request.user_id} not found"
            )
        
        friend = db.query(User).filter(User.id == friend_request.friend_id).first()
        if not friend:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {friend_request.friend_id} not found"
            )
        
        # Check if they are friends
        if friend not in user.friends:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Users are not friends"
            )
        
        # Remove bidirectional friendship
        user.friends.remove(friend)
        friend.friends.remove(user)
        
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error removing friend: {str(e)}"
        )
