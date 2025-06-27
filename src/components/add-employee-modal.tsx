"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ValidationError } from "@/services/employee"
import { toast } from "sonner"
import { formatVietnamesePhoneNumber, formatVND } from "@/lib/utils"

type AddEmployeeModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddEmployee: (employee: any) => Promise<any>
  editingEmployee?: any
  onClose: () => void
  departments: any[]
  positions: readonly { key: string; value: string }[]
  genders: readonly { key: string; value: string }[]
}

export default function AddEmployeeModal({
  open,
  onOpenChange,
  onAddEmployee,
  editingEmployee,
  onClose,
  departments,
  positions,
  genders,
}: AddEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    departmentId: "",
    status: "active",
    salary: "",
    address: "",
    birthDate: "",
    gender: "",
    education: "",
    experience: "",
    skills: "",
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name,
        email: editingEmployee.email,
        phone: editingEmployee.phone,
        position: editingEmployee.position,
        departmentId: editingEmployee.department?.id?.toString() || "",
        status: editingEmployee.status,
        salary: formatVND(editingEmployee.salary.toString()),
        address: editingEmployee.address,
        birthDate: editingEmployee.birthDate,
        gender: editingEmployee.gender,
        education: editingEmployee.education,
        experience: editingEmployee.experience,
        skills: editingEmployee.skills.join(", "),
      })
    } else {
      resetForm()
    }
    setErrors({}) // Clear errors when employee changes
  }, [editingEmployee])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const selectedDepartment = departments.find((dept) => dept.id.toString() === formData.departmentId)
    if (!selectedDepartment) {
      setErrors({ departmentId: ["Vui lòng chọn phòng ban."] })
      return
    }

    const nameParts = formData.name.split(" ")
    const avatar =
      nameParts.length >= 2
        ? nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        : formData.name.substring(0, 2).toUpperCase()

    const employeeData = {
      ...formData,
      avatar,
      department: selectedDepartment,
      salary: Number.parseInt(formData.salary.replace(/\D/g, '')) || 0,
      phone: formData.phone.replace(/\D/g, ''),
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill),
    }

    try {
      if (editingEmployee) {
        await onAddEmployee({ ...editingEmployee, ...employeeData })
      } else {
        await onAddEmployee(employeeData)
      }

      resetForm()
      onOpenChange(false)
      onClose()
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrors(error.errors)
        toast.error("Thông tin không hợp lệ, vui lòng kiểm tra lại.")
      } else {
        console.error(error)
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      departmentId: "",
      status: "active",
      salary: "",
      address: "",
      birthDate: "",
      gender: "",
      education: "",
      experience: "",
      skills: "",
    })
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for the field being edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm mới nhân viên"}</DialogTitle>
            <DialogDescription>
              {editingEmployee ? "Cập nhật thông tin nhân viên" : "Nhập thông tin chi tiết nhân viên mới"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="detail">Chi tiết</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input
                    id="name"
                    placeholder="Nhập họ và tên"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                  <div className="min-h-[1.25rem]">
                    {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                  <div className="min-h-[1.25rem]">
                    {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatVietnamesePhoneNumber(e.target.value)
                      handleInputChange("phone", formatted)
                    }}
                    required
                    maxLength={13}
                  />
                  <div className="min-h-[1.25rem]">
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone[0]}</p>}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender: any) => (
                        <SelectItem key={gender.key} value={gender.key}>
                          {gender.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="min-h-[1.25rem]">
                    {errors.gender && <p className="text-sm text-red-500">{errors.gender[0]}</p>}
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Phòng ban *</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => handleInputChange("departmentId", value)}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Danh sách phòng ban</SelectLabel>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="min-h-[1.25rem]">
                    {errors.departmentId && <p className="text-sm text-red-500">{errors.departmentId[0]}</p>}
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="position">Chức vụ *</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => handleInputChange("position", value)}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Danh sách chức vụ</SelectLabel>
                        {positions.map((position) => (
                          <SelectItem key={position.key} value={position.key}>
                            {position.value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="min-h-[1.25rem]">
                    {errors.position && <p className="text-sm text-red-500">{errors.position[0]}</p>}
                  </div>
                </div>

                {/* Salary */}
                <div className="space-y-2">
                  <Label htmlFor="salary">Lương (VNĐ)</Label>
                  <Input
                    id="salary"
                    type="text"
                    placeholder="Nhập mức lương"
                    value={formData.salary}
                    onChange={(e) => {
                      const formatted = formatVND(e.target.value)
                      handleInputChange("salary", formatted)
                    }}
                  />
                  <div className="min-h-[1.25rem]">
                    {errors.salary && <p className="text-sm text-red-500">{errors.salary[0]}</p>}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang làm việc</SelectItem>
                      <SelectItem value="inactive">Tạm nghỉ</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="min-h-[1.25rem]">
                    {errors.status && <p className="text-sm text-red-500">{errors.status[0]}</p>}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detail" className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="birthDate">Ngày sinh</Label>
                <Input
                  id="birthDate"
                  placeholder="dd/mm/yyyy"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                />
                {errors.birthDate && <p className="text-sm text-red-500 mt-1">{errors.birthDate[0]}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  placeholder="Nhập địa chỉ"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="min-h-[60px]"
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address[0]}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="education">Trình độ học vấn</Label>
                <Input
                  id="education"
                  placeholder="VD: Cử nhân Công nghệ thông tin"
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                />
                {errors.education && <p className="text-sm text-red-500 mt-1">{errors.education[0]}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="experience">Kinh nghiệm</Label>
                <Input
                  id="experience"
                  placeholder="VD: 5 năm"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                />
                {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience[0]}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="skills">Kỹ năng</Label>
                <Textarea
                  id="skills"
                  placeholder="Nhập các kỹ năng, cách nhau bởi dấu phẩy"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  className="min-h-[80px]"
                />
                <p className="text-xs text-gray-500">VD: JavaScript, React, Node.js, Python</p>
                {errors.skills && <p className="text-sm text-red-500 mt-1">{errors.skills[0]}</p>}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit">{editingEmployee ? "Cập nhật" : "Thêm mới"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
