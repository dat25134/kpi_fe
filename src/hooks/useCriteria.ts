import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetchCategoryWithCriteria, createCategoryCriteria } from "@/services/evaluation";
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

export function useCreateCategory() {
  return useSWRMutation(
    "create-category",
    (_key, { arg }: { arg: { name: string } }) => createCategoryCriteria(arg)
  );
} 