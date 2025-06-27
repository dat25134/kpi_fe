"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Plus, Search, Users } from "lucide-react"
import dynamic from "next/dynamic"
const AddDepartmentModal = dynamic(() => import("./add-department-modal"), { ssr: false })
const DepartmentDetailModal = dynamic(() => import("./department-detail-modal"), { ssr: false })
import { useState } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useSWRConfig } from "swr"
import { deleteDepartment } from "@/services/department"
import ConfirmDeleteModal from "../shared/confirm-delete-modal"
import { toast } from "sonner"
const DepartmentTable = dynamic(() => import("./DepartmentTable"), { ssr: false })

export default function DepartmentManagement({ departments, summary, isLoading }: { departments: any[], summary: any, isLoading: boolean }) {
  const { mutate } = useSWRConfig()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null)

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDepartment = (newDepartment: any) => {
    // Không cần thêm thủ công vì SWR sẽ tự động cập nhật
    // sau khi gọi mutate
    mutate("departments")
    mutate("departments-summary")
  }

  const handleEditDepartment = () => {
    mutate("departments")
    mutate("departments-summary")
    setEditingDepartment(null)
  }

  const handleDeleteRequest = (id: number) => {
    setDepartmentToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return
    try {
      await deleteDepartment(departmentToDelete)
      toast.success("Xóa phòng ban thành công!")
      mutate("departments")
      mutate("departments-summary")
    } catch (error) {
      console.error("Failed to delete department", error)
      toast.error("Xóa phòng ban thất bại. Vui lòng thử lại.")
    } finally {
      setIsDeleteModalOpen(false)
      setDepartmentToDelete(null)
    }
  }

  const handleViewDetail = (department: any) => {
    setSelectedDepartment(department)
    setIsDetailModalOpen(true)
  }

  const handleEdit = (department: any) => {
    setEditingDepartment(department)
    setIsAddModalOpen(true)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phòng ban</h1>
          <p className="text-gray-600">Quản lý thông tin các phòng ban trong tổ chức</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm phòng ban
        </Button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng phòng ban</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_departments ?? departments.length}</div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_employees ?? departments.reduce((total, dept) => total + (dept.employeeCount || 0), 0)}</div>
            <p className="text-xs text-muted-foreground">Trên tất cả phòng ban</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TB nhân viên/phòng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.avg_employees_per_department ?? (departments.length ? Math.round(departments.reduce((total, dept) => total + (dept.employeeCount || 0), 0) / departments.length) : 0)}</div>
            <p className="text-xs text-muted-foreground">Nhân viên</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phòng ban lớn nhất</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.largest_department?.employee_count ?? Math.max(...departments.map((dept) => dept.employeeCount || 0), 0)}</div>
            <p className="text-xs text-muted-foreground">Nhân viên</p>
          </CardContent>
        </Card>
      </div>

      {/* Tìm kiếm */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Bảng danh sách phòng ban */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng ban</CardTitle>
          <CardDescription>
            Hiển thị {filteredDepartments.length} trên {departments.length} phòng ban
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DepartmentTable
            departments={filteredDepartments}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <AddDepartmentModal
        open={isAddModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingDepartment(null)
          }
          setIsAddModalOpen(isOpen)
        }}
        onClose={() => setIsAddModalOpen(false)}
        onAddDepartment={handleAddDepartment}
        onEditDepartment={handleEditDepartment}
        editingDepartment={editingDepartment}
      />

      <DepartmentDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        department={selectedDepartment}
      />

      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa phòng ban"
        description="Bạn có chắc chắn muốn xóa phòng ban này không? Hành động này không thể được hoàn tác."
      />
    </div>
  )
}
