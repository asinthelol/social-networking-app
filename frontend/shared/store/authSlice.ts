import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  username: string | null;
}

// Load initial state from localStorage if available
const loadAuthState = (): AuthState => {
  if (typeof window !== "undefined") {
    try {
      const savedState = localStorage.getItem("authState");
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage:", error);
    }
  }
  return {
    isLoggedIn: false,
    userId: null,
    username: null,
  };
};

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userId: number; username: string }>) => {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("authState", JSON.stringify(state));
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userId = null;
      state.username = null;
      
      // Clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("authState");
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
