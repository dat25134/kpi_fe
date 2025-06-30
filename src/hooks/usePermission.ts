import useSWR from "swr";
import { fetchPermissions } from "@/services/permission";

export function usePermissions() {
  const { data, error, isLoading } = useSWR("permissions", fetchPermissions);
  return {
    permissions: data,
    isLoading,
    isError: error,
  };
} 
