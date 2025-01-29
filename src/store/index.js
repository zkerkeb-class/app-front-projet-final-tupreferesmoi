import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import playerReducer from "./slices/playerSlice";

export const store = configureStore({
    reducer: {
        player: playerReducer,
        // Autres reducers à ajouter ici (auth, playlists, etc.)
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignorer certaines actions non-sérialisables
                ignoredActions: ["player/setCurrentTrack"],
            },
        }),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
