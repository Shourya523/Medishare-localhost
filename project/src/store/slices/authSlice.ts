import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: "user" | "admin" | null; // Added role separately
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null, // Initialize role as null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.role = action.payload.role; // Store role separately
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null; // Reset role on logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
