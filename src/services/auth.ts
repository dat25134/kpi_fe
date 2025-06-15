import { API_ENDPOINTS } from '@/config/api';
import api from './api';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    // Add other user fields as needed
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 ngày
  } else {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
}; 