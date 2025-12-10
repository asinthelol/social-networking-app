import { API_BASE_URL } from "./config";
import { CreateUserRequest, UpdateUserRequest, UserResponse } from "./types";

export async function createUser(data: CreateUserRequest): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Registration failed");
  }

  return response.json();
}

export async function getUser(userId: number): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch user");
  }

  return response.json();
}

export async function getAllUsers(): Promise<UserResponse[]> {
  const response = await fetch(`${API_BASE_URL}/users`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch users");
  }

  return response.json();
}

export async function getUserByUsername(username: string): Promise<UserResponse | null> {
  const users = await getAllUsers();
  return users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function updateUser(userId: number, data: UpdateUserRequest): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to update user");
  }

  return response.json();
}

export async function deleteUser(userId: number, currentUserId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}?current_user_id=${currentUserId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to delete user");
  }
}
