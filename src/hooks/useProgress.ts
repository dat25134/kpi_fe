import { useCallback } from "react";
import { updateTaskProgress } from "@/services/progress";
import { ProgressItem } from "@/types/task";
import { API_ENDPOINTS } from "@/config/api";
import { mutate } from "swr";

export function useProgress() {
  const updateProgress = useCallback(async (taskId: number, contentProgress: string): Promise<ProgressItem> => {
    const res = await updateTaskProgress(taskId, contentProgress);
    mutate(API_ENDPOINTS.TASKS.LIST);
    return res;
  }, []);

  return { updateProgress };
} 