import axios from 'axios';

const baseURL =
  (import.meta as any).env?.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  // IMPORTANT:
  // Do NOT set Content-Type globally.
  // Axios will automatically set the correct
  // Content-Type for JSON and FormData requests.
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hpb_token');

    if (token) {
      config.headers = config.headers || {};
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
    if (
      error.response &&
      error.response.status === 401
    ) {
      const token =
        localStorage.getItem('hpb_token');

      if (
        token &&
        !error.config?.url?.includes('/auth/login')
      ) {
        localStorage.removeItem('hpb_token');
      }
    }

    return Promise.reject(error);
  }
);