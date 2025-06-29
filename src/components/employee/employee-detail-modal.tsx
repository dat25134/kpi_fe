"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Building2,
  DollarSign,
  Award,
  FolderOpen,
} from "lucide-react"
import { formatVND } from "@/lib/utils"
import EmployeeDetailPersonalInfo from "./EmployeeDetailPersonalInfo"

type EmployeeDetailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: any
}

export default function EmployeeDetailModal({ open, onOpenChange, employee }: EmployeeDetailModalProps) {
  if (!employee) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin nhân viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header với thông tin cơ bản */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-blue-100 text-blue-900 text-xl">{employee.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{employee.name}</h2>
                  <p className="text-lg text-gray-600">{employee.role?.displayName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {employee.department.name}
                    </Badge>
                    <Badge
                      className={
                        employee.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {employee.status === "active" ? "Đang làm việc" : "Tạm nghỉ"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Mã nhân viên</div>
                  <div className="font-mono font-bold">EMP{employee.id.toString().padStart(4, "0")}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="work">Công việc</TabsTrigger>
              <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
              <TabsTrigger value="projects">Dự án</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{employee.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm">{employee.address}</span>
                    </div>
                  </CardContent>
                </Card>

                <EmployeeDetailPersonalInfo employee={employee} />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Học vấn & Kinh nghiệm
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Trình độ học vấn</label>
                    <p className="text-sm font-medium">{employee.education}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Kinh nghiệm làm việc</label>
                    <p className="text-sm font-medium">{employee.experience}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="work" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Thông tin công việc
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Chức vụ:</span>
                      <Badge className={`bg-${employee.role?.color}-100 text-${employee.role?.color}-800 hover:bg-${employee.role?.color}-100`}>{employee.role?.displayName}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phòng ban:</span>
                      <span className="text-sm font-medium">{employee.department.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Mã phòng:</span>
                      <Badge variant="outline">{employee.department.code}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Thông tin lương
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Lương cơ bản:</span>
                      <span className="text-sm font-medium text-green-600">{formatVND(employee.salary.toString())} VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Trạng thái:</span>
                      <Badge
                        className={
                          employee.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {employee.status === "active" ? "Đang làm việc" : "Tạm nghỉ"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Kỹ năng chuyên môn
                  </CardTitle>
                  <CardDescription>Danh sách các kỹ năng và công nghệ mà nhân viên thành thạo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Dự án tham gia
                  </CardTitle>
                  <CardDescription>Danh sách các dự án mà nhân viên đang tham gia hoặc đã hoàn thành</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employee.projects.map((project: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-500">Vai trò: {project.role}</p>
                        </div>
                        <Badge variant={project.status === "Hoàn thành" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                    {employee.projects.length === 0 && (
                      <p className="text-center text-gray-500 py-4">Chưa tham gia dự án nào</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
