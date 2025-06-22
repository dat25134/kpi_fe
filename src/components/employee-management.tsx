"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Filter,
  Mail,
  Phone,
  Building2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AddEmployeeModal from "./add-employee-modal"
import EmployeeDetailModal from "./employee-detail-modal"
import { useEmployees } from "@/hooks/useEmployees"
import { useDepartments } from "@/hooks/useDepartments"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { POSITIONS, GENDERS } from "@/constants/options"

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
  const { data: departments, isLoading: departmentsLoading } = useDepartments()

  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [positionFilter, setPositionFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)

  // Apply filters when search/filter values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newFilters: any = {}
      
      if (searchTerm) {
        newFilters.search = searchTerm
      }
      if (departmentFilter && departmentFilter !== "all") {
        newFilters.departmentId = parseInt(departmentFilter)
      }
      if (positionFilter && positionFilter !== "all") {
        newFilters.position = positionFilter
      }
      if (statusFilter && statusFilter !== "all") {
        newFilters.status = statusFilter
      }
      
      applyFilters(newFilters)
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, departmentFilter, positionFilter, statusFilter, applyFilters])

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

  const handleDeleteEmployee = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await removeEmployee(id)
      } catch (error) {
        // Error handling is done in the hook
      }
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
    setPositionFilter("")
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
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(summary?.averageSalary || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">VNĐ/tháng</p>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng ban</SelectItem>
                {departments &&
                  departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chức vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chức vụ</SelectItem>
                {POSITIONS.map((position) => (
                  <SelectItem key={position.key} value={position.key}>
                    {position.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead>Chức vụ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày vào</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-900 text-sm">{employee.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-gray-500">ID: {employee.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {employee.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {employee.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{employee.department.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {employee.department.code}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            employee.position === "Trưởng phòng"
                              ? "default"
                              : employee.position === "Phó phòng"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {employee.position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            employee.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {employee.status === "active" ? "Đang làm việc" : "Tạm nghỉ"}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.joinDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetail(employee)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(employee)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteEmployee(employee.id)} className="text-red-600">
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Trang {pagination.currentPage} của {pagination.totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage >= pagination.totalPages}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
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
        onClose={() => setEditingEmployee(null)}
        departments={departments || []}
        positions={POSITIONS}
        genders={GENDERS}
      />

      <EmployeeDetailModal open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} employee={selectedEmployee} />
    </div>
  )
}
