import apiClient from "./apiClient";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import { getAuthToken } from "./auth";
import { handleApiError } from "./errorHandler";
import { isAxiosError } from "axios";
import type { Role, RoleSummary, CreateRoleData, UpdateRoleData } from '@/types/role';

const getConfig = () => {
  const token = getAuthToken();
  return {
    ...API_CONFIG,
    headers: {
      ...API_CONFIG.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
}

/**
 * Lấy danh sách vai trò cho select
 */
export async function fetchRolesSelection() {
  const response = await apiClient.get(API_ENDPOINTS.ROLES.SELECTION, getConfig());
  return response.data.data;
}

/**
 * Lấy thống kê tổng quan về vai trò
 */
export async function fetchRoleSummary(): Promise<RoleSummary> {
  const response = await apiClient.get(API_ENDPOINTS.ROLES.SUMMARY, getConfig());
  return response.data.data;
}

/**
 * Lấy danh sách vai trò
 */
export async function fetchRoles(): Promise<{ roles: Role[] }> {
  const response = await apiClient.get(API_ENDPOINTS.ROLES.LIST, getConfig());
  return { roles: response.data.data };
}

/**
 * Tạo vai trò mới
 */
export async function createRole(roleData: CreateRoleData): Promise<Role> {
  const response = await apiClient.post(API_ENDPOINTS.ROLES.CREATE, roleData, getConfig());
  return response.data.data;
}

/**
 * Cập nhật thông tin vai trò
 */
export async function updateRole(id: number, roleData: Partial<CreateRoleData>): Promise<Role> {
  const response = await apiClient.put(API_ENDPOINTS.ROLES.UPDATE(id), roleData, getConfig());
  return response.data.data;
}

/**
 * Xóa vai trò
 */
export async function deleteRole(id: number): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.ROLES.DELETE(id), getConfig());
}

/**
 * Lấy chi tiết vai trò
 */
export async function fetchRoleDetail(id: number): Promise<Role> {
  const response = await apiClient.get(API_ENDPOINTS.ROLES.DETAIL(id), getConfig());
  return response.data.data;
}

/**
 * Cập nhật thứ tự vai trò
 */
export async function updateRoleOrder(roleIds: number[]): Promise<void> {
  await apiClient.put(API_ENDPOINTS.ROLES.REORDER, { roleIds }, getConfig());
}