import { createSlice } from "@reduxjs/toolkit";

interface User {
    id: number;
    name: string;
    username: string;
    profilePicture: string;
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
