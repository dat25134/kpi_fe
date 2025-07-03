import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import { ProgressItem } from "@/types/task";
import apiClient from "./apiClient";
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

export async function updateTaskProgress(taskId: number, contentProgress: string): Promise<ProgressItem> {
  const response = await apiClient.post(API_ENDPOINTS.TASKS.PROGRESS(taskId), { contentProgress }, getConfig());
  return response.data.data;
} 