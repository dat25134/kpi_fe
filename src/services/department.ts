import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import api from './api';
import { getAuthToken } from './auth';

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

export async function fetchDepartments() {
  const response = await api.get(API_ENDPOINTS.AUTH.DEPARTMENT, getConfig());
  return response.data.data;
}

export async function fetchDepartmentsSummary() {
  const response = await api.get(API_ENDPOINTS.AUTH.DEPARTMENT_SUMMARY, getConfig());
  return response.data.data;
}

export const getDepartments = async (params: any) => {
  const response = await api.get(API_ENDPOINTS.AUTH.DEPARTMENT, getConfig());
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
  const response = await api.post(API_ENDPOINTS.AUTH.DEPARTMENT_CREATE, departmentData, getConfig());
  return response.data;
};

export const updateDepartment = async (id: number, departmentData: Partial<DepartmentPayload>) => {
  const endpoint = `${API_ENDPOINTS.AUTH.DEPARTMENT}/${id}`;
  const response = await api.put(endpoint, departmentData, getConfig());
  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const endpoint = `${API_ENDPOINTS.AUTH.DEPARTMENT}/${id}`;
  const response = await api.delete(endpoint, getConfig());
  return response.data;
};