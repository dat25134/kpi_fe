"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{editingDepartment ? "Chỉnh sửa phòng ban" : "Thêm mới phòng ban"}</DialogTitle>
            <DialogDescription>
              {editingDepartment ? "Cập nhật thông tin phòng ban" : "Nhập thông tin chi tiết phòng ban mới"}
            </DialogDescription>
          </DialogHeader>
          {errors.general && (
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-6 w-6">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-4.5v8.25c0 .621-.504 1.125-1.125 1.225A9.753 9.753 0 0021.75 21H3.75A2.25 2.25 0 011.5 18.75V12zm15 0c0 .105.02.21.06.306.06H18.75a.75.75 0 00.75-.75z" />
                </svg>
              </div>
              <div className="text-sm text-red-600">{errors.general[0]}</div>
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium leading-6 text-gray-900">
                Tên phòng ban
              </label>
              <Input
                id="name"
                placeholder="Nhập tên phòng ban"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${errors.name ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name[0]}</p>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="code" className="text-sm font-medium leading-6 text-gray-900">
                Mã phòng ban
              </label>
              <Input
                id="code"
                placeholder="Nhập mã phòng ban (VD: QTNT)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className={`${errors.code ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.code && <p className="text-sm text-red-600">{errors.code[0]}</p>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium leading-6 text-gray-900">
                Mô tả
              </label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả chức năng nhiệm vụ của phòng ban"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${errors.description ? 'border-red-300' : 'border-gray-300'} resize-none`}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description[0]}</p>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="manager" className="text-sm font-medium leading-6 text-gray-900">
                Trưởng phòng
              </label>
              <Select value={managerId} onValueChange={setManagerId}>
                <SelectTrigger className={`w-full focus:border-blue-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 ${errors.manager_id ? 'border-red-300' : 'border-gray-300'}`}>
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
              {errors.manager_id && <p className="text-sm text-red-600">{errors.manager_id[0]}</p>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium leading-6 text-gray-900">
                Trạng thái
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className={`w-full focus:border-blue-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 ${errors.status ? 'border-red-300' : 'border-gray-300'}`}>
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
              {errors.status && <p className="text-sm text-red-600">{errors.status[0]}</p>}
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
