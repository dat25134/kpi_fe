import { API_ENDPOINTS } from "@/config/api";
import apiClient from "./apiClient";

export async function getKPITrends({ year, departmentId }: { year?: number; departmentId?: string }) {
  const params: any = {};
  if (year) params.year = year;
  if (departmentId) params.departmentId = departmentId;
  const res = await apiClient.get(API_ENDPOINTS.REPORTS.KPI_TRENDS, { params });
  return res.data;
} 