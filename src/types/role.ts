export interface Role {
  id: number;
  name: string;
  display_name: string;
  code: string;
  description: string;
  order: number;
  employee_count: number;
  status: 'active' | 'inactive';
  createdAt: string;
  employees: RoleEmployee[];
  color: string;
}

export interface RoleEmployee {
  name: string;
  department: string;
  avatar: string;
}

export interface RoleSummary {
  totalRoles: number;
  activeRoles: number;
  inactiveRoles: number;
  totalEmployees: number;
  highestRole: string;
}

export interface CreateRoleData {
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface UpdateRoleData extends Partial<CreateRoleData> {
  id: number;
} 