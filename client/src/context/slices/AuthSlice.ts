/** @format */

import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
  bannerImage: string;
  dateOfBirth: Date;
  location: string;
  bio: string;
  following: string[];
}

interface AuthState {
  isAuth: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuth: false,
  user: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      return {
        ...state,
        isAuth: true,
        user: action.payload,
      };
    },
    logout: (state) => {
      return {
        ...state,
        isAuth: false,
        user: null,
      };
    },
  },
});

export const { login, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
