import { useEffect, useState } from "react";
import { getMonthlyPerformance } from "@/services/report";

export function useMonthlyPerformance({ departmentId, month }: { departmentId?: string; month?: string }) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getMonthlyPerformance({ departmentId, month })
      .then((res) => setData(res))
      .catch(() => setError("Lỗi khi tải dữ liệu hiệu suất tháng"))
      .finally(() => setIsLoading(false));
  }, [departmentId, month]);

  return { data, isLoading, error };
} 