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

// Fonction pour purger le cache Redux et forcer le rechargement des données
export const purgeStoreData = async () => {
    // Réinitialiser le player
    store.dispatch({ type: 'player/clearQueue' });
    
    // Ajouter d'autres actions de purge ici si nécessaire
    
    // Recharger la page pour rafraîchir toutes les données
    window.location.reload();
};

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
