import { API_BASE_URL } from "./config";
import { UserResponse } from "./types";

export interface PostResponse {
  id: number;
  content: string;
  image_url?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  author: UserResponse;
}

export interface CreatePostRequest {
  content: string;
  image_url?: string;
  user_id: number;
}

export interface UpdatePostRequest {
  content?: string;
  image_url?: string;
}

/**
 * Get all posts
 */
export async function getAllPosts(skip: number = 0, limit: number = 100): Promise<PostResponse[]> {
  const response = await fetch(`${API_BASE_URL}/posts?skip=${skip}&limit=${limit}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch posts");
  }

  return response.json();
}

/**
 * Get a single post by ID
 */
export async function getPost(postId: number): Promise<PostResponse> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch post");
  }

  return response.json();
}

/**
 * Get posts by a specific user
 */
export async function getUserPosts(userId: number, skip: number = 0, limit: number = 100): Promise<PostResponse[]> {
  const response = await fetch(`${API_BASE_URL}/posts/user/${userId}?skip=${skip}&limit=${limit}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch user posts");
  }

  return response.json();
}

/**
 * Create a new post
 */
export async function createPost(data: CreatePostRequest): Promise<PostResponse> {
  const response = await fetch(`${API_BASE_URL}/posts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create post");
  }

  return response.json();
}

/**
 * Update a post
 */
export async function updatePost(postId: number, data: UpdatePostRequest): Promise<PostResponse> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update post");
  }

  return response.json();
}

/**
 * Delete a post
 */
export async function deletePost(postId: number, userId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}?user_id=${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete post");
  }
}
