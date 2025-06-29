"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Crown, Users, Calendar, Building2, Hash } from "lucide-react"

type RoleDetailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: any
}

export default function RoleDetailModal({ open, onOpenChange, role }: RoleDetailModalProps) {
  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown
              className={`h-5 w-5 ${
                role.order === 1
                  ? "text-yellow-500"
                  : role.order === 2
                    ? "text-gray-400"
                    : role.order === 3
                      ? "text-orange-500"
                      : "text-gray-300"
              }`}
            />
            Chi tiết chức vụ: {role.name}
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
                  <label className="text-sm font-medium text-gray-500">Tên chức vụ</label>
                  <p className="text-base font-medium">{role.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mã chức vụ</label>
                  <p className="text-base">
                    <Badge variant="outline">{role.code}</Badge>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Mô tả</label>
                <p className="text-base mt-1">{role.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Thứ tự</label>
                  <p className="text-base flex items-center">
                    <Hash className="h-4 w-4 mr-1 text-gray-400" />
                    <Badge
                      variant={role.order <= 2 ? "default" : role.order <= 3 ? "secondary" : "outline"}
                      className="font-mono"
                    >
                      #{role.order}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                  <p className="text-base">
                    <Badge
                      className={
                        role.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {role.status === "active" ? "Hoạt động" : "Tạm dừng"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                  <p className="text-base flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {role.createdAt}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thống kê nhân viên */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Nhân viên ({role.employeeCount})
              </CardTitle>
              <CardDescription>Danh sách nhân viên hiện tại đang giữ chức vụ này</CardDescription>
            </CardHeader>
            <CardContent>
              {role.employeeCount > 0 ? (
                <div className="space-y-3">
                  {role.employees.map((employee: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-900">{employee.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            {employee.department}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          #{role.order} - {role.name}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có nhân viên nào được phân công chức vụ này</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hướng dẫn sắp xếp */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Crown className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Sắp xếp thứ tự chức vụ</h4>
                  <p className="text-sm text-blue-700">
                    Bạn có thể kéo thả các hàng trong bảng danh sách để thay đổi thứ tự chức vụ. Thứ tự này sẽ phản ánh
                    cấp bậc và quyền hạn trong tổ chức.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
