import { useState, useEffect, useCallback } from 'react';
import { 
  fetchEmployeeSummary, 
  fetchEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  fetchEmployeeDetail,
  fetchManagerEmployees,
  importEmployees as importEmployeesService,
  downloadEmployeeTemplate
} from '@/services/employee';
import type { Employee, EmployeeSummary, EmployeeFilters, EmployeeListResponse } from '@/types/employee';
import useSWR from 'swr';
import { syncEmployeePermissions } from '@/services/permission';
import { fetchAllUsers } from '@/services/user';
import { toast } from 'sonner';
import { useLoading } from '@/context/loading-context';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [summary, setSummary] = useState<EmployeeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState<EmployeeFilters>({
    page: 1,
    limit: 10,
  });
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = () => setRefetchIndex(prev => prev + 1);

  // Fetch employee summary
  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    const data = await fetchEmployeeSummary();
    setSummary(data);
    setSummaryLoading(false);
  }, []);

  // Effect to fetch employees whenever filters change
  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      const response: EmployeeListResponse = await fetchEmployees(filters);
      setEmployees(response.employees);
      setPagination(response.pagination);
      setLoading(false);
    };
    loadEmployees();
  }, [JSON.stringify(filters), refetchIndex]);

  // Add new employee
  const addEmployee = useCallback(async (employeeData: Omit<Employee, 'id' | 'joinDate' | 'projects'>) => {
    const newEmployee = await createEmployee(employeeData);
    // Chỉ fetch lại data khi thành công
    setLoading(true);
    await Promise.all([loadSummary(), refetch()]);
    return newEmployee;
  }, [loadSummary]);

  // Update employee
  const updateEmployeeById = useCallback(async (id: number, employeeData: Partial<Employee>) => {
    await updateEmployee(id, employeeData);
    // Chỉ fetch lại data khi thành công
    setLoading(true);
    await Promise.all([loadSummary(), refetch()]);
  }, [loadSummary]);

  // Delete employee
  const removeEmployee = useCallback(async (id: number) => {
    setLoading(true);
    await deleteEmployee(id);
    loadSummary();
    refetch();
  }, [loadSummary]);

  // Get employee detail
  const getEmployeeDetail = useCallback(async (id: number): Promise<Employee | null> => {
    const employee = await fetchEmployeeDetail(id);
    return employee;
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters: Partial<EmployeeFilters>) => {
    setFilters(currentFilters => ({ ...currentFilters, ...newFilters, page: 1 }));
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setFilters(currentFilters => ({ ...currentFilters, page }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
    });
  }, []);

  const updateEmployeePermissions = useCallback(async (employeeId: number, permissionIds: number[]) => {
    await syncEmployeePermissions(employeeId, permissionIds);
    refetch();
  }, [refetch]);

  // Load initial summary
  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return {
    // State
    employees,
    summary,
    loading,
    summaryLoading,
    pagination,
    filters,
    
    // Actions
    addEmployee,
    updateEmployeeById,
    removeEmployee,
    getEmployeeDetail,
    applyFilters,
    changePage,
    clearFilters,
    setLoading,
    updateEmployeePermissions,
    refetch,
  };
}

export function useManagers() {
  const { data, error, isLoading } = useSWR("managers", fetchManagerEmployees);
  return {
    data: data || [],
    isLoading,
    isError: error,
  };
}

// Hook lấy toàn bộ user cho selection, dùng SWR
export function useAllUsers() {
  const { data, isLoading, error } = useSWR("all-users", fetchAllUsers);
  return {
    allUsers: data || [],
    loading: isLoading,
    error,
  };
} 

export function useImportEmployees() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const importEmployees = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await importEmployeesService(file);
      if (data.success) {
        setSuccess(data.message || 'Import thành công');
      } else {
        setError(data.message || 'Import thất bại');
      }
      return data;
    } catch (err: any) {
      setError(err?.message || 'Không thể kết nối đến máy chủ.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { importEmployees, loading, error, success };
}

export function useDownloadTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { hideLoading } = useLoading();

  const downloadTemplate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const blob = await downloadEmployeeTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template-import-employees.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      // Hiển thị thông báo thành công
      toast.success('Tải template thành công!');
    } catch (error) {
      setError('Không thể tải template. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      // Tắt loading context sau khi hoàn thành
      hideLoading();
    }
  }, [hideLoading]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return { downloadTemplate, loading, error, resetError };
} 