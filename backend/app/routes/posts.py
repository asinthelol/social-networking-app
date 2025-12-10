"""
Post routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.database import get_db
from app.models import Post, User
from app.schemas import PostCreate, PostUpdate, PostResponse, PostWithComments

router = APIRouter()


@router.get("/")
def get_all_posts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all posts with comments, ordered by newest first
    """
    
    try:
        posts = db.query(Post).options(joinedload(Post.author)).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
        return posts
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting posts: {str(e)}"
        )


@router.get("/{post_id}")
def get_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    """
    Get post by ID with comments
    """
    
    try:
        post = db.query(Post).options(joinedload(Post.author)).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with id {post_id} not found"
            )
        return post
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting post: {str(e)}"
        )


@router.get("/user/{user_id}")
def get_user_posts(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all posts by a specific user
    """
    
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )
        
        posts = db.query(Post).options(joinedload(Post.author)).filter(Post.user_id == user_id).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
        return posts
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting user posts: {str(e)}"
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new post
    """
    
    try:
        # Verify user exists
        user = db.query(User).filter(User.id == post.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {post.user_id} not found"
            )
        
        db_post = Post(**post.model_dump())
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating post: {str(e)}"
        )


@router.put("/{post_id}")
def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a post
    """
    
    try:
        db_post = db.query(Post).filter(Post.id == post_id).first()
        if not db_post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with id {post_id} not found"
            )
        
        update_data = post_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_post, field, value)
        
        db.commit()
        db.refresh(db_post)
        return db_post
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating post: {str(e)}"
        )


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a post (own post or admin can delete any post)
    """
    
    try:
        db_post = db.query(Post).filter(Post.id == post_id).first()
        if not db_post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with id {post_id} not found"
            )
        
        # Check if user is the post owner or an admin
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if db_post.user_id != user_id and not user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this post"
            )
        
        db.delete(db_post)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting post: {str(e)}"
        )
