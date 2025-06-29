"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
                    {department.code}
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
                    {department.status === "active" ? "Hoạt động" : "Tạm dừng"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày thành lập</label>
                  <p className="text-sm flex items-center gap-1">
                    {department.created_at}
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
              {department.manager ? (
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{department.manager.name}</h3>
                    <p className="text-sm text-gray-500">{department.manager.role?.displayName}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        {department.manager.name.toLowerCase().replace(/\s+/g, ".")}@company.com
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        +84 123 456 789
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Chưa có thông tin trưởng phòng.</p>
              )}
            </CardContent>
          </Card>

          {/* Thống kê nhân sự */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Thống kê nhân sự
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{department.employee_count || 0}</div>
                  <div className="text-sm text-gray-500">Tổng nhân viên</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {department.employees
                      ? department.employees.filter(
                          (emp: any) =>
                            emp.role?.name === "chuyenvien"
                        ).length
                      : department.manager
                        ? 1
                        : 0}
                  </div>
                  <div className="text-sm text-gray-500">Chuyên viên</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {department.employees
                      ? department.employees.filter((emp: any) => emp.role?.name === "nhanvien").length
                      : (department.employee_count || 0) - (department.chuyenvien ? 1 : 0)}
                  </div>
                  <div className="text-sm text-gray-500">Nhân viên</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danh sách nhân viên */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Danh sách nhân viên</CardTitle>
              <CardDescription>{department.employee_count || 0} nhân viên trong phòng ban</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {department.employees && department.employees.length > 0 ? (
                  department.employees.map((employee: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium text-sm">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.role?.displayName}</p>
                        </div>
                      </div>
                      <div>
                        <Badge className={`bg-${employee.role?.color}-100 text-${employee.role?.color}-800 hover:bg-${employee.role?.color}-100`}>
                          {employee.role?.displayName}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">Chưa có thông tin nhân viên.</div>
                )}
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
