import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 5000,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const musicApi = {
    // Récupération des morceaux récents
    getRecentTracks: async () => {
        try {
            const response = await api.get("/tracks/recent");
            return response.data;
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des morceaux récents:",
                error
            );
            return [];
        }
    },

    // Récupération des artistes populaires
    getPopularArtists: async () => {
        try {
            const response = await api.get("/artists/popular");
            return response.data;
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des artistes populaires:",
                error
            );
            return [];
        }
    },

    // Récupération des albums récents
    getRecentAlbums: async () => {
        try {
            const response = await api.get("/albums/recent");
            return response.data;
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des albums récents:",
                error
            );
            return [];
        }
    },

    // Récupération d'un morceau pour le streaming
    getTrackStream: async (trackId) => {
        try {
            return await api.get(`/tracks/${trackId}/stream`, {
                responseType: "blob",
            });
        } catch (error) {
            console.error("Erreur lors de la récupération du stream:", error);
            throw error;
        }
    },

    // Recherche
    search: async (query) => {
        try {
            const response = await api.get(
                `/search?q=${encodeURIComponent(query)}`
            );
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            return { tracks: [], artists: [], albums: [] };
        }
    },

    // Gestion des likes
    likeTrack: async (trackId) => {
        try {
            const response = await api.post(`/tracks/${trackId}/like`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors du like:", error);
            throw error;
        }
    },

    unlikeTrack: async (trackId) => {
        try {
            const response = await api.delete(`/tracks/${trackId}/like`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors du unlike:", error);
            throw error;
        }
    },

    // Gestion des playlists
    createPlaylist: async (name) => {
        try {
            const response = await api.post("/playlists", { name });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création de la playlist:", error);
            throw error;
        }
    },

    addToPlaylist: async (playlistId, trackId) => {
        try {
            const response = await api.post(`/playlists/${playlistId}/tracks`, {
                trackId,
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'ajout à la playlist:", error);
            throw error;
        }
    },

    removeFromPlaylist: async (playlistId, trackId) => {
        try {
            const response = await api.delete(
                `/playlists/${playlistId}/tracks/${trackId}`
            );
            return response.data;
        } catch (error) {
            console.error(
                "Erreur lors de la suppression de la playlist:",
                error
            );
            throw error;
        }
    },

    // Récupération d'un artiste
    getArtist: async (artistId) => {
        try {
            const response = await api.get(`/artists/${artistId}`);
            return response.data;
        } catch (error) {
            console.error(
                "Erreur lors de la récupération de l'artiste:",
                error
            );
            throw error;
        }
    },

    // Récupération des pistes d'un artiste
    getArtistTracks: async (artistId, albumId = null) => {
        try {
            const params = {};
            if (artistId) params.artistId = artistId;
            if (albumId) params.albumId = albumId;

            const response = await api.get(`/tracks`, { params });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des pistes:", error);
            throw error;
        }
    },

    // Récupération d'un album spécifique
    getAlbum: async (albumId) => {
        try {
            const response = await api.get(`/albums/${albumId}`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'album:", error);
            throw error;
        }
    },

    // Récupération des pistes d'un album
    getAlbumTracks: async (albumId) => {
        try {
            const response = await api.get(`/albums/${albumId}/tracks`);
            return response.data;
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des pistes de l'album:",
                error
            );
            throw error;
        }
    },
};
