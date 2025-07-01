import { fetchCategories } from "@/services/category"
import useSWR from "swr"

export function useCategories() {
  const { data, error, isLoading } = useSWR("categories", fetchCategories)

  return {
    categories: data,
    isLoading,
    error
  }
} 