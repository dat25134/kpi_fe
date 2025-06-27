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
import UserProfilePersonalInfo from "./UserProfilePersonalInfo"
import UserProfileDetailInfo from "./UserProfileDetailInfo"
import UserProfileWorkInfo from "./UserProfileWorkInfo"
import UserProfileSkills from "./UserProfileSkills"
import UserProfileProjects from "./UserProfileProjects"

export default function UserProfile({ userProfile }: { userProfile: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    education: userProfile?.education || "",
    skills: userProfile?.skills ? userProfile.skills.join(", ") : "",
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
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
      education: userProfile?.education || "",
      skills: userProfile?.skills ? userProfile.skills.join(", ") : "",
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
              <AvatarFallback className="bg-blue-100 text-blue-900 text-xl">{userProfile?.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{userProfile?.name}</h2>
              <p className="text-lg text-gray-600">{userProfile?.position}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {userProfile?.department?.name}
                </Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đang làm việc</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Mã nhân viên</div>
              <div className="font-mono font-bold">EMP{userProfile?.id?.toString().padStart(4, "0")}</div>
              <div className="text-sm text-gray-500 mt-2">Ngày vào làm</div>
              <div className="font-medium">{userProfile?.joinDate}</div>
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
                <UserProfilePersonalInfo
                  isEditing={isEditing}
                  formData={formData}
                  userProfile={userProfile}
                  handleInputChange={handleInputChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <UserProfileDetailInfo userProfile={userProfile} />
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
                <p className="text-sm font-medium">{userProfile?.education}</p>
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
              <UserProfileWorkInfo userProfile={userProfile} />
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
              <UserProfileSkills
                isEditing={isEditing}
                formData={formData}
                userProfile={userProfile}
                handleInputChange={handleInputChange}
              />
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
              <UserProfileProjects userProfile={userProfile} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
