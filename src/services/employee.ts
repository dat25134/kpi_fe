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

// API Functions

/**
 * Lấy thống kê tổng quan về nhân viên
 */
export async function fetchEmployeeSummary(): Promise<EmployeeSummary> {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.SUMMARY, getConfig());
  return response.data.data;
}

/**
 * Lấy danh sách nhân viên với phân trang và lọc
 */
export async function fetchEmployees(filters: EmployeeFilters = {}): Promise<EmployeeListResponse> {
  const params = new URLSearchParams();
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.departmentId) {
    params.append('department_id', filters.departmentId.toString());
  }
  if (filters.roleName) {
    params.append('role_name', filters.roleName);
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
}

/**
 * Tạo nhân viên mới
 */
export async function createEmployee(employeeData: Omit<Employee, 'id' | 'joinDate' | 'projects'>): Promise<Employee> {
  const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES.CREATE, employeeData, getConfig());
  return response.data.data;
}

/**
 * Cập nhật thông tin nhân viên
 */
export async function updateEmployee(id: number, employeeData: Partial<Employee>): Promise<Employee> {
  const response = await apiClient.put(API_ENDPOINTS.EMPLOYEES.UPDATE(id), employeeData, getConfig());
  return response.data.data;
}

/**
 * Xóa nhân viên
 */
export async function deleteEmployee(id: number): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.EMPLOYEES.DELETE(id), getConfig());
}

/**
 * Lấy chi tiết nhân viên
 */
export async function fetchEmployeeDetail(id: number): Promise<Employee> {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.DETAIL(id), getConfig());
  return response.data.data;
} 

/**
 * Lấy danh sách nhân viên có vai trò là trưởng phòng
 */
export async function fetchManagerEmployees(): Promise<Employee[]> {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.MANAGER, getConfig());
  return response.data.data;
}