"""
File upload utilities
"""

import os
import uuid
from fastapi import UploadFile, HTTPException
from pathlib import Path

# Base upload directory
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
PROFILE_PICTURES_DIR = UPLOAD_DIR / "profile_pictures"
POST_IMAGES_DIR = UPLOAD_DIR / "post_images"

# Allowed image extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

# Max file size (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024


def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return Path(filename).suffix.lower()


def is_allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return get_file_extension(filename) in ALLOWED_EXTENSIONS


async def save_upload_file(upload_file: UploadFile, upload_type: str = "profile") -> str:
    """
    Save uploaded file and return the filename
    
    Args:
        upload_file: The uploaded file
        upload_type: Either 'profile' or 'post'
    
    Returns:
        The saved filename
    """
    
    if not upload_file or not upload_file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Check file extension
    if not is_allowed_file(upload_file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content
    content = await upload_file.read()
    
    # Check file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Generate unique filename
    file_extension = get_file_extension(upload_file.filename)
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Determine save directory
    if upload_type == "profile":
        save_dir = PROFILE_PICTURES_DIR
    elif upload_type == "post":
        save_dir = POST_IMAGES_DIR
    else:
        raise HTTPException(status_code=400, detail="Invalid upload type")
    
    # Save file
    file_path = save_dir / unique_filename
    with open(file_path, "wb") as f:
        f.write(content)
    
    return unique_filename


def delete_upload_file(filename: str, upload_type: str = "profile") -> bool:
    """
    Delete uploaded file
    
    Args:
        filename: The filename to delete
        upload_type: Either 'profile' or 'post'
    
    Returns:
        True if deleted, False if file not found
    """
    
    if upload_type == "profile":
        file_path = PROFILE_PICTURES_DIR / filename
    elif upload_type == "post":
        file_path = POST_IMAGES_DIR / filename
    else:
        return False
    
    if file_path.exists():
        os.remove(file_path)
        return True
    
    return False
