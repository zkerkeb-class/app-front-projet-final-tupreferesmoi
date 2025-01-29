import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        // Vos reducers seront ajoutés ici
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
