import axios from 'axios';

// Base URL configuration - change this in production
const API_URL = 'http://localhost:8000/api/users/';

// Create an axios instance with credential support for cookies
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authAPI = {
    // Login by sending credentials to backend to set cookies
    login: async (username, password) => {
        try {
            const response = await api.post('login/', { username, password });
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Fetch current user details using cookie token
    getMe: async () => {
        try {
            const response = await api.get('me/');
            return response.data;
        } catch (error) {
            console.error('Fetch user error:', error);
            throw error;
        }
    },

    // Logout by asking backend to clear cookies
    logout: async () => {
        try {
            await api.post('logout/');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
};
