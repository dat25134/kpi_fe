import useSWR from "swr";
import { fetchUserInfo } from "@/services/api";

export function useUser() {
  const { data, error, isLoading } = useSWR("user-info", fetchUserInfo);
  return {
    user: data,
    isLoading,
    isError: error,
  };
} 