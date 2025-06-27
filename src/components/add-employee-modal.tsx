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
import AddEmployeeFormFields from "./AddEmployeeFormFields"

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

          <AddEmployeeFormFields
            formData={formData}
            errors={errors}
            departments={departments}
            positions={positions}
            genders={genders}
            handleInputChange={handleInputChange}
          />

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
