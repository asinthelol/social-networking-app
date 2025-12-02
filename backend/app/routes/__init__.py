"""
API Routes
"""

from .users import router as users_router
from .posts import router as posts_router
from .comments import router as comments_router
from .friends import router as friends_router
from .upload import router as upload_router

__all__ = [
    "users_router",
    "posts_router",
    "comments_router",
    "friends_router",
    "upload_router",
]
