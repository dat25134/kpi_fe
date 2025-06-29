import useSWR, { mutate } from "swr";
import { API_ENDPOINTS } from "@/config/api";
import {
  fetchRoles,
  fetchRolesSelection,
  fetchRoleSummary,
  createRole,
  updateRole,
  deleteRole,
  updateRoleOrder,
  fetchRoleDetail
} from "@/services/role";
import type { CreateRoleData, UpdateRoleData } from "@/types/role";

export function useRolesSelection() {
  const { data, error, isLoading } = useSWR(API_ENDPOINTS.ROLES.SELECTION, fetchRolesSelection);
  return { data, error, isLoading };
}

export function useRoleSummary() {
  const { data, error, isLoading } = useSWR(API_ENDPOINTS.ROLES.SUMMARY, fetchRoleSummary);
  return { data, error, isLoading };
}

export function useRole() {
  const { data, error, isLoading } = useSWR(API_ENDPOINTS.ROLES.LIST, fetchRoles);

  // Thêm vai trò
  const addRole = async (roleData: CreateRoleData) => {
    await createRole(roleData);
    mutate(API_ENDPOINTS.ROLES.LIST);
  };

  // Sửa vai trò
  const editRole = async (id: number, data: UpdateRoleData) => {
    await updateRole(id, data);
    mutate(API_ENDPOINTS.ROLES.LIST);
  };

  // Xóa vai trò
  const removeRole = async (id: number) => {
    await deleteRole(id);
    mutate(API_ENDPOINTS.ROLES.LIST);
  };

  // Sắp xếp lại vai trò
  const reorder = async (roleIds: number[]) => {
    await updateRoleOrder(roleIds);
    mutate(API_ENDPOINTS.ROLES.LIST);
  };

  // Lấy chi tiết vai trò
  const getRoleDetail = async (id: number) => {
    return await fetchRoleDetail(id);
  };

  return {
    data,
    error,
    isLoading,
    addRole,
    editRole,
    removeRole,
    reorder,
    getRoleDetail,
  };
}
