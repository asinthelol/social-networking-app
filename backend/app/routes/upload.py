"""
File upload routes
"""

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.upload_utils import save_upload_file, delete_upload_file

router = APIRouter()


@router.post("/profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...)
):
    """
    Upload a profile picture
    """
    
    try:
        filename = await save_upload_file(file, upload_type="profile")
        return {
            "filename": filename,
            "file_url": f"/uploads/profile_pictures/{filename}"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading file: {str(e)}"
        )


@router.post("/post-image")
async def upload_post_image(
    file: UploadFile = File(...)
):
    """
    Upload a post image
    """
    
    try:
        filename = await save_upload_file(file, upload_type="post")
        return {
            "filename": filename,
            "file_url": f"/uploads/post_images/{filename}"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading file: {str(e)}"
        )
