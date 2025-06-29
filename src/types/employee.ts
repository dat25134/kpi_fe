export interface Employee {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: {
    id: number;
    name: string;
    displayName: string;
    color: string;
  };
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
  gender: 'male' | 'female' | 'other';
  education: string;
  experience: string;
  skills: string[];
  projects: Array<{
    name: string;
    role: string;
    status: string;
  }>;
}

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
  roleStats: Array<{
    roleId: number;
    roleName: string;
    count: number;
  }>;
}

export interface EmployeeListResponse {
  employees: Employee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface EmployeeFilters {
  search?: string;
  departmentId?: number;
  roleName?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
} 