import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
    baseURL: 'https://mannsaathi.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },
    getProfile: async () => {
        try {
            const response = await api.get('/auth/me');
            return response;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get profile' };
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// User API
export const userAPI = {
    getProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get profile' };
        }
    },
    updateProfile: async (data) => {
        try {
            const response = await api.put('/users/profile', data);
            return response;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update profile' };
        }
    },
    getAppointments: async () => {
        try {
            const response = await api.get('/users/appointments');
            return response;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get appointments' };
        }
    },
    bookAppointment: async (data) => {
        try {
            const response = await api.post('/users/appointments', data);
            return response;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to book appointment' };
        }
    },
    cancelAppointment: async (id) => {
        try {
            const response = await api.delete(`/users/appointments/${id}`);
            return response;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to cancel appointment' };
        }
    }
};

// Counselor API
export const counselorAPI = {
    getProfile: () => api.get('/counselors/profile'),
    updateProfile: (data) => api.put('/counselors/profile', data),
    getAppointments: () => api.get('/counselors/appointments'),
    updateAvailability: (data) => api.put('/counselors/availability', data),
    getClients: () => api.get('/counselors/clients')
};

// Session API
export const sessionAPI = {
    startSession: (id) => api.post(`/sessions/${id}/start`),
    endSession: (id) => api.post(`/sessions/${id}/end`),
    getSessionDetails: (id) => api.get(`/sessions/${id}`),
    sendMessage: (id, message) => api.post(`/sessions/${id}/messages`, { message })
};

export default api; 