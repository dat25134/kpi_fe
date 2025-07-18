import { useEffect, useState } from "react";
import { getDepartmentDistribution } from "@/services/report";

export function useDepartmentDistribution({ departmentId }: { departmentId?: string }) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getDepartmentDistribution({ departmentId })
      .then((res) => setData(res))
      .catch(() => setError("Lỗi khi tải dữ liệu phân bố phòng ban"))
      .finally(() => setIsLoading(false));
  }, [departmentId]);

  return { data: data ?? [], isLoading, error };
} 