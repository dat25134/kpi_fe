import api from './api';
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { getAuthToken } from './auth';
import { isAxiosError } from 'axios';


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

// Types cho Employee
export interface Employee {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  position: string;
  department: {
    id: number;
    name: string;
    code: string;
  };
  status: 'active' | 'inactive';
  joinDate: string;
  salary: number;
  address: string;
  birthDate: string;
  gender: 'Nam' | 'Nữ';
  education: string;
  experience: string;
  skills: string[];
  projects: Array<{
    name: string;
    role: string;
    status: string;
  }>;
}

// Custom error for validation
export class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super('Validation Error');
    this.name = 'ValidationError';
  }
}

// Types cho Employee Summary
export interface EmployeeSummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  averageSalary: number;
  departmentStats: Array<{
    departmentId: number;
    departmentName: string;
    departmentCode: string;
    employeeCount: number;
  }>;
  positionStats: Array<{
    position: string;
    count: number;
  }>;
}

// Types cho Employee List Response
export interface EmployeeListResponse {
  employees: Employee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Types cho Employee Filters
export interface EmployeeFilters {
  search?: string;
  departmentId?: number;
  position?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
}

// API Functions

/**
 * Lấy thống kê tổng quan về nhân viên
 */
export async function fetchEmployeeSummary(): Promise<EmployeeSummary> {
  try {
    const response = await api.get(API_ENDPOINTS.EMPLOYEES.SUMMARY, getConfig());
    return response.data.data;
  } catch (error) {
    console.error('Error fetching employee summary:', error);
    throw error;
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

    const response = await api.get(`${API_ENDPOINTS.EMPLOYEES.LIST}?${params.toString()}`, getConfig());
    return response.data.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

/**
 * Tạo nhân viên mới
 */
export async function createEmployee(employeeData: Omit<Employee, 'id' | 'joinDate' | 'projects'>): Promise<Employee> {
  try {
    const response = await api.post(API_ENDPOINTS.EMPLOYEES.CREATE, employeeData, getConfig());
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
    const response = await api.put(API_ENDPOINTS.EMPLOYEES.UPDATE(id), employeeData, getConfig());
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
    await api.delete(API_ENDPOINTS.EMPLOYEES.DELETE(id), getConfig());
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
    const response = await api.get(API_ENDPOINTS.EMPLOYEES.DETAIL(id), getConfig());
    return response.data.data;
  } catch (error) {
    console.error('Error fetching employee detail:', error);
    throw error;
  }
} 