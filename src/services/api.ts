import axios from 'axios';
import { LoginRequest, AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api'; // Auth API
const MANAGER_API_URL = import.meta.env.VITE_MANAGER_API_URL || 'http://localhost:5001/api'; // Manager API

// Create axios instances
export const authApi = axios.create({
  baseURL: API_BASE_URL,
});

export const managerApi = axios.create({
  baseURL: MANAGER_API_URL,
});

// Add auth token to requests
const addAuthInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle 401 responses
  apiInstance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      // Return the original error to preserve response data
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(authApi);
addAuthInterceptor(managerApi);

// Auth API Services
export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: any) => {
    const response = await authApi.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Manager API Services
export const customerService = {
  getAll: async (page = 1, pageSize = 10, search = '') => {
    const response = await managerApi.get('/customers', {
      params: { page, pageSize, search }
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await managerApi.get(`/customers/${id}`);
    return response.data;
  },

  create: async (customer: any) => {
    const response = await managerApi.post('/customers', customer);
    return response.data;
  },

  update: async (id: number, customer: any) => {
    const response = await managerApi.put(`/customers/${id}`, customer);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await managerApi.delete(`/customers/${id}`);
    return response.data;
  }
};

export const appointmentService = {
  getAll: async (params: any = {}) => {
    const response = await managerApi.get('/appointments', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await managerApi.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (appointment: any) => {
    const response = await managerApi.post('/appointments', appointment);
    return response.data;
  },

  update: async (id: number, appointment: any) => {
    const response = await managerApi.put(`/appointments/${id}`, appointment);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await managerApi.delete(`/appointments/${id}`);
    return response.data;
  }
};


// Dentist API Services
export const dentistService = {
  list: async (page = 1, pageSize = 10, search = '') => {
    const response = await managerApi.get('/dentists', {
      params: { page, pageSize, search }
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await managerApi.get(`/dentists/${id}`);
    return response.data;
  },

  create: async (dentist: any) => {
    const response = await managerApi.post('/dentists', dentist);
    return response.data;
  },

  update: async (id: number, dentist: any) => {
    const response = await managerApi.put(`/dentists/${id}`, dentist);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await managerApi.delete(`/dentists/${id}`);
    return response.data;
  }
};
