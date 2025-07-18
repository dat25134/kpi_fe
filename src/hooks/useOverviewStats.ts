import { useEffect, useState } from "react";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/api";

export function useOverviewStats({ timeFilter, departmentId }: { timeFilter: string, departmentId?: string | number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get(API_ENDPOINTS.REPORTS.OVERVIEW, {
      params: {
        time: timeFilter,
        department: departmentId && departmentId !== 'all' ? departmentId : undefined,
      }
    })
      .then(res => setData(res.data))
      .catch(err => setError(err?.message || "Lỗi tải dữ liệu tổng quan"))
      .finally(() => setLoading(false));
  }, [timeFilter, departmentId]);

  return { data, loading, error };
} 