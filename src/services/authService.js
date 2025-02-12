const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return handleResponse(response);
};

const authService = {
    async register(userData) {
        try {
            const data = await fetchWithAuth("/auth/register", {
                method: "POST",
                body: JSON.stringify(userData),
            });
            
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                document.dispatchEvent(new Event('auth-change'));
            }
            return data;
        } catch (error) {
            throw new Error(error.message || "Erreur de connexion au serveur");
        }
    },

    async login(credentials) {
        try {
            const data = await fetchWithAuth("/auth/login", {
                method: "POST",
                body: JSON.stringify(credentials),
            });
            
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                document.dispatchEvent(new Event('auth-change'));
            }
            return data;
        } catch (error) {
            throw new Error(error.message || "Erreur de connexion au serveur");
        }
    },

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.dispatchEvent(new Event('auth-change'));
    },

    getCurrentUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    getToken() {
        return localStorage.getItem("token");
    },

    isAuthenticated() {
        return !!this.getToken();
    },
};

export default authService;
