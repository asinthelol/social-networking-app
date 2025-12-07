import { API_BASE_URL } from "@/shared/lib/api/config";

export interface CreateUserRequest {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  full_name: string;
  bio?: string;
  profile_picture?: string;
  created_at: string;
}

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
