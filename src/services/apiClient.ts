import axios from "axios";
import { setAuthToken, getAuthToken } from "./auth";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

let loadingCount = 0;
let loadingTimeout: NodeJS.Timeout | null = null;
let showLoadingFn: (() => void) | null = null;
let hideLoadingFn: (() => void) | null = null;
let isAuthRedirecting = false;

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
apiClient.interceptors.request.use(
  (config) => {
    showLoading();
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = getAuthToken() || localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
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
apiClient.interceptors.response.use(
  (response) => {
    hideLoading();
    return response;
  },
  (error) => {
    hideLoading();
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 419)
    ) {
      if (!isAuthRedirecting) {
        isAuthRedirecting = true;
        setAuthToken("");
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        window.dispatchEvent(new Event("auth-expired"));
      }
    }
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

export default apiClient; 