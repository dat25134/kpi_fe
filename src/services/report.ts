import { API_ENDPOINTS } from "@/config/api";
import apiClient from "./apiClient";

export async function getKPITrends({ year, departmentId }: { year?: number; departmentId?: string }) {
  const params: any = {};
  if (year) params.year = year;
  if (departmentId) params.departmentId = departmentId;
  const res = await apiClient.get(API_ENDPOINTS.REPORTS.KPI_TRENDS, { params });
  return res.data;
}

export async function getTopPerformers({ departmentId }: { departmentId?: string }) {
  const params: any = {};
  if (departmentId) params.departmentId = departmentId;
  const res = await apiClient.get(API_ENDPOINTS.REPORTS.KPI_TRENDS.replace("kpi-trends", "top-performers"), { params });
  return res.data;
}

export async function getAlertsNotifications({ departmentId }: { departmentId?: string }) {
  const params: any = {};
  if (departmentId) params.departmentId = departmentId;
  const res = await apiClient.get(API_ENDPOINTS.REPORTS.ALERTS_NOTIFICATIONS, { params });
  return res.data;
}

export async function getDepartmentDistribution({ departmentId }: { departmentId?: string }) {
  const params: any = {};
  if (departmentId) params.departmentId = departmentId;
  const res = await apiClient.get(API_ENDPOINTS.REPORTS.DEPARTMENT_DISTRIBUTION, { params });
  return res.data;
}

export async function getMonthlyPerformance({ departmentId, month }: { departmentId?: string; month?: string }) {
  const params: any = {};
  if (departmentId) params.departmentId = departmentId;
  if (month) params.month = month;
  const res = await apiClient.get(API_ENDPOINTS.REPORTS.MONTHLY_PERFORMANCE, { params });
  return res.data;
}

export async function getRecentActivities({ departmentId, timeFilter }: { departmentId?: string; timeFilter?: string }) {
  const params: any = {};
  if (departmentId) params.departmentId = departmentId;
  if (timeFilter) params.timeFilter = timeFilter;
  const res = await apiClient.get(API_ENDPOINTS.REPORTS.RECENT_ACTIVITIES, { params });
  return res.data;
} 