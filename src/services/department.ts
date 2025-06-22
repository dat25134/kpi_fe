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