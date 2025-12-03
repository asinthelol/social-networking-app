import { API_BASE_URL } from "./config";

export async function uploadProfilePicture(file: File): Promise<{ file_url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload/profile-picture`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to upload profile picture");
  }

  return response.json();
}

export async function uploadPostImage(file: File): Promise<{ file_url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload/post-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to upload post image");
  }

  return response.json();
}
