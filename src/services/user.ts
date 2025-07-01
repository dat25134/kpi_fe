import apiClient from "./apiClient";
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { getAuthToken } from "./auth";

const getConfig = () => {
  const token = getAuthToken();
  return {
    ...API_CONFIG,
    headers: {
      ...API_CONFIG.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
}

export async function fetchUserInfo() {
  const response = await apiClient.get(API_ENDPOINTS.USER.USER_INFO, getConfig());
  return response.data.data;
}

export async function fetchUserProfile() {
  const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE, getConfig());
  return response.data;
} 

export async function fetchAllUsers() {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.ALL, getConfig());
  return response.data.data;
}