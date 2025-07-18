import { useEffect, useState } from "react";
import { getKPITrends } from "@/services/report";

export interface KPITrend {
  month: string;
  target: number;
  achieved: number;
}

export function useKPITrends({ year, departmentId }: { year?: number; departmentId?: string }) {
  const [data, setData] = useState<KPITrend[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getKPITrends({ year, departmentId })
      .then((res) => setData(res))
      .catch(() => setError("Lỗi khi tải dữ liệu xu hướng KPI"))
      .finally(() => setIsLoading(false));
  }, [year, departmentId]);

  return { data, isLoading, error };
} 