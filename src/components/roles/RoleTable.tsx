"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Crown,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  GripVertical,
  Shield,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Role } from "@/types/role"

interface RoleTableProps {
  roles: Role[]
  loading: boolean
  onViewDetail: (role: Role) => void
  onEdit: (role: Role) => void
  onDelete: (id: number) => void
  onManagePermissions: (role: Role) => void
  onDragStart: (e: React.DragEvent, role: Role) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, role: Role) => void
  onDragEnd: () => void
  draggedItem: Role | null
}

export default function RoleTable({
  roles,
  loading,
  onViewDetail,
  onEdit,
  onDelete,
  onManagePermissions,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedItem,
}: RoleTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Crown className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy vai trò</h3>
        <p className="text-gray-500">Không có vai trò nào phù hợp với bộ lọc hiện tại.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead className="w-16">Thứ tự</TableHead>
          <TableHead>Tên vai trò</TableHead>
          <TableHead>Mã</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead className="w-24">Nhân viên</TableHead>
          <TableHead className="w-24">Trạng thái</TableHead>
          <TableHead className="w-24">Ngày tạo</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow
            key={role.id}
            draggable
            onDragStart={(e) => onDragStart(e, role)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, role)}
            onDragEnd={onDragEnd}
            className={`cursor-move hover:bg-gray-50 ${draggedItem?.id === role.id ? "opacity-50" : ""}`}
          >
            <TableCell>
              <GripVertical className="h-4 w-4 text-gray-400" />
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Badge
                  variant={role.order <= 1 ? "default" : role.order <= 2 ? "secondary" : "outline"}
                  className={`bg-${role?.color}-100 text-${role?.color}-800 hover:bg-${role?.color}-100`}
                >
                  #{role.order}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {role.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{role.display_name}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="font-mono">
                {role.code}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="max-w-xs truncate" title={role.description}>
                {role.description}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{role.employee_count}</span>
                {role.employee_count > 0 && (
                  <div className="flex -space-x-1">
                    {role.employees.slice(0, 3).map((employee: any, index: number) => (
                      <Avatar key={index} className="h-6 w-6 border-2 border-white">
                        <AvatarFallback className="text-xs">
                          {employee.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {role.employee_count > 3 && (
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white">
                        +{role.employee_count - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={role.status === "active" ? "default" : "secondary"}>
                {role.status === "active" ? "Hoạt động" : "Tạm dừng"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="text-sm text-gray-500">{role.createdAt}</div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetail(role)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(role)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onManagePermissions(role)}>
                    <Shield className="mr-2 h-4 w-4" />
                    Cấp quyền
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(role.id)}
                    className="text-red-600"
                    disabled={role.employee_count > 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 