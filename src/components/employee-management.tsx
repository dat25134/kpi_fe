"use client"

import { useState } from "react"
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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AddEmployeeModal from "./add-employee-modal"
import EmployeeDetailModal from "./employee-detail-modal"

// Dữ liệu mẫu nhân viên
const initialEmployees = [
  {
    id: 1,
    name: "Phạm Ngọc Vinh",
    avatar: "PNV",
    email: "pham.ngoc.vinh@company.com",
    phone: "+84 123 456 789",
    position: "Trưởng phòng",
    department: {
      id: 1,
      name: "Phòng Quản trị nền tảng số và VTTT",
      code: "QTNT",
    },
    status: "active",
    joinDate: "15/01/2020",
    salary: 25000000,
    address: "123 Đường ABC, Quận 1, TP.HCM",
    birthDate: "15/05/1985",
    gender: "Nam",
    education: "Thạc sĩ Công nghệ thông tin",
    experience: "8 năm",
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    projects: [
      { name: "Hệ thống KPI", role: "Project Manager", status: "Đang thực hiện" },
      { name: "Ứng dụng Tây Ninh Smart", role: "Tech Lead", status: "Hoàn thành" },
    ],
  },
  {
    id: 2,
    name: "Phan Vinh Khang",
    avatar: "PVK",
    email: "phan.vinh.khang@company.com",
    phone: "+84 987 654 321",
    position: "Chuyên viên",
    department: {
      id: 1,
      name: "Phòng Quản trị nền tảng số và VTTT",
      code: "QTNT",
    },
    status: "active",
    joinDate: "10/03/2021",
    salary: 18000000,
    address: "456 Đường DEF, Quận 3, TP.HCM",
    birthDate: "20/08/1992",
    gender: "Nam",
    education: "Cử nhân Công nghệ thông tin",
    experience: "4 năm",
    skills: ["Vue.js", "Laravel", "MySQL", "Docker"],
    projects: [
      { name: "Website công ty", role: "Frontend Developer", status: "Hoàn thành" },
      { name: "Hệ thống CRM", role: "Full-stack Developer", status: "Đang thực hiện" },
    ],
  },
  {
    id: 3,
    name: "Lê Hữu Lợi",
    avatar: "LHL",
    email: "le.huu.loi@company.com",
    phone: "+84 555 123 456",
    position: "Chuyên viên",
    department: {
      id: 1,
      name: "Phòng Quản trị nền tảng số và VTTT",
      code: "QTNT",
    },
    status: "active",
    joinDate: "05/07/2022",
    salary: 16000000,
    address: "789 Đường GHI, Quận 7, TP.HCM",
    birthDate: "12/12/1994",
    gender: "Nam",
    education: "Cử nhân Khoa học máy tính",
    experience: "3 năm",
    skills: ["Python", "Django", "PostgreSQL", "Redis"],
    projects: [{ name: "API Gateway", role: "Backend Developer", status: "Đang thực hiện" }],
  },
  {
    id: 4,
    name: "Đặng Trần Như Hảo",
    avatar: "ĐTNH",
    email: "dang.tran.nhu.hao@company.com",
    phone: "+84 777 888 999",
    position: "Chuyên viên",
    department: {
      id: 1,
      name: "Phòng Quản trị nền tảng số và VTTT",
      code: "QTNT",
    },
    status: "active",
    joinDate: "20/11/2021",
    salary: 17000000,
    address: "321 Đường JKL, Quận 5, TP.HCM",
    birthDate: "08/03/1993",
    gender: "Nữ",
    education: "Cử nhân Hệ thống thông tin",
    experience: "3.5 năm",
    skills: ["Angular", "Spring Boot", "Oracle", "Jenkins"],
    projects: [{ name: "Hệ thống báo cáo", role: "Frontend Developer", status: "Hoàn thành" }],
  },
  {
    id: 5,
    name: "Trần Văn Nam",
    avatar: "TVN",
    email: "tran.van.nam@company.com",
    phone: "+84 333 444 555",
    position: "Trưởng phòng",
    department: {
      id: 2,
      name: "Phòng Tài chính - Kế toán",
      code: "TCKT",
    },
    status: "active",
    joinDate: "01/01/2019",
    salary: 28000000,
    address: "654 Đường MNO, Quận 2, TP.HCM",
    birthDate: "25/07/1980",
    gender: "Nam",
    education: "Thạc sĩ Tài chính - Ngân hàng",
    experience: "12 năm",
    skills: ["Excel", "SAP", "Financial Analysis", "Budgeting"],
    projects: [{ name: "Hệ thống ERP", role: "Business Analyst", status: "Đang thực hiện" }],
  },
  {
    id: 6,
    name: "Hoàng Thị Minh",
    avatar: "HTM",
    email: "hoang.thi.minh@company.com",
    phone: "+84 666 777 888",
    position: "Trưởng phòng",
    department: {
      id: 3,
      name: "Phòng Nhân sự",
      code: "NS",
    },
    status: "active",
    joinDate: "15/06/2018",
    salary: 26000000,
    address: "987 Đường PQR, Quận 4, TP.HCM",
    birthDate: "10/11/1982",
    gender: "Nữ",
    education: "Thạc sĩ Quản trị nhân lực",
    experience: "10 năm",
    skills: ["HR Management", "Recruitment", "Training", "Performance Management"],
    projects: [{ name: "Hệ thống quản lý nhân sự", role: "Product Owner", status: "Hoàn thành" }],
  },
]

// Danh sách phòng ban
const departments = [
  { id: 1, name: "Phòng Quản trị nền tảng số và VTTT", code: "QTNT" },
  { id: 2, name: "Phòng Tài chính - Kế toán", code: "TCKT" },
  { id: 3, name: "Phòng Nhân sự", code: "NS" },
  { id: 4, name: "Phòng Kinh doanh", code: "KD" },
]

// Danh sách chức vụ
const positions = ["Trưởng phòng", "Phó phòng", "Chuyên viên", "Nhân viên"]

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [positionFilter, setPositionFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm)
    const matchesDepartment = !departmentFilter || emp.department.id.toString() === departmentFilter
    const matchesPosition = !positionFilter || emp.position === positionFilter
    const matchesStatus = !statusFilter || emp.status === statusFilter

    return matchesSearch && matchesDepartment && matchesPosition && matchesStatus
  })

  const handleAddEmployee = (newEmployee: any) => {
    const employee = {
      ...newEmployee,
      id: Math.floor(Math.random() * 1000),
      joinDate: new Date().toLocaleDateString("vi-VN"),
      projects: [],
    }
    setEmployees([...employees, employee])
  }

  const handleEditEmployee = (updatedEmployee: any) => {
    setEmployees(employees.map((emp) => (emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp)))
    setEditingEmployee(null)
  }

  const handleDeleteEmployee = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      setEmployees(employees.filter((emp) => emp.id !== id))
    }
  }

  const handleViewDetail = (employee: any) => {
    setSelectedEmployee(employee)
    setIsDetailModalOpen(true)
  }

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee)
    setIsAddModalOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setDepartmentFilter("")
    setPositionFilter("")
    setStatusFilter("")
  }

  // Thống kê
  const totalEmployees = employees.length
  const activeEmployees = employees.filter((emp) => emp.status === "active").length
  const inactiveEmployees = employees.filter((emp) => emp.status === "inactive").length
  const averageSalary = Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length)

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
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Tất cả nhân viên</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang làm việc</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground">Nhân viên hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm nghỉ</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveEmployees}</div>
            <p className="text-xs text-muted-foreground">Nhân viên tạm nghỉ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lương TB</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageSalary.toLocaleString()}</div>
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
                {departments.map((dept) => (
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
                {positions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
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
            <Button variant="outline" onClick={clearFilters}>
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
            Hiển thị {filteredEmployees.length} trên {employees.length} nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {filteredEmployees.map((employee) => (
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
        </CardContent>
      </Card>

      {/* Modals */}
      <AddEmployeeModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddEmployee={editingEmployee ? handleEditEmployee : handleAddEmployee}
        editingEmployee={editingEmployee}
        onClose={() => setEditingEmployee(null)}
        departments={departments}
        positions={positions}
      />

      <EmployeeDetailModal open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} employee={selectedEmployee} />
    </div>
  )
}
