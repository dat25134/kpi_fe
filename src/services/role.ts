import apiClient from "./apiClient";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import { getAuthToken } from "./auth";

const getConfig = () => {
  const token = getAuthToken();
  return  {
    ...API_CONFIG,
    headers: {
      ...API_CONFIG.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
}

export async function fetchRolesSelection() {
  const response = await apiClient.get(API_ENDPOINTS.ROLES.SELECTION, getConfig());
  return response.data.data;
}