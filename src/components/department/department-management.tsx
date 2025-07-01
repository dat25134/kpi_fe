"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Plus, Search, Users, ChevronLeft, ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
const AddDepartmentModal = dynamic(() => import("./add-department-modal"), { ssr: false })
const DepartmentDetailModal = dynamic(() => import("./department-detail-modal"), { ssr: false })
import { useState, useEffect } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useSWRConfig } from "swr"
import { deleteDepartment } from "@/services/department"
import ConfirmDeleteModal from "../shared/confirm-delete-modal"
import { toast } from "sonner"
import { useDepartments, useDepartmentSummary } from "@/hooks/useDepartments"
import { getErrorMessage } from "@/services/errorHandler"
const DepartmentTable = dynamic(() => import("./DepartmentTable"), { ssr: false })

export default function DepartmentManagement() {
  const { mutate } = useSWRConfig()
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null)

  // Tạo filters object
  const filters = {
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
  }

  const { data: departments = [], pagination, isLoading: loadingDepartments } = useDepartments(filters);
  const { data: summary, isLoading: loadingSummary } = useDepartmentSummary();
  const isLoading = loadingDepartments || loadingSummary;

  // Khi bấm nút tìm kiếm
  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddDepartment = (newDepartment: any) => {
    // Không cần thêm thủ công vì SWR sẽ tự động cập nhật
    // sau khi gọi mutate
    mutate((key) => Array.isArray(key) && key[0] === "departments");
    mutate("departments-summary")
  }

  const handleEditDepartment = () => {
    mutate((key) => Array.isArray(key) && key[0] === "departments");
    mutate("departments-summary");
    setEditingDepartment(null);
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
      mutate((key) => Array.isArray(key) && key[0] === "departments");
      mutate("departments-summary")
    } catch (error) {
      console.error("Failed to delete department", error)
      toast.error(getErrorMessage(error))
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
            <div className="text-2xl font-bold">{summary?.total_employees ?? departments.reduce((total: number, dept: any) => total + (dept.employeeCount || 0), 0)}</div>
            <p className="text-xs text-muted-foreground">Trên tất cả phòng ban</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TB nhân viên/phòng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.avg_employees_per_department ?? (departments.length ? Math.round(departments.reduce((total: number, dept: any) => total + (dept.employeeCount || 0), 0) / departments.length) : 0)}</div>
            <p className="text-xs text-muted-foreground">Nhân viên</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phòng ban lớn nhất</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.largest_department?.employee_count ?? Math.max(...departments.map((dept: any) => dept.employeeCount || 0), 0)}</div>
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} className="ml-2">
          Tìm kiếm
        </Button>
      </div>

      {/* Bảng danh sách phòng ban */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng ban</CardTitle>
          <CardDescription>
            Hiển thị {departments.length} trên {pagination?.totalItems ?? departments.length} phòng ban
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingDepartments ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : departments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy phòng ban</h3>
              <p className="text-gray-500">Không có phòng ban nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            <>
              <DepartmentTable
                departments={departments}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />

              {/* Phân trang */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <span className="text-sm text-muted-foreground">
                    Trang {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
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
