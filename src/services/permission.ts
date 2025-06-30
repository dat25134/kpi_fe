import apiClient from "./apiClient";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import { getAuthToken } from "./auth";
import { handleApiError } from "./errorHandler";

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

export async function fetchPermissions() {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.LIST, getConfig());
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
