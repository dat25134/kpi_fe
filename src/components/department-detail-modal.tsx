"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Calendar, Mail, Phone, Users } from "lucide-react"

type DepartmentDetailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  department: any
}

export default function DepartmentDetailModal({ open, onOpenChange, department }: DepartmentDetailModalProps) {
  if (!department) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Chi tiết phòng ban
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tên phòng ban</label>
                  <p className="text-sm font-medium">{department.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mã phòng</label>
                  <p className="text-sm">
                    <Badge variant="outline">{department.code}</Badge>
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mô tả</label>
                <p className="text-sm text-gray-700">{department.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                  <p className="text-sm">
                    <Badge
                      className={
                        department.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {department.status === "active" ? "Hoạt động" : "Tạm dừng"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày thành lập</label>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {department.createdAt}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin trưởng phòng */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trưởng phòng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-900">{department.manager.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{department.manager.name}</h3>
                  <p className="text-sm text-gray-500">{department.manager.position}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {department.manager.name.toLowerCase().replace(/\s+/g, ".")}@company.com
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      +84 123 456 789
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thống kê nhân sự */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Thống kê nhân sự
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{department.employeeCount}</div>
                  <div className="text-sm text-gray-500">Tổng nhân viên</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {department.employees?.filter(
                      (emp) => emp.position === "Trưởng phòng" || emp.position === "Phó phòng",
                    ).length || 1}
                  </div>
                  <div className="text-sm text-gray-500">Quản lý</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {department.employees?.filter((emp) => emp.position === "Chuyên viên").length ||
                      department.employeeCount - 1}
                  </div>
                  <div className="text-sm text-gray-500">Chuyên viên</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danh sách nhân viên */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Danh sách nhân viên</CardTitle>
              <CardDescription>{department.employeeCount} nhân viên trong phòng ban</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {department.employees?.map((employee: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">{employee.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.position}</p>
                      </div>
                    </div>
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
