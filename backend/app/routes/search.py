"""
Search routes
"""

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Literal

from app.database import get_db
from app.models import User, Post
from app.schemas import UserResponse, PostWithComments

router = APIRouter()


@router.get("/users")
def search_users(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Search for users by username, full name, or bio
    """
    
    try:
        search_term = f"%{q}%"
        users = db.query(User).filter(
            (User.username.ilike(search_term)) |
            (User.full_name.ilike(search_term)) |
            (User.bio.ilike(search_term))
        ).limit(limit).all()
        
        return {"results": users, "count": len(users)}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching users: {str(e)}"
        )


@router.get("/posts")
def search_posts(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Search for posts by content
    """
    
    try:
        search_term = f"%{q}%"
        posts = db.query(Post).filter(
            Post.content.ilike(search_term)
        ).order_by(Post.created_at.desc()).limit(limit).all()
        
        return {"results": posts, "count": len(posts)}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching posts: {str(e)}"
        )


@router.get("/")
def search_all(
    q: str = Query(..., min_length=1, description="Search query"),
    type: Literal["users", "posts", "all"] = Query("all", description="Type of search"),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Search for users and/or posts
    """
    
    try:
        search_term = f"%{q}%"
        results = {}
        
        if type in ["users", "all"]:
            users = db.query(User).filter(
                (User.username.ilike(search_term)) |
                (User.full_name.ilike(search_term)) |
                (User.bio.ilike(search_term))
            ).limit(limit).all()
            results["users"] = users
        
        if type in ["posts", "all"]:
            posts = db.query(Post).filter(
                Post.content.ilike(search_term)
            ).order_by(Post.created_at.desc()).limit(limit).all()
            results["posts"] = posts
        
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching: {str(e)}"
        )
