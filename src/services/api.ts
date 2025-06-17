import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';

// Tạo instance axios với cấu hình mặc định
const api: AxiosInstance = axios.create(API_CONFIG);

// Thêm interceptor để xử lý request
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
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

// Thêm interceptor để xử lý response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Xử lý refresh token nếu cần
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Thêm logic refresh token ở đây nếu cần
        return api(originalRequest);
      } catch (refreshError) {
        // Xử lý lỗi refresh token
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 