"""
API Router
"""

from fastapi import APIRouter

from app.routes import friends, users, posts, comments, upload

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(posts.router, prefix="/posts", tags=["posts"])
router.include_router(comments.router, prefix="/comments", tags=["comments"])
router.include_router(friends.router, prefix="/friends", tags=["friends"])
router.include_router(upload.router, prefix="/upload", tags=["upload"])