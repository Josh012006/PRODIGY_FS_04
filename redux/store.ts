import { configureStore } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import authSlice from "./slices/authSlice";


import { loadUserFromCookie } from "./slices/authSlice";



export const store  = configureStore({
    reducer: {
        auth: authSlice,
    },
});


store.dispatch(loadUserFromCookie());



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;