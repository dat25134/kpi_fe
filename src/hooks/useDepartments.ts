import useSWR from "swr";
import api from "@/services/api";
import { API_ENDPOINTS } from "@/config/api";
import { fetchDepartments, fetchDepartmentsSummary } from "@/services/department";

export function useDepartments() {
  const { data, error, isLoading } = useSWR("departments", fetchDepartments);
  return {
    data: data,
    isLoading,
    isError: error,
  };
}

export function useDepartmentSummary() {
  const { data, error, isLoading } = useSWR("departments-summary", fetchDepartmentsSummary);
  return {
    data: data,
    isLoading,
    isError: error,
  };
} 