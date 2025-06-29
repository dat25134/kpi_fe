"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Users,
  DollarSign,
  FileText,
  Settings,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { PermissionModalProps } from "@/types/permission"
// Danh sách tất cả quyền hạn có thể có trong hệ thống
const allPermissions = [
  // Quản lý nhân sự
  {
    id: 1,
    name: "Xem danh sách nhân viên",
    module: "HR",
    category: "Xem",
    description: "Xem thông tin cơ bản của nhân viên",
  },
  { id: 2, name: "Thêm nhân viên mới", module: "HR", category: "Thêm", description: "Tạo hồ sơ nhân viên mới" },
  {
    id: 3,
    name: "Chỉnh sửa thông tin nhân viên",
    module: "HR",
    category: "Sửa",
    description: "Cập nhật thông tin nhân viên",
  },
  { id: 4, name: "Xóa nhân viên", module: "HR", category: "Xóa", description: "Xóa hồ sơ nhân viên khỏi hệ thống" },
  { id: 5, name: "Quản lý chức vụ", module: "HR", category: "Quản lý", description: "Phân công và thay đổi chức vụ" },

  // Tài chính
  {
    id: 6,
    name: "Xem báo cáo tài chính",
    module: "Finance",
    category: "Xem",
    description: "Truy cập các báo cáo tài chính",
  },
  {
    id: 7,
    name: "Phê duyệt ngân sách",
    module: "Finance",
    category: "Phê duyệt",
    description: "Phê duyệt đề xuất ngân sách",
  },
  {
    id: 8,
    name: "Quản lý lương thưởng",
    module: "Finance",
    category: "Quản lý",
    description: "Thiết lập và điều chỉnh lương",
  },
  { id: 9, name: "Xuất hóa đơn", module: "Finance", category: "Xuất", description: "Tạo và xuất hóa đơn" },
  {
    id: 10,
    name: "Quản lý chi phí",
    module: "Finance",
    category: "Quản lý",
    description: "Theo dõi và kiểm soát chi phí",
  },

  // Quản lý dự án
  { id: 11, name: "Xem danh sách dự án", module: "Project", category: "Xem", description: "Xem thông tin các dự án" },
  { id: 12, name: "Tạo dự án mới", module: "Project", category: "Thêm", description: "Khởi tạo dự án mới" },
  {
    id: 13,
    name: "Phân công nhiệm vụ",
    module: "Project",
    category: "Phân công",
    description: "Giao việc cho thành viên",
  },
  {
    id: 14,
    name: "Theo dõi tiến độ",
    module: "Project",
    category: "Theo dõi",
    description: "Giám sát tiến độ thực hiện",
  },
  { id: 15, name: "Đóng dự án", module: "Project", category: "Quản lý", description: "Kết thúc và đánh giá dự án" },

  // Hệ thống
  {
    id: 16,
    name: "Cấp quyền người dùng",
    module: "System",
    category: "Cấp quyền",
    description: "Phân quyền cho người dùng khác",
  },
  { id: 17, name: "Xem log hệ thống", module: "System", category: "Xem", description: "Truy cập nhật ký hệ thống" },
  { id: 18, name: "Sao lưu dữ liệu", module: "System", category: "Sao lưu", description: "Thực hiện backup dữ liệu" },
  {
    id: 19,
    name: "Cấu hình hệ thống",
    module: "System",
    category: "Cấu hình",
    description: "Thay đổi cài đặt hệ thống",
  },
  {
    id: 20,
    name: "Quản lý tích hợp",
    module: "System",
    category: "Quản lý",
    description: "Quản lý các tích hợp bên ngoài",
  },

  // Báo cáo
  { id: 21, name: "Xem báo cáo KPI", module: "Report", category: "Xem", description: "Truy cập báo cáo hiệu suất" },
  { id: 22, name: "Xuất báo cáo", module: "Report", category: "Xuất", description: "Xuất báo cáo ra file" },
  { id: 23, name: "Tạo báo cáo tùy chỉnh", module: "Report", category: "Tạo", description: "Tạo báo cáo theo yêu cầu" },
  {
    id: 24,
    name: "Lên lịch báo cáo",
    module: "Report",
    category: "Lên lịch",
    description: "Tự động gửi báo cáo định kỳ",
  },
]

const moduleIcons = {
  HR: Users,
  Finance: DollarSign,
  Project: FileText,
  System: Settings,
  Report: FileText,
}

const moduleColors = {
  HR: "bg-blue-100 text-blue-800",
  Finance: "bg-green-100 text-green-800",
  Project: "bg-purple-100 text-purple-800",
  System: "bg-red-100 text-red-800",
  Report: "bg-orange-100 text-orange-800",
}

export default function PermissionModal({
  open,
  onOpenChange,
  role,
  onUpdatePermissions,
}: PermissionModalProps) {
  const [permissions, setPermissions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModule, setSelectedModule] = useState("all")

  useEffect(() => {
    if (role) {
      // Khởi tạo permissions với tất cả quyền có thể có
      const rolePermissions = allPermissions.map((perm) => {
        const existingPerm = role.permissions?.find((p: any) => p.id === perm.id)
        return {
          ...perm,
          granted: existingPerm ? existingPerm.granted : false,
        }
      })
      setPermissions(rolePermissions)
    }
  }, [role])

  if (!role) return null

  const handlePermissionToggle = (permissionId: number, granted: boolean) => {
    setPermissions((prev) => prev.map((perm) => (perm.id === permissionId ? { ...perm, granted } : perm)))
  }

  const handleSave = () => {
    onUpdatePermissions(role.id, permissions)
    onOpenChange(false)
  }

  const handleSelectAll = (module: string) => {
    setPermissions((prev) =>
      prev.map((perm) => (module === "all" || perm.module === module ? { ...perm, granted: true } : perm)),
    )
  }

  const handleDeselectAll = (module: string) => {
    setPermissions((prev) =>
      prev.map((perm) => (module === "all" || perm.module === module ? { ...perm, granted: false } : perm)),
    )
  }

  const filteredPermissions = permissions.filter((perm) => {
    const matchesSearch =
      perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModule = selectedModule === "all" || perm.module === selectedModule
    return matchesSearch && matchesModule
  })

  const groupedPermissions = filteredPermissions.reduce(
    (acc, perm) => {
      if (!acc[perm.module]) {
        acc[perm.module] = []
      }
      acc[perm.module].push(perm)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const grantedCount = permissions.filter((p) => p.granted).length
  const totalCount = permissions.length

  const modules = [...new Set(allPermissions.map((p) => p.module))]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-blue-600" />
            Cấp quyền cho chức vụ: {role.display_name}
            <Badge variant="outline">{role.code}</Badge>
          </DialogTitle>
          <DialogDescription>Quản lý quyền hạn và phân quyền truy cập cho chức vụ này</DialogDescription>
        </DialogHeader>

        {/* Thống kê quyền */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Tổng quyền</p>
                  <p className="text-xl font-bold">{totalCount}</p>
                </div>
                <Shield className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Đã cấp</p>
                  <p className="text-xl font-bold text-green-600">{grantedCount}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Chưa cấp</p>
                  <p className="text-xl font-bold text-red-600">{totalCount - grantedCount}</p>
                </div>
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedModule} onValueChange={setSelectedModule} className="w-full max-h-[350px]">
          <div className="flex items-center justify-between mb-3">
            <TabsList className="grid w-full grid-cols-6 h-9">
              <TabsTrigger value="all" className="text-xs">Tất cả</TabsTrigger>
              <TabsTrigger value="HR" className="text-xs">Nhân sự</TabsTrigger>
              <TabsTrigger value="Finance" className="text-xs">Tài chính</TabsTrigger>
              <TabsTrigger value="Project" className="text-xs">Dự án</TabsTrigger>
              <TabsTrigger value="System" className="text-xs">Hệ thống</TabsTrigger>
              <TabsTrigger value="Report" className="text-xs">Báo cáo</TabsTrigger>
            </TabsList>
          </div>

          {/* Tìm kiếm và thao tác hàng loạt */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm quyền..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => handleSelectAll(selectedModule)} className="h-8 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Chọn tất cả
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDeselectAll(selectedModule)} className="h-8 text-xs">
              <XCircle className="h-3 w-3 mr-1" />
              Bỏ chọn tất cả
            </Button>
          </div>

          {/* Danh sách quyền */}
          <div className="max-h-[350px] overflow-y-auto space-y-2">
            {Object.entries(groupedPermissions).map(([module, modulePermissions]: any) => {
              const ModuleIcon = moduleIcons[module as keyof typeof moduleIcons]

              return (
                <Card key={module} className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ModuleIcon className="h-4 w-4" />
                      {module === "HR"
                        ? "Quản lý Nhân sự"
                        : module === "Finance"
                          ? "Tài chính"
                          : module === "Project"
                            ? "Quản lý Dự án"
                            : module === "System"
                              ? "Hệ thống"
                              : module === "Report"
                                ? "Báo cáo"
                                : module}
                      <Badge className={`text-xs ${moduleColors[module as keyof typeof moduleColors]}`}>
                        {modulePermissions.length} quyền
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 px-4 pb-3">
                    {modulePermissions.map((permission: any) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Label className="font-medium text-sm truncate">{permission.name}</Label>
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              {permission.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1">{permission.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {permission.granted && <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />}
                          <Switch
                            checked={permission.granted}
                            onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked)}
                            className="scale-75"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredPermissions.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Shield className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Không tìm thấy quyền nào phù hợp</p>
            </div>
          )}
        </Tabs>

        {/* Cảnh báo */}
        {role.order === 1 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-start gap-2 mt-3">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-yellow-800">Lưu ý quan trọng</p>
              <p className="text-xs text-yellow-700">
                Đây là chức vụ cao nhất trong hệ thống. Hãy cân nhắc kỹ khi cấp quyền để đảm bảo an toàn.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Shield className="h-3 w-3 mr-1" />
            Lưu quyền hạn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
