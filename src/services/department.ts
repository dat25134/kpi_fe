import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { getAuthToken } from './auth';
import apiClient from "./apiClient";
import { handleApiError } from "./errorHandler";
import { DepartmentFilters, DepartmentListResponse } from '@/types/department';

const getConfig = () => {
    const token = getAuthToken();
    return  {
      ...API_CONFIG,
      headers: {
        ...API_CONFIG.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    };
}



export async function fetchDepartments(filters: DepartmentFilters = {}): Promise<DepartmentListResponse> {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const response = await apiClient.get(`${API_ENDPOINTS.AUTH.DEPARTMENT}?${params.toString()}`, getConfig());
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function fetchDepartmentsSummary() {
  const response = await apiClient.get(API_ENDPOINTS.AUTH.DEPARTMENT_SUMMARY, getConfig());
  return response.data.data;
}

export const getDepartments = async (params: any) => {
  const response = await apiClient.get(API_ENDPOINTS.AUTH.DEPARTMENT, getConfig());
  return response.data;
};

export type DepartmentPayload = {
  name: string;
  code: string;
  description: string;
  manager_id: number;
  status: string;
};

export const createDepartment = async (departmentData: DepartmentPayload) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.DEPARTMENT_CREATE, departmentData, getConfig());
  return response.data;
};

export const updateDepartment = async (id: number, departmentData: Partial<DepartmentPayload>) => {
  const endpoint = `${API_ENDPOINTS.AUTH.DEPARTMENT}/${id}`;
  const response = await apiClient.put(endpoint, departmentData, getConfig());
  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const endpoint = `${API_ENDPOINTS.AUTH.DEPARTMENT}/${id}`;
  const response = await apiClient.delete(endpoint, getConfig());
  return response.data;
};