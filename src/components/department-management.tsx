"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Edit, Eye, MoreHorizontal, Plus, Search, Trash2, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AddDepartmentModal from "./add-department-modal"
import DepartmentDetailModal from "./department-detail-modal"

// Dữ liệu mẫu phòng ban
const initialDepartments = [
  {
    id: 1,
    name: "Phòng Quản trị nền tảng số và VTTT",
    code: "QTNT",
    description: "Phụ trách quản trị hệ thống thông tin, phát triển ứng dụng và hạ tầng công nghệ thông tin",
    manager: {
      name: "Phạm Ngọc Vinh",
      avatar: "PNV",
      position: "Trưởng phòng",
    },
    employeeCount: 8,
    status: "active",
    createdAt: "15/01/2024",
    employees: [
      { name: "Phạm Ngọc Vinh", position: "Trưởng phòng", avatar: "PNV" },
      { name: "Phan Vinh Khang", position: "Chuyên viên", avatar: "PVK" },
      { name: "Lê Hữu Lợi", position: "Chuyên viên", avatar: "LHL" },
      { name: "Đặng Trần Như Hảo", position: "Chuyên viên", avatar: "ĐTNH" },
      { name: "Đàm Hải Đăng", position: "Chuyên viên", avatar: "ĐHĐ" },
      { name: "Võ Đức Mạnh", position: "Chuyên viên", avatar: "VĐM" },
      { name: "Đoàn Văn Lam Sơn", position: "Chuyên viên", avatar: "ĐVLS" },
      { name: "Nguyễn Thị Mai", position: "Chuyên viên", avatar: "NTM" },
    ],
  },
  {
    id: 2,
    name: "Phòng Tài chính - Kế toán",
    code: "TCKT",
    description: "Phụ trách công tác tài chính, kế toán, ngân sách và thanh toán của công ty",
    manager: {
      name: "Trần Văn Nam",
      avatar: "TVN",
      position: "Trưởng phòng",
    },
    employeeCount: 5,
    status: "active",
    createdAt: "10/01/2024",
    employees: [
      { name: "Trần Văn Nam", position: "Trưởng phòng", avatar: "TVN" },
      { name: "Nguyễn Thị Lan", position: "Phó phòng", avatar: "NTL" },
      { name: "Lê Minh Tuấn", position: "Chuyên viên", avatar: "LMT" },
      { name: "Phạm Thị Hoa", position: "Chuyên viên", avatar: "PTH" },
      { name: "Vũ Đình Khoa", position: "Chuyên viên", avatar: "VĐK" },
    ],
  },
  {
    id: 3,
    name: "Phòng Nhân sự",
    code: "NS",
    description: "Phụ trách tuyển dụng, đào tạo, phát triển nhân sự và quản lý lao động",
    manager: {
      name: "Hoàng Thị Minh",
      avatar: "HTM",
      position: "Trưởng phòng",
    },
    employeeCount: 4,
    status: "active",
    createdAt: "05/01/2024",
    employees: [
      { name: "Hoàng Thị Minh", position: "Trưởng phòng", avatar: "HTM" },
      { name: "Đỗ Văn Hùng", position: "Chuyên viên", avatar: "ĐVH" },
      { name: "Nguyễn Thị Thu", position: "Chuyên viên", avatar: "NTT" },
      { name: "Lý Văn Đức", position: "Chuyên viên", avatar: "LVĐ" },
    ],
  },
  {
    id: 4,
    name: "Phòng Kinh doanh",
    code: "KD",
    description: "Phụ trách phát triển thị trường, bán hàng và chăm sóc khách hàng",
    manager: {
      name: "Nguyễn Văn Thành",
      avatar: "NVT",
      position: "Trưởng phòng",
    },
    employeeCount: 6,
    status: "active",
    createdAt: "20/12/2023",
    employees: [
      { name: "Nguyễn Văn Thành", position: "Trưởng phòng", avatar: "NVT" },
      { name: "Trần Thị Linh", position: "Phó phòng", avatar: "TTL" },
      { name: "Phạm Văn Đạt", position: "Chuyên viên", avatar: "PVĐ" },
      { name: "Lê Thị Nga", position: "Chuyên viên", avatar: "LTN" },
      { name: "Vũ Minh Quang", position: "Chuyên viên", avatar: "VMQ" },
      { name: "Đặng Thị Hương", position: "Chuyên viên", avatar: "ĐTH" },
    ],
  },
]

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState(initialDepartments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDepartment = (newDepartment: any) => {
    const department = {
      ...newDepartment,
      id: Math.floor(Math.random() * 1000),
      employeeCount: 0,
      status: "active",
      createdAt: new Date().toLocaleDateString("vi-VN"),
      employees: [],
    }
    setDepartments([...departments, department])
  }

  const handleEditDepartment = (updatedDepartment: any) => {
    setDepartments(
      departments.map((dept) => (dept.id === updatedDepartment.id ? { ...dept, ...updatedDepartment } : dept)),
    )
    setEditingDepartment(null)
  }

  const handleDeleteDepartment = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) {
      setDepartments(departments.filter((dept) => dept.id !== id))
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
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.reduce((total, dept) => total + dept.employeeCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Trên tất cả phòng ban</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TB nhân viên/phòng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(departments.reduce((total, dept) => total + dept.employeeCount, 0) / departments.length)}
            </div>
            <p className="text-xs text-muted-foreground">Nhân viên</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phòng ban lớn nhất</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...departments.map((dept) => dept.employeeCount))}</div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên phòng ban</TableHead>
                <TableHead>Mã phòng</TableHead>
                <TableHead>Trưởng phòng</TableHead>
                <TableHead className="text-center">Số nhân viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{department.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{department.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{department.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-blue-100 text-blue-900 text-xs">
                          {department.manager.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{department.manager.name}</div>
                        <div className="text-xs text-gray-500">{department.manager.position}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{department.employeeCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        department.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {department.status === "active" ? "Hoạt động" : "Tạm dừng"}
                    </Badge>
                  </TableCell>
                  <TableCell>{department.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetail(department)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(department)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteDepartment(department.id)}
                          className="text-red-600"
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
        </CardContent>
      </Card>

      {/* Modals */}
      <AddDepartmentModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddDepartment={editingDepartment ? handleEditDepartment : handleAddDepartment}
        editingDepartment={editingDepartment}
        onClose={() => setEditingDepartment(null)}
      />

      <DepartmentDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        department={selectedDepartment}
      />
    </div>
  )
}
