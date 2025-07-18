import { useEffect, useState } from "react";
import { getRecentActivities } from "@/services/report";

export function useRecentActivities({ departmentId, timeFilter }: { departmentId?: string; timeFilter?: string }) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getRecentActivities({ departmentId, timeFilter })
      .then((res) => setData(res))
      .catch(() => setError("Lỗi khi tải dữ liệu hoạt động gần đây"))
      .finally(() => setIsLoading(false));
  }, [departmentId, timeFilter]);

  return { data: data ?? [], isLoading, error };
} 