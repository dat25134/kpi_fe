import { fetchTasks } from "@/services/task"
import useSWR from "swr"
import { createTask, updateTask } from "@/services/task"
import { mutate } from "swr"
import { API_ENDPOINTS } from "@/config/api"

export function useTasks(params: Record<string, any>) {
  const { data, error, isLoading } = useSWR(
    ["tasks", params],
    () => fetchTasks(params)
  );

  // Thêm task
  const addTask = async (taskData: Omit<import("@/types/task").Task, 'id'>) => {
    await createTask(taskData);
    mutate(["tasks", params]);
  };

  // Sửa task
  const editTask = async (id: number, taskData: Partial<import("@/types/task").Task>) => {
    await updateTask(id, taskData);
    mutate(["tasks", params]);
  };

  return {
    tasks: data?.tasks,
    pagination: data?.pagination,
    isLoading,
    error,
    addTask,
    editTask
  }
} 