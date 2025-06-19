import useSWR from "swr";
import { fetchUserInfo, fetchUserProfile } from "@/services/api";

export function useUser() {
  const { data, error, isLoading } = useSWR("user-info", fetchUserInfo);
  return {
    user: data,
    isLoading,
    isError: error,
  };
} 

export function useUserProfile() {
  const { data, error, isLoading } = useSWR("user-profile", fetchUserProfile);
  return {
    userProfile: data,
    isLoading,
    isError: error,
  };
}