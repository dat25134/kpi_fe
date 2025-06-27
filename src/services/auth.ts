import { API_ENDPOINTS } from '@/config/api';
import apiClient from "./apiClient";
import { handleApiError } from "./errorHandler";

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    // Add other user fields as needed
  };
}

export async function login(email: string, password: string): Promise<any> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export const setAuthToken = (token: string) => {
  if (token) {
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
  } else {
    document.cookie = 'token=; path=/; max-age=0; SameSite=Strict';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
  }
};

export const getAuthToken = () => {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? match[2] : null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
}; 