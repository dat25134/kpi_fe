import { API_ENDPOINTS } from "@/config/api";
import apiClient from "./apiClient";

export async function fetchNotifications() {
  const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
  return response.data;
}

export async function markNotificationAsRead(id: string) {
  return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
}

export async function markAllNotificationsAsRead() {
  return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
}