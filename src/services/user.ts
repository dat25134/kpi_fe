import apiClient from "./apiClient";
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { getAuthToken } from "./auth";

export async function fetchUserInfo() {
  const token = getAuthToken();
  const config = {
    ...API_CONFIG,
    headers: {
      ...API_CONFIG.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
  const response = await apiClient.get(API_ENDPOINTS.USER.USER_INFO, config);
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
  const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE, config);
  return response.data;
} 