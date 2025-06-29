import useSWR from "swr";
import { API_ENDPOINTS } from "@/config/api";
import { fetchRolesSelection } from "@/services/role";

export function useRolesSelection() {
  const { data, error, isLoading } = useSWR(API_ENDPOINTS.ROLES.SELECTION, fetchRolesSelection);
  return { data, error, isLoading };
}