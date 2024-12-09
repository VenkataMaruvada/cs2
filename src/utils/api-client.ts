import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

// Create Axios client instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 60000, // Set timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add request interceptor for logging outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Ensure the backend is reachable.');
    } else if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error('Bad request:', error.response.data);
          break;
        case 404:
          console.error('Resource not found:', error.config.url);
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('No response received from the server.');
    } else {
      console.error('Request configuration error:', error.message);
    }

    // Do not retry requests; directly reject the promise
    return Promise.reject(error);
  }
);
