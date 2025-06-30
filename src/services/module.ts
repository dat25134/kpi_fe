import { API_CONFIG, API_ENDPOINTS } from "@/config/api"
import apiClient from "./apiClient"
import { PermissionModule } from "@/types/module"
import { getAuthToken } from "./auth"

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
export async function getPermissionModules(): Promise<PermissionModule[]> {
  const res = await apiClient.get(API_ENDPOINTS.PERMISSIONS.MODULES, getConfig())
  if (res.data && res.data.status && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
} 