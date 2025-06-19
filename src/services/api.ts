import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS, API_URL } from '@/config/api';
import { getAuthToken, setAuthToken } from "@/services/auth";
import { toast } from 'sonner';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Trong src/services/api.ts
api.interceptors.response.use(
  (response) => {
    hideLoading();
    return response;
  },
  (error) => {
    hideLoading();
    if (error.response && (error.response.status === 401 || error.response.status === 419)) {
      // Xử lý khi bị 401/419 ở mọi request
      setAuthToken("")
      toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.")
      window.location.href = "/login";
      // Ví dụ: logout, redirect, toast, ...
    }
    return Promise.reject(error);
  }
);

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

export async function fetchUserInfo() {
  const token = getAuthToken();
  const config = {
    ...API_CONFIG,
    headers: {
      ...API_CONFIG.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  const response = await api.get(API_ENDPOINTS.USER.USER_INFO, config);
  return response.data.data;
} 

export async function fetchUserProfile() {
  const token = getAuthToken();
  const config = {
    ...API_CONFIG,
    headers: {
      ...API_CONFIG.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  const response = await api.get(API_ENDPOINTS.USER.PROFILE, config);
  return response.data.data;
}