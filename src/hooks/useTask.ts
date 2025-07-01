import { fetchTasks } from "@/services/task"
import useSWR from "swr"

export function useTasks() {
  const { data, error, isLoading } = useSWR("tasks", fetchTasks)

  return {
    tasks: data,
    isLoading,
    error
  }
} 