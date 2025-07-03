"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  CalendarIcon,
  User,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Eye,
  Plus,
  Edit,
  Trash2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

// Types
interface ActivityLog {
  id: number
  log_name: string
  description: string
  subject_type: string
  subject_id: number
  causer_type: string | null
  causer_id: number | null
  properties: {
    attributes: any
  }
  created_at: string
  updated_at: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    logs: ActivityLog[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
    }
  }
}

interface Filters {
  search: string
  subject_type: string
  description: string
  log_name: string
  causer_id: string
  date_from: Date | undefined
  date_to: Date | undefined
  event: string
}

// Mock data based on API structure
const mockApiResponse: ApiResponse = {
  success: true,
  message: "Lấy danh sách log thành công",
  data: {
    logs: [
      {
        id: 256,
        log_name: "default",
        description: "created",
        subject_type: "App\\Models\\TaskProgress",
        subject_id: 109,
        causer_type: null,
        causer_id: null,
        properties: {
          attributes: {
            content: "Đã điều chỉnh theo yêu cầu, gửi lại cho KH review",
            task_id: 33,
            user_id: 4,
            created_at: "2025-07-02T13:14:14.000000Z",
            updated_at: "2025-06-30T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
      {
        id: 247,
        log_name: "default",
        description: "created",
        subject_type: "App\\Models\\TaskProgress",
        subject_id: 100,
        causer_type: null,
        causer_id: null,
        properties: {
          attributes: {
            content: "Nhận được phản hồi từ KH, cần điều chỉnh một số điểm",
            task_id: 31,
            user_id: 6,
            created_at: "2025-07-01T13:14:14.000000Z",
            updated_at: "2025-07-01T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
      {
        id: 50,
        log_name: "default",
        description: "created",
        subject_type: "App\\Models\\User",
        subject_id: 24,
        causer_type: null,
        causer_id: null,
        properties: {
          attributes: {
            cccd: null,
            name: "Bác. Bàng Đinh Hiếu",
            email: "tien.doi@example.net",
            phone: "066 388 4312",
            status: "active",
            password: "$2y$12$llzuZvziVt3z4yt5Bh4tWe.HWUSh7NVEzyCUPbGlHB7D47FSCJgyK",
            join_date: "2025-06-26T00:00:00.000000Z",
            employee_id: "EMP025",
            department_id: 17,
          },
        },
        created_at: "2025-07-03T13:14:09.000000Z",
        updated_at: "2025-07-03T13:14:09.000000Z",
      },
      {
        id: 248,
        log_name: "default",
        description: "updated",
        subject_type: "App\\Models\\TaskProgress",
        subject_id: 101,
        causer_type: "App\\Models\\User",
        causer_id: 20,
        properties: {
          attributes: {
            content: "Đã điều chỉnh theo yêu cầu, gửi lại cho KH review",
            task_id: 31,
            user_id: 20,
            created_at: "2025-07-02T13:14:14.000000Z",
            updated_at: "2025-06-30T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
      {
        id: 249,
        log_name: "default",
        description: "deleted",
        subject_type: "App\\Models\\TaskProgress",
        subject_id: 102,
        causer_type: "App\\Models\\User",
        causer_id: 25,
        properties: {
          attributes: {
            content: "KH đã duyệt, chuẩn bị bàn giao",
            task_id: 31,
            user_id: 25,
            created_at: "2025-07-03T13:14:14.000000Z",
            updated_at: "2025-07-02T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
      {
        id: 250,
        log_name: "default",
        description: "created",
        subject_type: "App\\Models\\TaskProgress",
        subject_id: 103,
        causer_type: "App\\Models\\User",
        causer_id: 3,
        properties: {
          attributes: {
            content: "Bắt đầu thực hiện công việc theo kế hoạch",
            task_id: 32,
            user_id: 3,
            created_at: "2025-06-28T13:14:14.000000Z",
            updated_at: "2025-06-28T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
      {
        id: 251,
        log_name: "default",
        description: "created",
        subject_type: "App\\Models\\TaskProgress",
        subject_id: 104,
        causer_type: "App\\Models\\User",
        causer_id: 29,
        properties: {
          attributes: {
            content: "Đã hoàn thành 50% công việc, đang chờ phản hồi từ khách hàng",
            task_id: 32,
            user_id: 29,
            created_at: "2025-06-29T13:14:14.000000Z",
            updated_at: "2025-06-29T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
      {
        id: 252,
        log_name: "default",
        description: "created",
        subject_type: "App\\Models\\TaskProgress",
        subject_id: 105,
        causer_type: "App\\Models\\User",
        causer_id: 16,
        properties: {
          attributes: {
            content: "KH đã duyệt, chuẩn bị bàn giao",
            task_id: 32,
            user_id: 16,
            created_at: "2025-07-03T13:14:14.000000Z",
            updated_at: "2025-07-02T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
      {
        id: 253,
        log_name: "default",
        description: "created",
        subject_type: "App\\Models\\TaskProgress",
        subject_id: 106,
        causer_type: "App\\Models\\User",
        causer_id: 30,
        properties: {
          attributes: {
            content: "Đã hoàn thành dự thảo, chờ phê duyệt",
            task_id: 32,
            user_id: 30,
            created_at: "2025-06-30T13:14:14.000000Z",
            updated_at: "2025-07-02T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
      {
        id: 254,
        log_name: "default",
        description: "created",
        subject_type: "App\\Models\\TaskProgress",
        subject_id: 107,
        causer_type: "App\\Models\\User",
        causer_id: 26,
        properties: {
          attributes: {
            content: "Cần bổ sung thêm tài liệu hỗ trợ",
            task_id: 32,
            user_id: 26,
            created_at: "2025-07-03T13:14:14.000000Z",
            updated_at: "2025-07-02T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
      {
        id: 263,
        log_name: "default",
        description: "updated",
        subject_type: "App\\Models\\TaskProgress",
        subject_id: 116,
        causer_type: "App\\Models\\User",
        causer_id: 15,
        properties: {
          attributes: {
            content: "Đã bổ sung đầy đủ tài liệu, gửi lên cấp trên",
            task_id: 34,
            user_id: 15,
            created_at: "2025-07-03T13:14:14.000000Z",
            updated_at: "2025-07-02T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
      {
        id: 255,
        log_name: "default",
        description: "created",
        subject_type: "App\\Models\\User",
        subject_id: 108,
        causer_type: null,
        causer_id: null,
        properties: {
          attributes: {
            name: "Nguyễn Văn Minh",
            email: "minh.nguyen@example.com",
            phone: "0987654321",
            status: "active",
            employee_id: "EMP108",
            department_id: 13,
            created_at: "2025-06-26T13:14:14.000000Z",
            updated_at: "2025-06-26T13:14:14.000000Z",
          },
        },
        created_at: "2025-07-03T13:14:14.000000Z",
        updated_at: "2025-07-03T13:14:14.000000Z",
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 17,
      totalItems: 322,
      itemsPerPage: 20,
    },
  },
}

// Mock users data
const mockUsers = [
  { id: 3, name: "Lê Thị Hoa", employee_id: "EMP003" },
  { id: 4, name: "Bà. Điền Hiểu Nguyệt", employee_id: "EMP005" },
  { id: 6, name: "Nguyễn Văn A", employee_id: "EMP006" },
  { id: 15, name: "Trần Văn Đức", employee_id: "EMP015" },
  { id: 16, name: "Phạm Thị Lan", employee_id: "EMP016" },
  { id: 20, name: "Trần Thị B", employee_id: "EMP020" },
  { id: 25, name: "Lê Văn C", employee_id: "EMP025" },
  { id: 26, name: "Hoàng Thị Mai", employee_id: "EMP026" },
  { id: 29, name: "Vũ Văn Nam", employee_id: "EMP029" },
  { id: 30, name: "Đỗ Thị Hương", employee_id: "EMP030" },
]

export function ActivityLogManagement() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 17,
    totalItems: 322,
    itemsPerPage: 20,
  })
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    search: "",
    subject_type: "all",
    description: "",
    log_name: "all",
    causer_id: "all",
    date_from: undefined,
    date_to: undefined,
    event: "all",
  })

  // Load data on component mount
  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLogs(mockApiResponse.data.logs)
      setPagination(mockApiResponse.data.pagination)
    } catch (error) {
      console.error("Error loading logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      subject_type: "all",
      description: "",
      log_name: "all",
      causer_id: "all",
      date_from: undefined,
      date_to: undefined,
      event: "all",
    })
  }

  const getActionIcon = (description: string) => {
    switch (description) {
      case "created":
        return <Plus className="h-4 w-4 text-green-600" />
      case "updated":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "deleted":
        return <Trash2 className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionColor = (description: string) => {
    switch (description) {
      case "created":
        return "bg-green-100 text-green-800 border-green-200"
      case "updated":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "deleted":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getModelName = (subjectType: string) => {
    switch (subjectType) {
      case "App\\Models\\TaskProgress":
        return "Tiến độ công việc"
      case "App\\Models\\User":
        return "Người dùng"
      case "App\\Models\\Task":
        return "Công việc"
      case "App\\Models\\Department":
        return "Phòng ban"
      default:
        return subjectType.split("\\").pop() || "Unknown"
    }
  }

  const getUserName = (userId: number | null) => {
    if (!userId) return "Hệ thống"
    const user = mockUsers.find((u) => u.id === userId)
    return user ? user.name : `User #${userId}`
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi })
  }

  const getLogContent = (log: ActivityLog) => {
    if (log.subject_type === "App\\Models\\TaskProgress") {
      return log.properties.attributes.content || "Không có nội dung"
    }
    if (log.subject_type === "App\\Models\\User") {
      const attrs = log.properties.attributes
      return `${attrs.name} (${attrs.employee_id}) - ${attrs.email}`
    }
    return "Không có nội dung chi tiết"
  }

  const getActionText = (description: string) => {
    switch (description) {
      case "created":
        return "Tạo mới"
      case "updated":
        return "Cập nhật"
      case "deleted":
        return "Xóa"
      default:
        return description
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">       
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nhật ký hoạt động</h1>
        <p className="text-muted-foreground">Theo dõi tất cả hoạt động và thay đổi trong hệ thống</p>
      </div>

      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng hoạt động</p>
                <p className="text-2xl font-bold">{pagination.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tạo mới</p>
                <p className="text-2xl font-bold">{logs.filter((l) => l.description === "created").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cập nhật</p>
                <p className="text-2xl font-bold">{logs.filter((l) => l.description === "updated").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Xóa</p>
                <p className="text-2xl font-bold">{logs.filter((l) => l.description === "deleted").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Ẩn bộ lọc
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Hiện bộ lọc
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Làm mới
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label>Tìm kiếm</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm trong nội dung..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Subject Type */}
              <div className="space-y-2">
                <Label>Loại đối tượng</Label>
                <Select
                  value={filters.subject_type}
                  onValueChange={(value) => handleFilterChange("subject_type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại đối tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="App\\Models\\TaskProgress">Tiến độ công việc</SelectItem>
                    <SelectItem value="App\\Models\\User">Người dùng</SelectItem>
                    <SelectItem value="App\\Models\\Task">Công việc</SelectItem>
                    <SelectItem value="App\\Models\\Department">Phòng ban</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action */}
              <div className="space-y-2">
                <Label>Hành động</Label>
                <Select value={filters.event} onValueChange={(value) => handleFilterChange("event", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn hành động" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="created">Tạo mới</SelectItem>
                    <SelectItem value="updated">Cập nhật</SelectItem>
                    <SelectItem value="deleted">Xóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User */}
              <div className="space-y-2">
                <Label>Người thực hiện</Label>
                <Select value={filters.causer_id} onValueChange={(value) => handleFilterChange("causer_id", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn người thực hiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="system">Hệ thống</SelectItem>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.employee_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label>Từ ngày</Label>
                <Input className="w-full block" type="date" value={filters.date_from ? format(filters.date_from, "yyyy-MM-dd", { locale: vi }) : ""} onChange={(e) => handleFilterChange("date_from", e.target.value)} />
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label>Đến ngày</Label>
                <Input className="w-full block" type="date" value={filters.date_to ? format(filters.date_to, "yyyy-MM-dd", { locale: vi }) : ""} onChange={(e) => handleFilterChange("date_to", e.target.value)} />
              </div>

              {/* Log Name */}
              <div className="space-y-2">
                <Label>Tên log</Label>
                <Select value={filters.log_name} onValueChange={(value) => handleFilterChange("log_name", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn tên log" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="auth">Authentication</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Activity Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Danh sách hoạt động
            <Badge variant="secondary">{pagination.totalItems} hoạt động</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[120px]">Hành động</TableHead>
                    <TableHead className="w-[150px]">Loại đối tượng</TableHead>
                    <TableHead className="w-[80px]">Đối tượng</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead className="w-[150px]">Người thực hiện</TableHead>
                    <TableHead className="w-[140px]">Thời gian</TableHead>
                    <TableHead className="w-[80px]">Log</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">#{log.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.description)}
                          <Badge className={`${getActionColor(log.description)} text-xs`}>
                            {getActionText(log.description)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getModelName(log.subject_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">#{log.subject_id}</TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate text-sm" title={getLogContent(log)}>
                          {getLogContent(log)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[120px]" title={getUserName(log.causer_id)}>
                            {getUserName(log.causer_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(log.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {log.log_name}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} -{" "}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong tổng số{" "}
              {pagination.totalItems} hoạt động
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={pagination.currentPage === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trước
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                })}
                {pagination.totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                      {pagination.totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button variant="outline" size="sm" disabled={pagination.currentPage === pagination.totalPages}>
                Sau
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
</div>
  )
}
