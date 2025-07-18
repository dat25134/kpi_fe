import { useEffect, useState } from "react";
import { getAlertsNotifications } from "@/services/report";

export interface OverdueTask {
  id: number;
  name: string;
  department: string;
  overdueDays: number;
  assignee: string;
}

export interface AlertsNotificationsData {
  overdueTasks: number;
  overdueTaskDetails?: OverdueTask[];
  upcomingTasks: number;
  newEmployees: number;
  achievedTargets: { department: string; percent: number }[];
}

export function useAlertsNotifications({ departmentId }: { departmentId?: string }) {
  const [data, setData] = useState<AlertsNotificationsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getAlertsNotifications({ departmentId })
      .then((res) => setData(res))
      .catch(() => setError("Lỗi khi tải dữ liệu cảnh báo/thông báo"))
      .finally(() => setIsLoading(false));
  }, [departmentId]);

  return { data, isLoading, error };
} 