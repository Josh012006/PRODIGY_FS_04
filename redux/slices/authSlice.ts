import User from "@/interfaces/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


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
            // ! Détruire le cookie lors de la déconnexion

            // Update le state
            return initialState;
        },
        login: (state, action) => {
            // ! Stocker les informations de l'utilisateur dans un cookie // Le cookie expirera après 5 jours

            // Update le state avec les informations du user
            return {
                isAuth: true,
                infos: action.payload
            };
        },
        loadUserFromCookie: (state) => {
            // ! Récupérer les informations de l'utilisateur depuis le cookie

            // Update le state avec les informations du user
        }
    }
});

export const { logout, login, loadUserFromCookie } = authSlice.actions;

export default authSlice.reducer;