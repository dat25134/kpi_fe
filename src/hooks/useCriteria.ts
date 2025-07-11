import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetchCategoryWithCriteria, createCategoryCriteria, updateCategoryCriteria, deleteCategoryCriteria, createCriteria, updateCriteria, deleteCriteria } from "@/services/evaluation";
import { CategoryCriteriaFilter } from "@/types/evaluation";

export function useCategoryWithCriteria(filters: CategoryCriteriaFilter = {}) {
  const role_id = filters.role_id || "";
  const search = filters.search || "";
  const shouldFetch = !!role_id;
  const { data, error, isLoading } = useSWR(
    shouldFetch ? ["category-with-criteria", role_id, search] : null,
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

export function useUpdateCategoryCriteria() {
  return useSWRMutation(
    "update-category-criteria",
    (_key, { arg }: { arg: { id: number; name: string } }) => updateCategoryCriteria(arg.id, { name: arg.name })
  );
}

export function useDeleteCategoryCriteria() {
  return useSWRMutation(
    "delete-category-criteria",
    (_key, { arg }: { arg: { id: number } }) => deleteCategoryCriteria(arg.id)
  );
}

export function useCreateCriteria() {
  return useSWRMutation(
    "create-criteria",
    (_key, { arg }: { arg: import("@/types/evaluation").CreateCriteriaPayload }) => createCriteria(arg)
  );
}

export function useUpdateCriteria() {
  return useSWRMutation(
    "update-criteria",
    (_key, { arg }: { arg: { id: number; data: Partial<import("@/types/evaluation").CreateCriteriaPayload> } }) =>
      updateCriteria(arg.id, arg.data)
  );
}

export function useDeleteCriteria() {
  return useSWRMutation(
    "delete-criteria",
    (_key, { arg }: { arg: { id: number } }) => deleteCriteria(arg.id)
  );
} 