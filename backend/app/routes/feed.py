"""
Feed routes
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Post

router = APIRouter(prefix="/feed", tags=["feed"])


@router.get("/{user_id}")
def get_user_feed(
    user_id: int,
    skip: int = 0,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get news feed for a user (posts from friends and own posts)
    """
    
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail=f"User with id {user_id} not found"
            )
        
        # Get friend IDs
        friend_ids = [friend.id for friend in user.friends]
        
        # Include user's own posts
        friend_ids.append(user_id)
        
        # Get posts from friends and user
        posts = db.query(Post).filter(
            Post.user_id.in_(friend_ids)
        ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
        
        return {
            "posts": posts,
            "count": len(posts)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting feed: {str(e)}"
        )


@router.get("/public")
def get_public_feed(
    skip: int = 0,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get public feed (all posts, ordered by newest)
    """
    
    try:
        posts = db.query(Post).order_by(
            Post.created_at.desc()
        ).offset(skip).limit(limit).all()
        
        return {
            "posts": posts,
            "count": len(posts)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting public feed: {str(e)}"
        )
