import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 5000,
});

// Intercepteur pour gérer les tokens d'authentification
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const musicApi = {
    // Récupération des playlists
    getRecentTracks: () => api.get("/tracks/recent"),
    getPopularArtists: () => api.get("/artists/popular"),
    getRecentAlbums: () => api.get("/albums/recent"),

    // Lecteur audio
    getTrackStream: (trackId) =>
        api.get(`/tracks/${trackId}/stream`, { responseType: "blob" }),
    getTrackMetadata: (trackId) => api.get(`/tracks/${trackId}/metadata`),

    // Playlists
    getPlaylist: (playlistId) => api.get(`/playlists/${playlistId}`),
    createPlaylist: (data) => api.post("/playlists", data),
    updatePlaylist: (playlistId, data) =>
        api.put(`/playlists/${playlistId}`, data),

    // Recherche
    search: (query) => api.get(`/search?q=${encodeURIComponent(query)}`),

    // Likes
    likeTrack: (trackId) => api.post(`/tracks/${trackId}/like`),
    unlikeTrack: (trackId) => api.delete(`/tracks/${trackId}/like`),

    // Sessions d'écoute
    createListeningSession: () => api.post("/sessions"),
    joinListeningSession: (sessionId) =>
        api.post(`/sessions/${sessionId}/join`),
    syncListeningSession: (sessionId, data) =>
        api.put(`/sessions/${sessionId}/sync`, data),
};

export default api;
