import { useState, useEffect } from 'react'
import { evaluationService } from '@/services/evaluation'
import { Evaluation, EvaluationResponse, SaveEvaluationRequest, SaveEvaluationResponse } from '@/types/evaluation'

export interface UseEvaluationParams {
  page?: number
  limit?: number
  status?: string
  month?: number
  year?: number
  role?: string
  type?: string
  final_grade?: string
  name?: string
}

const defaultParams: UseEvaluationParams = {
  page: 1,
  limit: 10,
  type: 'personal',
}

export const useEvaluation = (params: UseEvaluationParams = {}) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<EvaluationResponse['pagination'] | null>(null)

  const fetchEvaluations = async (fetchParams: UseEvaluationParams = {}) => {
    const mergedParams = { ...defaultParams, ...fetchParams }
    setLoading(true)
    setError(null)
    const response = await evaluationService.getEvaluations(mergedParams)
    setEvaluations(response.data)
    setPagination(response.pagination)
    setLoading(false)
  }

  useEffect(() => {
    fetchEvaluations(params)
  }, [params.page, params.limit, params.status, params.month, params.year, params.role, params.type, params.final_grade, params.name])

  const refetch = () => {
    fetchEvaluations(params)
  }

  const createEvaluation = async (data: Partial<Evaluation>) => {
    setLoading(true)
    const newEvaluation = await evaluationService.createEvaluation(data)
    setEvaluations(prev => [newEvaluation, ...prev])
    setLoading(false)
    return newEvaluation
  }

  const updateEvaluation = async (id: number, data: Partial<Evaluation>) => {
    setLoading(true)
    const updatedEvaluation = await evaluationService.updateEvaluation(id, data)
    setEvaluations(prev => 
      prev.map(evaluation => evaluation.id === id ? updatedEvaluation : evaluation)
    )
    setLoading(false)
    return updatedEvaluation
  }

  const saveEvaluation = async (id: number, data: SaveEvaluationRequest): Promise<SaveEvaluationResponse> => {
    setLoading(true)
    try {
      const response = await evaluationService.saveEvaluation(id, data)
      // Refresh evaluations list after save
      await refetch()
      setLoading(false)
      return response
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const deleteEvaluation = async (id: number) => {
    setLoading(true)
    await evaluationService.deleteEvaluation(id)
    setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id))
    setLoading(false)
  }

  return {
    evaluations,
    loading,
    error,
    pagination,
    refetch,
    createEvaluation,
    updateEvaluation,
    saveEvaluation,
    deleteEvaluation
  }
} 