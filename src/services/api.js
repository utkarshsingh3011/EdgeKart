import axios from 'axios';

// Create Axios instance with default configuration
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Attach JWT token from localStorage to every request if present
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    // removed debug log

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response Interceptor: Handle global response errors (such as 401 Unauthorized / Token Expiration)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear expired or invalid authentication credentials
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');

            // Dispatch custom event for application-wide unauthorized handling
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        return Promise.reject(error);
    }
);

export default API;
