import { useEffect, useState } from "react";
import { getTopPerformers } from "@/services/report";

export function useTopPerformers({ departmentId }: { departmentId?: string }) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getTopPerformers({ departmentId })
      .then((res) => setData(res))
      .catch(() => setError("Lỗi khi tải dữ liệu top performers"))
      .finally(() => setIsLoading(false));
  }, [departmentId]);

  return { data, isLoading, error };
} 