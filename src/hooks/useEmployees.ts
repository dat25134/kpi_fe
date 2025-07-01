import { useState, useEffect, useCallback } from 'react';
import { 
  fetchEmployeeSummary, 
  fetchEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  fetchEmployeeDetail,
  fetchManagerEmployees
} from '@/services/employee';
import type { Employee, EmployeeSummary, EmployeeFilters, EmployeeListResponse } from '@/types/employee';
import useSWR from 'swr';
import { syncEmployeePermissions } from '@/services/permission';
import { fetchAllUsers } from '@/services/user';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [summary, setSummary] = useState<EmployeeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<Employee[]>([]);
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

  // Fetch all users
  useEffect(() => {
    const loadAllUsers = async () => {
      const data = await fetchAllUsers();
      setAllUsers(data);
    };
    loadAllUsers();
  }, []);

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
    allUsers,
    
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