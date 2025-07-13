import useSWR from "swr";
import { evaluationService } from "@/services/evaluation";
import { type EvaluationDetail } from "@/types/evaluation";

export function useEvaluationDetail(id?: number | string, open?: boolean) {
  const shouldFetch = !!id && open;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ["evaluation-detail", id] : null,
    () => evaluationService.getEvaluationById(Number(id))
  );

  return { data, isLoading, error, refetch: mutate };
} 