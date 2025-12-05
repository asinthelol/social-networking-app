import { API_BASE_URL } from "./config";
import { UserResponse } from "./types";

export interface FriendRequest {
  user_id: number;
  friend_id: number;
}

/**
 * Get all friends of a user
 */
export async function getUserFriends(userId: number): Promise<UserResponse[]> {
  const response = await fetch(`${API_BASE_URL}/friends/${userId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch friends");
  }

  return response.json();
}

/**
 * Add a friend connection
 */
export async function addFriend(userId: number, friendId: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/friends/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      friend_id: friendId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to add friend");
  }

  return response.json();
}

/**
 * Remove a friend connection
 */
export async function removeFriend(userId: number, friendId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/friends/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      friend_id: friendId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to remove friend");
  }
}
