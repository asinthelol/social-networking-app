import { API_BASE_URL } from "./config";
import { UserResponse } from "./types";

export interface CommentResponse {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  created_at: string;
  author: UserResponse;
}

export interface CreateCommentRequest {
  content: string;
  user_id: number;
  post_id: number;
}

/**
 * Get all comments for a specific post
 */
export async function getPostComments(postId: number): Promise<CommentResponse[]> {
  const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch comments");
  }

  return response.json();
}

/**
 * Create a new comment
 */
export async function createComment(data: CreateCommentRequest): Promise<CommentResponse> {
  const response = await fetch(`${API_BASE_URL}/comments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create comment");
  }

  return response.json();
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete comment");
  }
}
