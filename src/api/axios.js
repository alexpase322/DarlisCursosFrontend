import axios from 'axios';

// Creamos una instancia base
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api', // La URL de tu backend
    withCredentials: true
});

// Interceptor: Inyectar el token en cada petición si existe
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;