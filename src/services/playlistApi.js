const BASE_URL = '/api';

// Fonction utilitaire pour gérer les erreurs
const handleResponse = async (response) => {
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue');
        }
        return data;
    }
    
    throw new Error('Format de réponse invalide');
};

// Fonction utilitaire pour les requêtes avec authentification
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    console.log('Token présent:', !!token);
    
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };
    
    console.log('Request URL:', `${BASE_URL}${endpoint}`);
    console.log('Request headers:', headers);
    console.log('Request options:', options);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return handleResponse(response);
};

const playlistApi = {
    // Récupérer toutes les playlists de l'utilisateur
    getUserPlaylists: async () => {
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                console.warn('Aucune donnée utilisateur trouvée dans le localStorage');
                return [];
            }

            const userData = JSON.parse(userStr);
            const userId = userData.user?.id || userData.id;
            
            if (!userId) {
                console.warn('ID utilisateur non trouvé');
                return [];
            }

            const response = await fetchWithAuth(`/playlists?userId=${userId}`);
            return response.data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des playlists:', error);
            return [];
        }
    },

    // Créer une nouvelle playlist
    createPlaylist: async (playlistData) => {
        try {
            console.log('Création playlist avec données:', playlistData);
            const response = await fetchWithAuth('/playlists', {
                method: 'POST',
                body: JSON.stringify({
                    name: playlistData.name,
                    description: playlistData.description || '',
                    isPublic: false
                }),
            });
            console.log('Réponse création playlist:', response);
            return response.data || response;
        } catch (error) {
            console.error('Erreur détaillée lors de la création de la playlist:', error);
            throw error;
        }
    },

    // Ajouter une piste à une playlist
    addTrackToPlaylist: async (playlistId, trackId) => {
        try {
            console.log('Ajout de la piste à la playlist:', { playlistId, trackId });
            const response = await fetchWithAuth(`/playlists/${playlistId}/tracks`, {
                method: 'POST',
                body: JSON.stringify({ trackId }),
            });
            console.log('Réponse ajout piste:', response);
            return response.data || response;
        } catch (error) {
            console.error('Erreur détaillée lors de l\'ajout de la piste:', error);
            throw error;
        }
    },

    // Supprimer une piste d'une playlist
    removeTrackFromPlaylist: async (playlistId, trackId) => {
        try {
            console.log('Suppression de la piste de la playlist:', { playlistId, trackId });
            const response = await fetchWithAuth(`/playlists/${playlistId}/tracks/${trackId}`, {
                method: 'DELETE',
            });
            console.log('Réponse suppression piste:', response);
            return response.data || response;
        } catch (error) {
            console.error('Erreur détaillée lors de la suppression de la piste:', error);
            throw error;
        }
    },

    // Récupérer une playlist spécifique
    getPlaylist: async (playlistId) => {
        try {
            console.log('Récupération de la playlist:', playlistId);
            const response = await fetchWithAuth(`/playlists/${playlistId}`);
            console.log('Réponse récupération playlist:', response);
            
            // Vérifier si nous avons des données et les formater correctement
            if (response.data) {
                return { data: response.data };
            } else if (response.success && response.tracks) {
                return { data: response };
            }
            
            // Si nous n'avons pas de données structurées, retourner la réponse telle quelle
            return { data: response };
        } catch (error) {
            console.error('Erreur détaillée lors de la récupération de la playlist:', error);
            throw error;
        }
    },

    // Supprimer une playlist
    deletePlaylist: async (playlistId) => {
        try {
            console.log('Suppression de la playlist:', playlistId);
            const response = await fetchWithAuth(`/playlists/${playlistId}`, {
                method: 'DELETE',
            });
            console.log('Réponse suppression playlist:', response);
            return response.data || response;
        } catch (error) {
            console.error('Erreur détaillée lors de la suppression de la playlist:', error);
            throw error;
        }
    },

    // Mettre à jour une playlist
    updatePlaylist: async (playlistId, updateData) => {
        try {
            console.log('Mise à jour de la playlist:', { playlistId, updateData });
            const response = await fetchWithAuth(`/playlists/${playlistId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData),
            });
            console.log('Réponse mise à jour playlist:', response);
            return response.data || response;
        } catch (error) {
            console.error('Erreur détaillée lors de la mise à jour de la playlist:', error);
            throw error;
        }
    }
};

export default playlistApi; 