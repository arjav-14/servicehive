import axios from 'axios';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token to headers dynamically
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gigflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Uniform error alerts and session expiry routing
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'A network error occurred. Please try again.';
    
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('gigflow_token');
      localStorage.removeItem('gigflow_user');
      
      toast.error('Session expired. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
