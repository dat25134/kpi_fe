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
import {
  createDepartment,
  DepartmentPayload,
  updateDepartment,
} from "@/services/department"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Dữ liệu mẫu cho trưởng phòng
const managers = [
  { id: 1, value: "pnv", label: "Phạm Ngọc Vinh", avatar: "PNV" },
  { id: 2, value: "tvn", label: "Trần Văn Nam", avatar: "TVN" },
  { id: 3, value: "htm", label: "Hoàng Thị Minh", avatar: "HTM" },
  { id: 4, value: "nvt", label: "Nguyễn Văn Thành", avatar: "NVT" },
  { id: 5, value: "ltm", label: "Lê Thị Mai", avatar: "LTM" },
  { id: 6, value: "pvd", label: "Phạm Văn Đức", avatar: "PVĐ" },
]

type AddDepartmentModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddDepartment: (department: any) => void
  onEditDepartment: () => void
  editingDepartment?: any
  onClose: () => void
}

export default function AddDepartmentModal({
  open,
  onOpenChange,
  onAddDepartment,
  onEditDepartment,
  editingDepartment,
  onClose,
}: AddDepartmentModalProps) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [managerId, setManagerId] = useState<string | undefined>()
  const [status, setStatus] = useState("active")
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (editingDepartment) {
      setName(editingDepartment.name)
      setCode(editingDepartment.code)
      setDescription(editingDepartment.description)
      setManagerId(editingDepartment.manager ? editingDepartment.manager.id.toString() : undefined)
      setStatus(editingDepartment.status)
    } else {
      resetForm()
    }
    setErrors({})
  }, [editingDepartment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const selectedManager = managers.find((m) => m.id.toString() === managerId)
    if (!selectedManager) return

    const departmentData: DepartmentPayload = {
      name,
      code: code.toUpperCase(),
      description,
      manager_id: selectedManager.id,
      status,
    }

    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, departmentData)
        toast.success("Cập nhật phòng ban thành công!")
        onEditDepartment()
      } else {
        const newDepartment = await createDepartment(departmentData)
        toast.success("Thêm mới phòng ban thành công!")
        onAddDepartment(newDepartment)
      }

      resetForm()
      onOpenChange(false)
      onClose()
    } catch (error: any) {
      console.error("Failed to add department:", error)
      const errorData = error.response?.data
      if (errorData && errorData.errors) {
        setErrors(errorData.errors)
      } else {
        const errorMessage = errorData?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
        setErrors({ general: [errorMessage] })
        toast.error(errorMessage)
      }
    }
  }

  const resetForm = () => {
    setName("")
    setCode("")
    setDescription("")
    setManagerId(undefined)
    setStatus("active")
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingDepartment ? "Chỉnh sửa phòng ban" : "Thêm mới phòng ban"}</DialogTitle>
            <DialogDescription>
              {editingDepartment ? "Cập nhật thông tin phòng ban" : "Nhập thông tin chi tiết phòng ban mới"}
            </DialogDescription>
          </DialogHeader>
          {errors.general && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{errors.general[0]}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên phòng ban</Label>
              <Input
                id="name"
                placeholder="Nhập tên phòng ban"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn({ "border-destructive": errors.name })}
                required
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Mã phòng ban</Label>
              <Input
                id="code"
                placeholder="Nhập mã phòng ban (VD: QTNT)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className={cn({ "border-destructive": errors.code })}
                required
              />
              {errors.code && <p className="text-sm text-destructive">{errors.code[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả chức năng nhiệm vụ của phòng ban"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn("min-h-[80px] resize-none", { "border-destructive": errors.description })}
                required
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manager">Trưởng phòng</Label>
              <Select value={managerId} onValueChange={setManagerId} required>
                <SelectTrigger className={cn("w-full", { "border-destructive": errors.manager_id })}>
                  <SelectValue placeholder="Chọn trưởng phòng" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectLabel>Danh sách nhân viên</SelectLabel>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id.toString()}>
                        <div className="flex items-center w-full">
                          <div className="h-6 w-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center mr-2">
                            {manager.avatar}
                          </div>
                          {manager.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.manager_id && <p className="text-sm text-destructive">{errors.manager_id[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger className={cn("w-full", { "border-destructive": errors.status })}>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectLabel>Trạng thái hoạt động</SelectLabel>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm dừng</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive">{errors.status[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit">{editingDepartment ? "Cập nhật" : "Thêm mới"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
