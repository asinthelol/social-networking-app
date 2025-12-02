from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy import Column

from app.database import Base


# Association table for friend relationships (many-to-many)


friends = Table(
    'friends',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('friend_id', Integer, ForeignKey('users.id'), primary_key=True)
)


class User(Base):
    """User model"""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    profile_picture: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Relationships
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    
    # Self-referential many-to-many for friends
    friends = relationship(
        "User",
        secondary=friends,
        primaryjoin=id == friends.c.user_id,
        secondaryjoin=id == friends.c.friend_id,
        backref="friend_of"
    )

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username})>"


class Post(Base):
    """Post model"""
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    
    # Foreign key
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # Relationships
    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Post(id={self.id}, user_id={self.user_id})>"


class Comment(Base):
    """Comment model"""
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    
    # Foreign keys
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )
    post_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("posts.id"),
        nullable=False,
        index=True
    )

    # Relationships
    author = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")

    def __repr__(self):
        return f"<Comment(id={self.id}, post_id={self.post_id})>"
