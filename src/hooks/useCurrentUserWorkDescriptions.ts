import { useEffect, useState } from "react";
import { getCurrentUserWorkDescriptions } from "@/services/task";
import type { WorkDescriptionItem } from "@/types/evaluation";

export function useCurrentUserWorkDescriptions() {
  const [data, setData] = useState<{
    user_id: number;
    month: number;
    year: number;
    work_descriptions: WorkDescriptionItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getCurrentUserWorkDescriptions()
      .then(setData)
      .catch((err) => setError(err?.message || 'Lỗi tải dữ liệu KPI'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
} 