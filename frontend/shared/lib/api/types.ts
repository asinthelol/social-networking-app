export interface CreateUserRequest {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

export interface UpdateUserRequest {
  profile_picture?: string
  username?: string;
  email?: string;
  full_name?: string;
  bio?: string;
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
