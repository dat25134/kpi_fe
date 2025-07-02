import { fetchTasks } from "@/services/task"
import useSWR from "swr"

export function useTasks(params: Record<string, any>) {
  const { data, error, isLoading } = useSWR(
    ["tasks", params],
    () => fetchTasks(params)
  );

  return {
    tasks: data?.tasks,
    pagination: data?.pagination,
    isLoading,
    error
  }
} 