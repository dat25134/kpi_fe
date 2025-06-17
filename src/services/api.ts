import axios from 'axios';
import { API_URL } from '@/config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let loadingCount = 0;
let loadingTimeout: NodeJS.Timeout | null = null;
let showLoadingFn: (() => void) | null = null;
let hideLoadingFn: (() => void) | null = null;

export const initializeLoading = (show: () => void, hide: () => void) => {
  showLoadingFn = show;
  hideLoadingFn = hide;
};

const showLoading = () => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  
  loadingCount++;
  if (loadingCount === 1 && showLoadingFn) {
    showLoadingFn();
  }
};

const hideLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1);
  
  if (loadingCount === 0) {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    
    loadingTimeout = setTimeout(() => {
      if (hideLoadingFn) {
        hideLoadingFn();
      }
      loadingTimeout = null;
    }, 300); // Small delay to prevent flickering
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    showLoading();
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    hideLoading();
    return response;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);

// Reset loading state if something goes wrong - only in browser
if (typeof window !== 'undefined') {
  window.addEventListener('unload', () => {
    loadingCount = 0;
    if (hideLoadingFn) {
      hideLoadingFn();
    }
  });
}

export default api; 