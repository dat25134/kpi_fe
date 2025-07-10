import useSWR from "swr";
import { fetchCategoryWithCriteria } from "@/services/evaluation";
import { CategoryCriteriaFilter } from "@/types/evaluation";

export function useCategoryWithCriteria(filters: CategoryCriteriaFilter = {}) {
  const shouldFetch = !!filters.role_id;
  const { data, error, isLoading } = useSWR(
    shouldFetch ? ["category-with-criteria", filters] : null,
    () => fetchCategoryWithCriteria(filters)
  );
  return {
    data: shouldFetch && data?.data ? data.data : [],
    isLoading: shouldFetch ? isLoading : false,
    isError: shouldFetch ? error : false,
  };
} 