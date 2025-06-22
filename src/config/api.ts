export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:90/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/login`,
    LOGOUT: `${API_URL}/logout`,
    REFRESH_TOKEN: `${API_URL}/refresh-token`,
    DEPARTMENT: `${API_URL}/departments`,
    DEPARTMENT_SUMMARY: `${API_URL}/departments/summary`,
    DEPARTMENT_CREATE: `${API_URL}/departments/`,
  },
  USER: {
    USER_INFO: `${API_URL}/user/info`,
    PROFILE: `${API_URL}/user/profile`,
    UPDATE_PROFILE: `${API_URL}/user/profile`,
  },
  // Thêm các nhóm API khác ở đây
} as const;

// Cấu hình mặc định cho axios
export const API_CONFIG = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const; 