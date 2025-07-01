import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import { getAuthToken } from "./auth";
import apiClient from "./apiClient";

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

export async function fetchTasks() {
  const response = await apiClient.get(API_ENDPOINTS.TASKS.LIST, getConfig());
  return response.data.data;
}