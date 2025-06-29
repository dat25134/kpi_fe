import { useState, useEffect, useCallback } from 'react';
import { 
  fetchEmployeeSummary, 
  fetchEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  fetchEmployeeDetail,
  ValidationError,
  fetchManagerEmployees
} from '@/services/employee';
import type { Employee, EmployeeSummary, EmployeeFilters, EmployeeListResponse } from '@/types/employee';
import { toast } from 'sonner';
import useSWR from 'swr';

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
    try {
      setSummaryLoading(true);
      const data = await fetchEmployeeSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error loading employee summary:', error);
      toast.error('Không thể tải thống kê nhân viên');
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Effect to fetch employees whenever filters change
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const response: EmployeeListResponse = await fetchEmployees(filters);
        setEmployees(response.employees);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Error loading employees:', error);
        toast.error('Không thể tải danh sách nhân viên');
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, [JSON.stringify(filters), refetchIndex]);

  // Add new employee
  const addEmployee = useCallback(async (employeeData: Omit<Employee, 'id' | 'joinDate' | 'projects'>) => {
    try {
      setLoading(true);
      const newEmployee = await createEmployee(employeeData);
      loadSummary();
      refetch();
      toast.success('Thêm nhân viên thành công');
      return newEmployee;
    } catch (error) {
      console.error('Error adding employee:', error);
      if (!(error instanceof ValidationError)) {
        toast.error('Không thể thêm nhân viên');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadSummary]);

  // Update employee
  const updateEmployeeById = useCallback(async (id: number, employeeData: Partial<Employee>) => {
    try {
      setLoading(true);
      await updateEmployee(id, employeeData);
      loadSummary();
      refetch();
      toast.success('Cập nhật nhân viên thành công');
    } catch (error) {
      console.error('Error updating employee:', error);
      if (!(error instanceof ValidationError)) {
        toast.error('Không thể cập nhật nhân viên');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadSummary]);

  // Delete employee
  const removeEmployee = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await deleteEmployee(id);
      loadSummary();
      refetch();
      toast.success('Xóa nhân viên thành công');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Không thể xóa nhân viên');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadSummary]);

  // Get employee detail
  const getEmployeeDetail = useCallback(async (id: number): Promise<Employee | null> => {
    try {
      const employee = await fetchEmployeeDetail(id);
      return employee;
    } catch (error) {
      console.error('Error fetching employee detail:', error);
      toast.error('Không thể tải thông tin nhân viên');
      return null;
    }
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