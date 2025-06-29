"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, UserCheck, UserX, Users, ChevronLeft, ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import { useEmployees } from "@/hooks/useEmployees"
import { useDepartments, useDepartmentsListSelect } from "@/hooks/useDepartments"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { GENDERS } from "@/constants/options"
import { formatVND } from "@/lib/utils"
import ConfirmDeleteModal from "../shared/confirm-delete-modal"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRolesSelection } from "@/hooks/useRole"
const EmployeeTable = dynamic(() => import("./EmployeeTable"), { ssr: false })

const AddEmployeeModal = dynamic(() => import("./add-employee-modal"), { ssr: false })
const EmployeeDetailModal = dynamic(() => import("./employee-detail-modal"), { ssr: false })

export default function EmployeeManagement() {
  const {
    employees,
    summary,
    loading,
    summaryLoading,
    pagination,
    filters,
    addEmployee,
    updateEmployeeById,
    removeEmployee,
    getEmployeeDetail,
    applyFilters,
    changePage,
    clearFilters,
  } = useEmployees()
  const { data: departments, isLoading: departmentsLoading } = useDepartmentsListSelect()
  const { data: roles, isLoading: rolesLoading } = useRolesSelection()

  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null)

  // Apply filters when search/filter values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newFilters: any = {}
      
      if (searchTerm) {
        newFilters.search = searchTerm
      }
      if (departmentFilter) {
        if (departmentFilter === "all") { 
          newFilters.departmentId = null
        } else {
          newFilters.departmentId = parseInt(departmentFilter)
        }
      }
      if (roleFilter) {
        if (roleFilter === "all") {
          newFilters.roleName = null
        } else {
          newFilters.roleName = roleFilter
        }
      }
      if (statusFilter) {
        if (statusFilter === "all") {
          newFilters.status = null
        } else {
          newFilters.status = statusFilter
        }
      }
      
      applyFilters(newFilters)
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, departmentFilter, roleFilter, statusFilter, applyFilters])

  const handleAddEmployee = async (newEmployee: any) => {
    await addEmployee(newEmployee)
    setIsAddModalOpen(false)
  }

  const handleEditEmployee = async (updatedEmployee: any) => {
    // The hook needs id and the rest of the data
    const { id, ...dataToUpdate } = updatedEmployee
    await updateEmployeeById(id, dataToUpdate)
    setIsAddModalOpen(false)
  }

  const handleDeleteRequest = (id: number) => {
    setEmployeeToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return
    try {
      await removeEmployee(employeeToDelete)
      toast.success("Xóa nhân viên thành công!")
    } catch (error) {
      // Error is handled in the hook, but we can show a generic message
      toast.error("Xóa nhân viên thất bại. Vui lòng thử lại.")
    } finally {
      setIsDeleteModalOpen(false)
      setEmployeeToDelete(null)
    }
  }

  const handleViewDetail = async (employee: any) => {
    try {
      const detailedEmployee = await getEmployeeDetail(employee.id)
      setSelectedEmployee(detailedEmployee)
      setIsDetailModalOpen(true)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee)
    setIsAddModalOpen(true)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setDepartmentFilter("")
    setRoleFilter("")
    setStatusFilter("")
    clearFilters()
  }

  const handlePageChange = (page: number) => {
    changePage(page)
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Nhân viên</h1>
          <p className="text-gray-600">Quản lý thông tin nhân viên trong tổ chức</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">Tất cả nhân viên</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang làm việc</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary?.activeEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">Nhân viên hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm nghỉ</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary?.inactiveEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">Nhân viên tạm nghỉ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lương TB</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate" title={formatVND((summary?.averageSalary || 0).toString())}>{formatVND((summary?.averageSalary || 0).toString())}</div>
            <p className="text-xs text-muted-foreground">VNĐ/tháng</p>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng ban</SelectItem>
                {departments &&
                  departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      <span className="truncate" title={dept.name}>{dept.name}</span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn chức vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chức vụ</SelectItem>
                {roles &&
                  roles.map((role: any) => (
                    <SelectItem key={role.id} value={role.name}>
                      <span className="truncate" title={role.displayName}>{role.displayName}</span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang làm việc</SelectItem>
                <SelectItem value="inactive">Tạm nghỉ</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleClearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bảng danh sách nhân viên */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription>
            Hiển thị {employees.length} trên {pagination.totalItems} nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhân viên</h3>
              <p className="text-gray-500">Không có nhân viên nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            <>
              <EmployeeTable
                employees={employees}
                loading={loading}
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
      <AddEmployeeModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddEmployee={editingEmployee ? handleEditEmployee : handleAddEmployee}
        editingEmployee={editingEmployee}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingEmployee(null)
        }}
        departments={departments || []}
        roles={roles || []}
        genders={GENDERS}
      />
      {selectedEmployee && (
        <EmployeeDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          employee={selectedEmployee}
        />
      )}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa nhân viên"
        description="Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn dữ liệu của nhân viên."
      />
    </div>
  )
}
