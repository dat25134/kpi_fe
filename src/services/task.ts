import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import { getAuthToken } from "./auth";
import apiClient from "./apiClient";
import type { Task } from "@/types/task";

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

export async function fetchTasks(params = {}) {
  const response = await apiClient.get(API_ENDPOINTS.TASKS.LIST, {
    ...getConfig(),
    params,
  });
  return response.data.data;
}

export async function createTask(taskData: Omit<Task, 'id'>) {
  const response = await apiClient.post(API_ENDPOINTS.TASKS.CREATE, taskData, getConfig());
  return response.data.data;
}

export async function updateTask(id: number, taskData: Partial<Task>) {
  const response = await apiClient.post(API_ENDPOINTS.TASKS.UPDATE(id), taskData, getConfig());
  return response.data.data;
}