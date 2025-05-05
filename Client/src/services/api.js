import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
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
    getProfile: () => api.get('/counselor/profile'),
    updateProfile: (data) => api.put('/counselor/profile', data),
    getAppointments: () => api.get('/counselor/appointments'),
    updateAvailability: (data) => api.put('/counselor/availability', data),
    getClients: () => api.get('/counselor/clients')
};

// Session API
export const sessionAPI = {
    startSession: (id) => api.post(`/sessions/${id}/start`),
    endSession: (id) => api.post(`/sessions/${id}/end`),
    getSessionDetails: (id) => api.get(`/sessions/${id}`),
    sendMessage: (id, message) => api.post(`/sessions/${id}/messages`, { message })
};

// Counselor API functions
export const getCounselorProfile = async () => {
    try {
        const response = await api.get('/counselor/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get counselor profile' };
    }
};

export const updateCounselorProfile = async (profileData) => {
    try {
        const response = await api.put('/counselor/profile', profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update counselor profile' };
    }
};

export const getCounselorAppointments = async () => {
    try {
        const response = await api.get('/counselor/appointments');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get counselor appointments' };
    }
};

export const updateCounselorAvailability = async (availability) => {
    try {
        const response = await api.put('/counselor/availability', { availability });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update counselor availability' };
    }
};

export const getCounselorClients = async () => {
    try {
        const response = await api.get('/counselor/clients');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get counselor clients' };
    }
};

export const getCounselorResources = async () => {
    try {
        const response = await api.get('/resources/my-resources');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get counselor resources' };
    }
};

// Resource API functions
export const resourceAPI = {
    getResources: () => api.get('/resources'),
    getResource: (id) => api.get(`/resources/${id}`),
    createResource: (data) => api.post('/resources', data),
    updateResource: (id, data) => api.put(`/resources/${id}`, data),
    deleteResource: (id) => api.delete(`/resources/${id}`),
    getMyResources: () => api.get('/resources/my-resources')
};

// Journal API functions
export const journalAPI = {
    getJournals: () => api.get('/journals'),
    getJournal: (id) => api.get(`/journals/${id}`),
    createJournal: (data) => api.post('/journals', data),
    updateJournal: (id, data) => api.put(`/journals/${id}`, data),
    deleteJournal: (id) => api.delete(`/journals/${id}`)
};

export default api; 