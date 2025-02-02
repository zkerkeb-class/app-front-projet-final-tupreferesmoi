const BASE_URL = '/api';

// Fonction utilitaire pour gérer les erreurs
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Une erreur est survenue');
  }
  return response.json();
};

// Fonction utilitaire pour les requêtes avec authentification
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return handleResponse(response);
};

export const musicApi = {
    // Récupération de tous les morceaux avec pagination
    getAllTracks: async (page = 1, limit = 10) => {
        try {
            console.log(`Appel API getAllTracks - page: ${page}, limit: ${limit}`);
            const response = await fetch(`${BASE_URL}/tracks?page=${page}&limit=${limit}`);
            const data = await handleResponse(response);
            console.log("Réponse brute de l'API:", data);
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des morceaux:", error);
            return {
                success: false,
                data: [],
                pagination: { totalItems: 0 },
                error: error.message,
            };
        }
    },

    // Récupération de tous les artistes avec pagination
    getAllArtists: async (page = 1, limit = 10) => {
        try {
            const response = await fetch(`${BASE_URL}/artists?page=${page}&limit=${limit}`);
            return handleResponse(response);
        } catch (error) {
            return {
                success: false,
                data: [],
                pagination: { totalItems: 0 },
                error: error.message,
            };
        }
    },

    // Récupération de tous les albums avec pagination
    getAllAlbums: async (page = 1, limit = 10) => {
        try {
            const response = await fetch(`${BASE_URL}/albums?page=${page}&limit=${limit}`);
            return handleResponse(response);
        } catch (error) {
            console.error("Erreur lors de la récupération des albums:", error);
            return { albums: [], total: 0 };
        }
    },

    // Récupération d'une piste spécifique
    getTrack: async (trackId) => {
        const response = await fetch(`${BASE_URL}/tracks/${trackId}`);
        return handleResponse(response);
    },

    // Récupération d'un artiste
    getArtist: async (artistId) => {
        const response = await fetch(`${BASE_URL}/artists/${artistId}`);
        return handleResponse(response);
    },

    // Récupération des pistes d'un artiste
    getArtistTracks: async (artistId = null, albumId = null, trackId = null) => {
        const params = new URLSearchParams();
        if (artistId) params.append('artistId', artistId);
        if (albumId) params.append('albumId', albumId);
        if (trackId) params.append('trackId', trackId);

        const response = await fetch(`${BASE_URL}/tracks?${params.toString()}`);
        return handleResponse(response);
    },

    // Récupération d'un album spécifique
    getAlbum: async (albumId) => {
        const response = await fetch(`${BASE_URL}/albums/${albumId}`);
        return handleResponse(response);
    },

    // Récupération des pistes d'un album
    getAlbumTracks: async (albumId) => {
        const response = await fetch(`${BASE_URL}/albums/${albumId}/tracks`);
        return handleResponse(response);
    },

    // Récupération des morceaux récents (pour la home)
    getRecentTracks: async () => {
        const response = await fetch(`${BASE_URL}/tracks/recent`);
        return handleResponse(response);
    },

    // Récupération des artistes populaires (pour la home)
    getPopularArtists: async () => {
        const response = await fetch(`${BASE_URL}/artists/popular`);
        return handleResponse(response);
    },

    // Récupération des albums récents (pour la home)
    getRecentAlbums: async () => {
        const response = await fetch(`${BASE_URL}/albums/recent`);
        return handleResponse(response);
    },

    // Récupération d'un morceau pour le streaming
    getTrackStream: async (trackId) => {
        const response = await fetch(`${BASE_URL}/tracks/${trackId}/stream`);
        return response.blob();
    },

    // Recherche
    search: async (query) => {
        try {
            const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
            return handleResponse(response);
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            throw error;
        }
    },

    // Global search for tracks, artists, and albums
    globalSearch: async (searchTerm) => {
        try {
            if (!searchTerm || searchTerm.trim().length < 2) {
                return {
                    success: true,
                    data: {
                        tracks: [],
                        artists: [],
                        albums: []
                    }
                };
            }

            const response = await fetch(`${BASE_URL}/search/${encodeURIComponent(searchTerm.trim())}`);
            const data = await handleResponse(response);
            
            return {
                success: true,
                data: {
                    tracks: data.data.tracks || [],
                    artists: data.data.artists || [],
                    albums: data.data.albums || []
                }
            };
        } catch (error) {
            console.error("Échec de la recherche globale:", error);
            return {
                success: false,
                data: {
                    tracks: [],
                    artists: [],
                    albums: []
                },
                error: error.message
            };
        }
    },

    // Gestion des likes
    likeTrack: async (trackId) => {
        const response = await fetch(`${BASE_URL}/tracks/${trackId}/like`, {
            method: 'POST',
        });
        return handleResponse(response);
    },

    unlikeTrack: async (trackId) => {
        const response = await fetch(`${BASE_URL}/tracks/${trackId}/like`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },

    // Gestion des playlists
    getPlaylist: async (playlistId) => {
        const response = await fetch(`${BASE_URL}/playlists/${playlistId}`);
        return handleResponse(response);
    },

    createPlaylist: async (data) => {
        const response = await fetch(`${BASE_URL}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    updatePlaylist: async (playlistId, data) => {
        const response = await fetch(`${BASE_URL}/playlists/${playlistId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    // Lecteur audio
    getTrackMetadata: async (trackId) => {
        const response = await fetch(`${BASE_URL}/tracks/${trackId}/metadata`);
        return handleResponse(response);
    },

    // Sessions d'écoute
    createListeningSession: async () => {
        const response = await fetch(`${BASE_URL}/sessions`, {
            method: 'POST',
        });
        return handleResponse(response);
    },

    joinListeningSession: async (sessionId) => {
        const response = await fetch(`${BASE_URL}/sessions/${sessionId}/join`, {
            method: 'POST',
        });
        return handleResponse(response);
    },

    syncListeningSession: async (sessionId, data) => {
        const response = await fetch(`${BASE_URL}/sessions/${sessionId}/sync`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
};
