import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { getAuthToken } from './auth';
import { isAxiosError } from 'axios';
import apiClient from "./apiClient";
import { handleApiError } from "./errorHandler";
import type { Employee, EmployeeSummary, EmployeeListResponse, EmployeeFilters } from '@/types/employee';


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

// Custom error for validation
export class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super('Validation Error');
    this.name = 'ValidationError';
  }
}

// API Functions

/**
 * Lấy thống kê tổng quan về nhân viên
 */
export async function fetchEmployeeSummary(): Promise<EmployeeSummary> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.SUMMARY, getConfig());
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Lấy danh sách nhân viên với phân trang và lọc
 */
export async function fetchEmployees(filters: EmployeeFilters = {}): Promise<EmployeeListResponse> {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.departmentId) {
      params.append('department_id', filters.departmentId.toString());
    }
    if (filters.position) {
      params.append('position', filters.position);
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

    const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.LIST}?${params.toString()}`, getConfig());
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Tạo nhân viên mới
 */
export async function createEmployee(employeeData: Omit<Employee, 'id' | 'joinDate' | 'projects'>): Promise<Employee> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES.CREATE, employeeData, getConfig());
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 422) {
      throw new ValidationError(error.response.data.errors);
    }
    console.error('Error creating employee:', error);
    throw error;
  }
}

/**
 * Cập nhật thông tin nhân viên
 */
export async function updateEmployee(id: number, employeeData: Partial<Employee>): Promise<Employee> {
  try {
    const response = await apiClient.put(API_ENDPOINTS.EMPLOYEES.UPDATE(id), employeeData, getConfig());
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 422) {
      throw new ValidationError(error.response.data.errors);
    }
    console.error('Error updating employee:', error);
    throw error;
  }
}

/**
 * Xóa nhân viên
 */
export async function deleteEmployee(id: number): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.EMPLOYEES.DELETE(id), getConfig());
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

/**
 * Lấy chi tiết nhân viên
 */
export async function fetchEmployeeDetail(id: number): Promise<Employee> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.DETAIL(id), getConfig());
    return response.data.data;
  } catch (error) {
    console.error('Error fetching employee detail:', error);
    throw error;
  }
} 