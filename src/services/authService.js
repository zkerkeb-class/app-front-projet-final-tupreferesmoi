import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Création d'une instance axios avec la configuration de base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const authService = {
    async register(userData) {
        try {
            const response = await api.post("/auth/register", userData);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response
                ? error
                : new Error("Erreur de connexion au serveur");
        }
    },

    async login(credentials) {
        try {
            const response = await api.post("/auth/login", credentials);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response
                ? error
                : new Error("Erreur de connexion au serveur");
        }
    },

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
