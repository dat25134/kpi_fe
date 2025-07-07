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
import { useActivityLog } from "@/hooks/useActivityLog"
import { ActivityLog, ActivityLogPagination } from "@/types/activity-log"
import { ActivityLogTable } from "./ActivityLogTable"
import { Select as AntdSelect } from "antd"
import { useAllUsers } from "@/hooks/useEmployees"
import { DatePicker, ConfigProvider } from "antd"
import viVN from "antd/es/locale/vi_VN"
import dayjs from "dayjs"
import "dayjs/locale/vi"
dayjs.locale("vi")

export function ActivityLogManagement() {
  const [showFilters, setShowFilters] = useState(false)
  const { allUsers, loading: loadingUsers } = useAllUsers()
  const employees = allUsers

  // Chuyển đổi filter mặc định sang dạng string hoặc undefined cho API
  const initialFilters = {
    search: "",
    subject_type: undefined,
    description: undefined,
    log_name: undefined,
    causer_id: undefined,
    date_from: undefined,
    date_to: undefined,
    event: undefined,
    page: 1,
    per_page: 20,
  }

  const {
    logs,
    pagination,
    filters,
    setFilters,
    loading,
    error,
    loadLogs,
  } = useActivityLog(initialFilters)

  // Load data on mount
  useEffect(() => {
    (async () => {
      try {
        await loadLogs()
      } catch (err) {
        // Xử lý lỗi ở đây nếu cần
        console.error("Error loading logs:", err)
      }
    })()
  }, [])

  // Khi filter thay đổi, tự động load lại logs
  useEffect(() => {
    (async () => {
      try {
        await loadLogs()
      } catch (err) {
        console.error("Error loading logs:", err)
      }
    })()
  }, [filters])

  // Xử lý thay đổi filter
  const handleFilterChange = (key: string, value: any) => {
    let v = value
    // Chuyển đổi giá trị filter cho API
    if (key === "date_from" || key === "date_to") {
      v = value ? (typeof value === "string" ? value : value.toISOString().slice(0, 10)) : undefined
    }
    if (v === "all") v = undefined
    setFilters((prev: any) => ({ ...prev, [key]: v }))
  }

  // Xóa filter
  const clearFilters = () => {
    setFilters({
      search: "",
      subject_type: undefined,
      description: undefined,
      log_name: undefined,
      causer_id: undefined,
      date_from: undefined,
      date_to: undefined,
      event: undefined,
      page: 1,
      per_page: 20,
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
    const user = employees.find((u: any) => u.id === userId)
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

  // Thêm hàm tạo mảng số trang cần hiển thị
  function getPageNumbers(current: number, total: number) {
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);
    return range;
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
                <p className="text-2xl font-bold">{pagination ? pagination.totalItems : 0}</p>
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
                <p className="text-2xl font-bold">{pagination ? pagination.create_count : 0}</p>
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
                <p className="text-2xl font-bold">{pagination ? pagination.update_count : 0}</p>
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
                <p className="text-2xl font-bold">{pagination ? pagination.delete_count : 0}</p>
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
              <Button variant="outline" size="sm" onClick={async () => { try { await loadLogs() } catch (err) { console.error(err) } }} disabled={loading}>
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
        <CardContent
          className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm trong nội dung..."
                  value={filters.search ?? ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Subject Type */}
            <div className="space-y-2">
              <Label>Loại đối tượng</Label>
              <AntdSelect
                value={filters.subject_type ?? "all"}
                onChange={value => handleFilterChange("subject_type", value)}
                style={{ width: "100%" }}
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "App\\Models\\TaskProgress", label: "Tiến độ công việc" },
                  { value: "App\\Models\\User", label: "Người dùng" },
                  { value: "App\\Models\\Task", label: "Công việc" },
                  { value: "App\\Models\\Department", label: "Phòng ban" },
                  { value: "App\\Models\\Role", label: "Vai trò" },
                ]}
              />
            </div>

            {/* Action */}
            <div className="space-y-2">
              <Label>Hành động</Label>
              <AntdSelect
                value={filters.event ?? "all"}
                onChange={value => handleFilterChange("event", value)}
                style={{ width: "100%" }}
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "created", label: "Tạo mới" },
                  { value: "updated", label: "Cập nhật" },
                  { value: "deleted", label: "Xóa" },
                ]}
              />
            </div>

            {/* User */}
            <div className="space-y-2">
              <Label>Người thực hiện</Label>
              <AntdSelect
                value={filters.causer_id ?? "all"}
                onChange={value => handleFilterChange("causer_id", value)}
                style={{ width: "100%" }}
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "system", label: "Hệ thống" },
                  ...employees.map((user: any) => ({ value: user.id.toString(), label: `${user.name} (${user.employee_id})` }))
                ]}
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <ConfigProvider locale={viVN}>
                <DatePicker
                  value={filters.date_from ? dayjs(filters.date_from) : null}
                  onChange={(date) => handleFilterChange("date_from", date ? date.format("YYYY-MM-DD") : "")}
                  format="DD/MM/YYYY"
                  placeholder="Từ ngày"
                  className="w-full block"
                />
              </ConfigProvider>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <ConfigProvider locale={viVN}>
                <DatePicker
                  value={filters.date_to ? dayjs(filters.date_to) : null}
                  onChange={(date) => handleFilterChange("date_to", date ? date.format("YYYY-MM-DD") : "")}
                  format="DD/MM/YYYY"
                  placeholder="Đến ngày"
                  className="w-full block"
                />
              </ConfigProvider>
            </div>

            {/* Log Name */}
            <div className="space-y-2">
              <Label>Tên log</Label>
              <AntdSelect
                value={filters.log_name ?? "all"}
                onChange={value => handleFilterChange("log_name", value)}
                style={{ width: "100%" }}
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "default", label: "Default" },
                  { value: "auth", label: "Authentication" },
                  { value: "task", label: "Task" },
                ]}
              />
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
      </Card>

      {/* Activity Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Danh sách hoạt động
            <Badge variant="secondary">{pagination ? pagination.totalItems : 0} hoạt động</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityLogTable
            logs={logs}
            loading={loading}
            getActionIcon={getActionIcon}
            getActionColor={getActionColor}
            getActionText={getActionText}
            getModelName={getModelName}
            getLogContent={getLogContent}
            getUserName={getUserName}
            formatDate={formatDate}
            pagination={pagination as ActivityLogPagination}
          />
        </CardContent>
      </Card>   

      {/* Pagination */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 0} - {pagination ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) : 0} trong tổng số {pagination ? pagination.totalItems : 0} hoạt động
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={pagination ? pagination.currentPage === 1 : true} onClick={() => setFilters({ ...filters, page: (pagination?.currentPage || 1) - 1 })}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trước
              </Button>

              <div className="flex items-center gap-1">
                {pagination && getPageNumbers(pagination.currentPage, pagination.totalPages).map((page, idx) =>
                  page === '...'
                    ? <span key={"ellipsis-" + idx} className="text-muted-foreground">...</span>
                    : <Button
                        key={page}
                        variant={page === pagination.currentPage ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => typeof page === 'number' && setFilters({ ...filters, page })}
                      >
                        {page}
                      </Button>
                )}
              </div>

              <Button variant="outline" size="sm" disabled={pagination ? pagination.currentPage === pagination.totalPages : true} onClick={() => setFilters({ ...filters, page: (pagination?.currentPage || 1) + 1 })}>
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
