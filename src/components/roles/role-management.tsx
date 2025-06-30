"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Crown, Building, Users, UserCheck } from "lucide-react"
import { useRole, useRoleSummary } from "@/hooks/useRole"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ConfirmDeleteModal from "../shared/confirm-delete-modal"
import { toast } from "sonner"
import type { Role } from "@/types/role"
import dynamic from "next/dynamic"
import { useSyncPermissions } from "@/hooks/usePermission"
import { syncPermissions } from "@/services/permission"
import { mutate } from "swr"
import { API_ENDPOINTS } from "@/config/api"

const RoleTable = dynamic(() => import("./RoleTable"), { ssr: false })
const AddRoleModal = dynamic(() => import("./add-role-modal"), { ssr: false })
const RoleDetailModal = dynamic(() => import("./role-detail-modal"), { ssr: false })
const PermissionModal = dynamic(() => import("./permission-modal"), { ssr: false })

export default function RoleManagement() {
  const { data: rolesRaw = [], error, isLoading, addRole, editRole, removeRole, reorder, getRoleDetail } = useRole();
  const roles: Role[] = Array.isArray(rolesRaw) ? rolesRaw : (rolesRaw.roles ?? []);
  const { data: summary, isLoading: summaryLoading } = useRoleSummary();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null)
  const [draggedItem, setDraggedItem] = useState<Role | null>(null)
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)

  const handleAddRole = async (newRole: any) => {
    try {
      await addRole(newRole)
      setIsAddModalOpen(false)
      toast.success("Thêm vai trò thành công!")
    } catch (error) {
      toast.error("Thêm vai trò thất bại. Vui lòng thử lại.")
    }
  }

  const handleManagePermissions = (role: any) => {
    setSelectedRole(role)
    setIsPermissionModalOpen(true)
  }

  const handleUpdatePermissions = async (roleId: number, permission_ids: number[]) => {
    try {
      await syncPermissions(roleId, permission_ids)
      mutate(API_ENDPOINTS.ROLES.LIST)
      setIsPermissionModalOpen(false)
      toast.success("Cập nhật quyền hạn thành công!")
    } catch (error) {
      toast.error("Cập nhật quyền hạn thất bại. Vui lòng thử lại.")
    }
  }

  const handleEditRole = async (updatedRole: any) => {
    try {   
    const { id, ...dataToUpdate } = updatedRole
    await editRole(id, dataToUpdate)
    setIsAddModalOpen(false)
    toast.success("Cập nhật vai trò thành công!")
    } catch (error) {
      toast.error("Cập nhật vai trò thất bại. Vui lòng thử lại.")
    }
  }

  const handleDeleteRequest = (id: number) => {
    const role = roles.find((r: any) => r.id === id)
    if (role && role.employee_count > 0) {
      toast.error("Không thể xóa vai trò đang có nhân viên!")
      return
    }
    setRoleToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return
    try {
      await removeRole(roleToDelete)
      toast.success("Xóa vai trò thành công!")
    } catch (error) {
      toast.error("Xóa vai trò thất bại. Vui lòng thử lại.")
    } finally {
      setIsDeleteModalOpen(false)
      setRoleToDelete(null)
    }
  }

  const handleViewDetail = async (role: Role) => {
    try {
      const detailedRole = await getRoleDetail(role.id)
      if (detailedRole) {
        setSelectedRole(detailedRole)
        setIsDetailModalOpen(true)
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setIsAddModalOpen(true)
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, role: Role) => {
    setDraggedItem(role)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, targetRole: Role) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.id === targetRole.id) {
      setDraggedItem(null)
      return
    }

    const newRoles = [...roles]
    const draggedIndex = newRoles.findIndex((r: any) => r.id === draggedItem.id)
    const targetIndex = newRoles.findIndex((r: any) => r.id === targetRole.id)

    // Remove dragged item
    const [removed] = newRoles.splice(draggedIndex, 1)

    // Insert at target position
    newRoles.splice(targetIndex, 0, removed)

    // Update order values
    const updatedRoles = newRoles.map((role: any, index: number) => ({
      ...role,
      order: index + 1,
    }))

    // Send to API
    try {
      await reorder(updatedRoles.map((r: any) => r.id))
      toast.success("Cập nhật thứ tự vai trò thành công!")
    } catch (error) {
      toast.error("Cập nhật thứ tự vai trò thất bại!")
    }

    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  // Loading states
  if (summaryLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Vai trò</h1>
          <p className="text-gray-600">Quản lý các vai trò và cấp bậc trong tổ chức</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm vai trò
        </Button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng vai trò</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalRoles || 0}</div>
            <p className="text-xs text-muted-foreground">Trong hệ thống</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.activeRoles || 0}</div>
            <p className="text-xs text-muted-foreground">Vai trò hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">Nhân viên có vai trò</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vai trò cao nhất</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate" title={summary?.highestRole || "Chưa có"}>
              {summary?.highestRole || "Chưa có"}
            </div>
            <p className="text-xs text-muted-foreground">Cấp bậc cao nhất</p>
          </CardContent>
        </Card>
      </div>

      {/* Bảng danh sách vai trò */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách vai trò</CardTitle>
          <CardDescription>
            Hiển thị {roles.length} vai trò trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleTable
            roles={roles}
            loading={isLoading}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            onManagePermissions={handleManagePermissions}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            draggedItem={draggedItem}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <AddRoleModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddRole={editingRole ? handleEditRole : handleAddRole}
        editingRole={editingRole}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingRole(null)
        }}
      />
      {selectedRole && (
        <RoleDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          role={selectedRole}
        />
      )}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa vai trò"
        description="Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn dữ liệu của vai trò."
      />

      <PermissionModal
        open={isPermissionModalOpen}
        onOpenChange={setIsPermissionModalOpen}
        role={selectedRole}
        onUpdatePermissions={handleUpdatePermissions}
      />
    </div>
  )
}
