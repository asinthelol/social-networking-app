"""
Comment routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Comment, Post, User
from app.schemas import CommentCreate, CommentResponse

router = APIRouter()


@router.get("/post/{post_id}")
def get_post_comments(
    post_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all comments for a specific post
    """
    
    try:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with id {post_id} not found"
            )
        
        comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.asc()).offset(skip).limit(limit).all()
        return comments
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting post comments: {str(e)}"
        )


@router.get("/{comment_id}")
def get_comment(
    comment_id: int,
    db: Session = Depends(get_db)
):
    """
    Get comment by ID
    """
    
    try:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Comment with id {comment_id} not found"
            )
        return comment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting comment: {str(e)}"
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_comment(
    comment: CommentCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new comment
    """
    
    try:
        # Verify user exists
        user = db.query(User).filter(User.id == comment.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {comment.user_id} not found"
            )
        
        # Verify post exists
        post = db.query(Post).filter(Post.id == comment.post_id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with id {comment.post_id} not found"
            )
        
        db_comment = Comment(**comment.model_dump())
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating comment: {str(e)}"
        )


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a comment
    """
    
    try:
        db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not db_comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Comment with id {comment_id} not found"
            )
        
        db.delete(db_comment)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting comment: {str(e)}"
        )
