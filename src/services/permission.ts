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
  const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.LIST, getConfig());
  return response.data.data;
}

export async function syncPermissions(roleId: number, permission_ids: number[]) {
  const payload = {
    role_id: roleId,
    permission_ids: permission_ids
  }
  const response = await apiClient.post(API_ENDPOINTS.PERMISSIONS.SYNC, payload, getConfig());
  return response.data.data;
}
