import { Evaluation, EvaluationResponse, EvaluationDetail, EvaluationCriteriaCategoryResponse, CategoryCriteriaFilter, CategoryCriteriaResponse } from '@/types/evaluation'
import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'
import useSWR from 'swr'

export const evaluationService = {
  // Lấy danh sách phiếu đánh giá
  getEvaluations: async (params?: {
    page?: number
    limit?: number
    status?: string
    month?: number
    year?: number
    role?: string
  }): Promise<EvaluationResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUATIONS.LIST, { params })
    return response.data
  },

  // Lấy chi tiết phiếu đánh giá
  getEvaluationById: async (id: number): Promise<EvaluationDetail> => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUATIONS.DETAIL(id))
    return response.data.data
  },

  // Tạo phiếu đánh giá mới
  createEvaluation: async (data: Partial<Evaluation>): Promise<Evaluation> => {
    const response = await apiClient.post(API_ENDPOINTS.EVALUATIONS.CREATE, data)
    return response.data
  },

  // Cập nhật phiếu đánh giá
  updateEvaluation: async (id: number, data: Partial<Evaluation>): Promise<Evaluation> => {
    const response = await apiClient.put(API_ENDPOINTS.EVALUATIONS.UPDATE(id), data)
    return response.data
  },

  // Xóa phiếu đánh giá
  deleteEvaluation: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.EVALUATIONS.DELETE(id))
  },
}

export async function fetchCategoryWithCriteria(filters: CategoryCriteriaFilter = {}): Promise<CategoryCriteriaResponse> {
  const params = new URLSearchParams();
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.role_id) {
    params.append('role_id', filters.role_id);
  }

  const response = await apiClient.get(`${API_ENDPOINTS.EVALUATION_CRITERIA.LIST}?${params.toString()}`);
  return response.data;
}

export async function createCategoryCriteria(payload: { name: string }) {
  const response = await apiClient.post(API_ENDPOINTS.EVALUATION_CRITERIA.CREATE, payload);
  return response.data.data;
}


export async function updateCategoryCriteria(id: number, payload: { name: string }) {
  const response = await apiClient.put(API_ENDPOINTS.EVALUATION_CRITERIA.UPDATE_CATEGORY(id), payload);
  return response.data.data;
}