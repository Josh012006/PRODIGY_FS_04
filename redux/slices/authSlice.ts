import User from "@/interfaces/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import Cookies from "js-cookie";
import jwt from "jsonwebtoken";


interface InitialState {
    isAuth: boolean,
    infos: null | User,
}

const initialState : InitialState = {
    isAuth: false,
    infos: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: () => {
            Cookies.remove("echoToken");
            // Update le state
            return initialState;
        },
        login: (state, action) => {
            // Update le state avec les informations du user
            return {
                isAuth: true,
                infos: action.payload
            };
        },
        loadUserFromCookie: (state) => {
            const cookie = Cookies.get("echoToken");

            // Update le state avec les informations du user
            if (cookie) {

                const user = jwt.verify(JSON.parse(cookie), process.env.JWT_SECRET as string);

                return {
                    isAuth: true,
                    infos: user as User
                }
            }

            return initialState;
        }
    }
});

export const { logout, login, loadUserFromCookie } = authSlice.actions;

export default authSlice.reducer;