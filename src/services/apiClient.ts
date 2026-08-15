import axios from 'axios';

const baseURL = (import.meta as any).env?.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hpb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired or invalid
      // Only clear if token was present to avoid clearing on intentional failed logins
      const token = localStorage.getItem('hpb_token');
      if (token && !error.config.url?.includes('/auth/login')) {
        localStorage.removeItem('hpb_token');
      }
    }
    return Promise.reject(error);
  }
);
