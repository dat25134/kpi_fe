import useSWR from "swr";
import { fetchPermissions, syncPermissions } from "@/services/permission";

export function usePermissions() {
  const { data, error, isLoading } = useSWR("permissions", fetchPermissions);
  return {
    permissions: data,
    isLoading,
    isError: error,
  };
} 

export function useSyncPermissions() {
  const { data, error, isLoading } = useSWR("permissions", syncPermissions);
  return {
    permissions: data,
    isLoading,
    isError: error,
  };
} 
