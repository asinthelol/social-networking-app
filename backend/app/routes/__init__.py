"""
API Routes
"""

from .users import router as users_router
from .posts import router as posts_router
from .comments import router as comments_router
from .friends import router as friends_router
from .upload import router as upload_router
from .search import router as search_router
from .feed import router as feed_router

__all__ = [
    "users_router",
    "posts_router",
    "comments_router",
    "friends_router",
    "upload_router",
    "search_router",
    "feed_router",
]
