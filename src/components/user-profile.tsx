"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Building2,
  Edit,
  Save,
  X,
  Award,
  FolderOpen,
} from "lucide-react"

// Dữ liệu mẫu người dùng hiện tại
const currentUser = {
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
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Project Management"],
  projects: [
    { name: "Hệ thống KPI", role: "Project Manager", status: "Đang thực hiện" },
    { name: "Ứng dụng Tây Ninh Smart", role: "Tech Lead", status: "Hoàn thành" },
    { name: "Website công ty", role: "Technical Advisor", status: "Hoàn thành" },
  ],
}

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    address: currentUser.address,
    education: currentUser.education,
    skills: currentUser.skills.join(", "),
  })

  const handleSave = () => {
    // Xử lý lưu thông tin - trong thực tế sẽ gọi API
    console.log("Saving user data:", formData)
    setIsEditing(false)
    // Có thể thêm toast notification ở đây
  }

  const handleCancel = () => {
    // Reset form về dữ liệu gốc
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
      education: currentUser.education,
      skills: currentUser.skills.join(", "),
    })
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản và hồ sơ cá nhân</p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {/* Header với thông tin cơ bản */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-blue-100 text-blue-900 text-xl">{currentUser.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              <p className="text-lg text-gray-600">{currentUser.position}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {currentUser.department.name}
                </Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đang làm việc</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Mã nhân viên</div>
              <div className="font-mono font-bold">EMP{currentUser.id.toString().padStart(4, "0")}</div>
              <div className="text-sm text-gray-500 mt-2">Ngày vào làm</div>
              <div className="font-medium">{currentUser.joinDate}</div>
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{currentUser.name}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{currentUser.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{currentUser.phone}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="min-h-[60px]"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm">{currentUser.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Ngày sinh:</span>
                  <span className="text-sm font-medium">{currentUser.birthDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Giới tính:</span>
                  <span className="text-sm font-medium">{currentUser.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Ngày vào làm:</span>
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {currentUser.joinDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Kinh nghiệm:</span>
                  <span className="text-sm font-medium">{currentUser.experience}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Học vấn
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="education">Trình độ học vấn</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                  />
                </div>
              ) : (
                <p className="text-sm font-medium">{currentUser.education}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Thông tin công việc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Chức vụ:</span>
                    <Badge variant="default">{currentUser.position}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Phòng ban:</span>
                    <span className="text-sm font-medium">{currentUser.department.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Mã phòng:</span>
                    <Badge variant="outline">{currentUser.department.code}</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Trạng thái:</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đang làm việc</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Kinh nghiệm:</span>
                    <span className="text-sm font-medium">{currentUser.experience}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5" />
                Kỹ năng chuyên môn
              </CardTitle>
              <CardDescription>Danh sách các kỹ năng và công nghệ thành thạo</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="skills">Kỹ năng (cách nhau bởi dấu phẩy)</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    className="min-h-[100px]"
                    placeholder="VD: JavaScript, React, Node.js, Python"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
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
              <CardDescription>Danh sách các dự án đang tham gia hoặc đã hoàn thành</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentUser.projects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-500">Vai trò: {project.role}</p>
                    </div>
                    <Badge variant={project.status === "Hoàn thành" ? "default" : "secondary"}>{project.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
