import useSWR from "swr";
import { fetchDepartments, fetchDepartmentsList, fetchDepartmentsSummary } from "@/services/department";
import { DepartmentFilters } from "@/types/department";

export function useDepartments(filters: DepartmentFilters = {}) {
  const { data, error, isLoading } = useSWR(
    ["departments", filters], 
    () => fetchDepartments(filters)
  );
  return {
    data: data?.data || [],
    pagination: data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
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

export function useDepartmentsListSelect() {
  const { data, error, isLoading } = useSWR("departments-list", fetchDepartmentsList);

  return {
    data: data,
    isLoading,
    isError: error
  }
}