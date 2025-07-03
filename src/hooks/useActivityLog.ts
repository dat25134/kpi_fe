import { useState, useCallback } from "react";
import { fetchActivityLogs } from "@/services/activity-log";
import type { ActivityLog, ActivityLogFilters, ActivityLogPagination } from "@/types/activity-log";

export function useActivityLog(initialFilters: ActivityLogFilters = {}) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<ActivityLogPagination | null>(null);
  const [filters, setFilters] = useState<ActivityLogFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const loadLogs = useCallback(async (customFilters?: ActivityLogFilters) => {
    setLoading(true);
    setError(null);
    const usedFilters = customFilters || filters;
    const data = await fetchActivityLogs(usedFilters);
    setLogs(data.logs);
    setPagination(data.pagination);
    setLoading(false);
  }, [filters]);

  return {
    logs,
    pagination,
    filters,
    setFilters,
    loading,
    error,
    loadLogs,
  };
} 