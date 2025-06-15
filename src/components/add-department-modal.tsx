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

// Dữ liệu mẫu cho trưởng phòng
const managers = [
  { value: "pnv", label: "Phạm Ngọc Vinh", avatar: "PNV" },
  { value: "tvn", label: "Trần Văn Nam", avatar: "TVN" },
  { value: "htm", label: "Hoàng Thị Minh", avatar: "HTM" },
  { value: "nvt", label: "Nguyễn Văn Thành", avatar: "NVT" },
  { value: "ltm", label: "Lê Thị Mai", avatar: "LTM" },
  { value: "pvd", label: "Phạm Văn Đức", avatar: "PVĐ" },
]

type AddDepartmentModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddDepartment: (department: any) => void
  editingDepartment?: any
  onClose: () => void
}

export default function AddDepartmentModal({
  open,
  onOpenChange,
  onAddDepartment,
  editingDepartment,
  onClose,
}: AddDepartmentModalProps) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [managerId, setManagerId] = useState("")
  const [status, setStatus] = useState("active")

  useEffect(() => {
    if (editingDepartment) {
      setName(editingDepartment.name)
      setCode(editingDepartment.code)
      setDescription(editingDepartment.description)
      setManagerId(editingDepartment.manager.avatar.toLowerCase())
      setStatus(editingDepartment.status)
    } else {
      resetForm()
    }
  }, [editingDepartment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedManager = managers.find((m) => m.value === managerId)
    if (!selectedManager) return

    const departmentData = {
      name,
      code: code.toUpperCase(),
      description,
      manager: {
        name: selectedManager.label,
        avatar: selectedManager.avatar,
        position: "Trưởng phòng",
      },
      status,
    }

    if (editingDepartment) {
      onAddDepartment({ ...editingDepartment, ...departmentData })
    } else {
      onAddDepartment(departmentData)
    }

    resetForm()
    onOpenChange(false)
    onClose()
  }

  const resetForm = () => {
    setName("")
    setCode("")
    setDescription("")
    setManagerId("")
    setStatus("active")
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
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên phòng ban</Label>
              <Input
                id="name"
                placeholder="Nhập tên phòng ban"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Mã phòng ban</Label>
              <Input
                id="code"
                placeholder="Nhập mã phòng ban (VD: QTNT)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả chức năng nhiệm vụ của phòng ban"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manager">Trưởng phòng</Label>
              <Select value={managerId} onValueChange={setManagerId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trưởng phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Danh sách nhân viên</SelectLabel>
                    {managers.map((manager) => (
                      <SelectItem key={manager.value} value={manager.value}>
                        <div className="flex items-center">
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Trạng thái hoạt động</SelectLabel>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm dừng</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
