import { useEffect, useState } from "react";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/api";

export function usePositionStats(timeFilter: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get(API_ENDPOINTS.REPORTS.POSITION_STATS, { params: { time: timeFilter } })
      .then(res => setData(res.data))
      .catch(err => setError(err?.message || "Lỗi tải dữ liệu chức vụ"))
      .finally(() => setLoading(false));
  }, [timeFilter]);

  return { data, loading, error };
} 