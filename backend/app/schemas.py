"""
Social networking app schemas
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict, Field


# User Schemas
class UserBase(BaseModel):
    """Base user schema"""
    username: str = Field(..., description="Unique username")
    email: EmailStr = Field(..., description="User email address")
    full_name: str = Field(..., description="User's full name")
    bio: Optional[str] = Field(None, description="User biography")
    profile_picture: Optional[str] = Field(None, description="Profile picture URL")


class UserCreate(UserBase):
    """Schema for creating new users"""
    pass


class UserUpdate(BaseModel):
    """Schema for updating user information"""
    username: Optional[str] = Field(None, description="Unique username")
    email: Optional[EmailStr] = Field(None, description="User email address")
    full_name: Optional[str] = Field(None, description="User's full name")
    bio: Optional[str] = Field(None, description="User biography")
    profile_picture: Optional[str] = Field(None, description="Profile picture URL")


class UserResponse(UserBase):
    """Schema for user responses"""
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserWithFriends(UserResponse):
    """Schema for user with friends list"""
    friends: List['UserResponse'] = []

    model_config = ConfigDict(from_attributes=True)


# Post Schemas
class PostBase(BaseModel):
    """Base post schema"""
    content: str = Field(..., description="Post content")
    image_url: Optional[str] = Field(None, description="Optional image URL")


class PostCreate(PostBase):
    """Schema for creating new posts"""
    user_id: int = Field(..., description="Author user ID")


class PostUpdate(BaseModel):
    """Schema for updating posts"""
    content: Optional[str] = Field(None, description="Post content")
    image_url: Optional[str] = Field(None, description="Optional image URL")


class PostResponse(PostBase):
    """Schema for post responses"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    author: UserResponse

    model_config = ConfigDict(from_attributes=True)


# Comment Schemas
class CommentBase(BaseModel):
    """Base comment schema"""
    content: str = Field(..., description="Comment content")


class CommentCreate(CommentBase):
    """Schema for creating new comments"""
    user_id: int = Field(..., description="Commenter user ID")
    post_id: int = Field(..., description="Post ID being commented on")


class CommentResponse(CommentBase):
    """Schema for comment responses"""
    id: int
    user_id: int
    post_id: int
    created_at: datetime
    author: UserResponse

    model_config = ConfigDict(from_attributes=True)


class PostWithComments(PostResponse):
    """Schema for post with comments"""
    comments: List[CommentResponse] = []

    model_config = ConfigDict(from_attributes=True)


# Friend Schemas
class FriendRequest(BaseModel):
    """Schema for friend requests"""
    user_id: int = Field(..., description="User ID initiating friendship")
    friend_id: int = Field(..., description="User ID to befriend")
