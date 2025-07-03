import apiClient from "./apiClient";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import { getAuthToken } from "./auth";
import type { ActivityLog, ActivityLogPagination, ActivityLogResponse, ActivityLogFilters } from "@/types/activity-log";

const getConfig = () => {
  const token = getAuthToken();
  return {
    ...API_CONFIG,
    headers: {
      ...API_CONFIG.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
};

export async function fetchActivityLogs(filters: ActivityLogFilters = {}): Promise<ActivityLogResponse> {
  const params = { ...filters };
  const response = await apiClient.get(API_ENDPOINTS.ACTIVITY_LOG.LIST, { ...getConfig(), params });
  return response.data.data;
} 