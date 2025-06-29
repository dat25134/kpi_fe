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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AddRoleModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddRole: (role: any) => void
  editingRole?: any
  onClose: () => void
}

export default function AddRoleModal({
  open,
  onOpenChange,
  onAddRole,
  editingRole,
  onClose,
}: AddRoleModalProps) {
  const [formData, setFormData] = useState({
    display_name: "",
    code: "",
    description: "",
    status: "active",
  })
  const [errorMsg, setErrorMsg] = useState<Record<string, string[]> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingRole) {
      setFormData({
        display_name: editingRole.display_name || "",
        code: editingRole.code,
        description: editingRole.description,
        status: editingRole.status,
      })
    } else {
      resetForm()
    }
    setErrorMsg(null)
  }, [editingRole])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const roleData = {
      display_name: formData.display_name,
      code: formData.code.toUpperCase(),
      description: formData.description,
      status: formData.status,
    }

    try {
      if (editingRole) {
        await onAddRole({ ...editingRole, ...roleData })
      } else {
        await onAddRole(roleData)
      }
      resetForm()
      setErrorMsg(null)
      onOpenChange(false)
      onClose()
    } catch (error: any) {
      if (error?.errors) {
        setErrorMsg(error.errors)
      } else {
        setErrorMsg({ general: [error?.message || "Có lỗi xảy ra, vui lòng kiểm tra lại!"] })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      display_name: "",
      code: "",
      description: "",
      status: "active",
    })
  }

  const handleClose = () => {
    resetForm()
    setErrorMsg(null)
    onClose()
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingRole ? "Chỉnh sửa chức vụ" : "Thêm mới chức vụ"}</DialogTitle>
            <DialogDescription>
              {editingRole
                ? "Cập nhật thông tin chức vụ"
                : "Nhập thông tin chi tiết chức vụ mới. Thứ tự chức vụ có thể sắp xếp bằng cách kéo thả trong danh sách."}
            </DialogDescription>
          </DialogHeader>

          {errorMsg?.general && (
            <div className="text-red-600 text-sm mb-2">{errorMsg.general.join(" ")}</div>
          )}

          <div className="space-y-4 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="display_name" className="pb-2">Tên chức vụ *</Label>
                <Input
                  id="display_name"
                  placeholder="Nhập tên chức vụ"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange("display_name", e.target.value)}
                  required
                />
                {errorMsg?.display_name && (
                  <div className="text-red-600 text-xs mt-1">{errorMsg.display_name.join(" ")}</div>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="code" className="pb-2">Mã chức vụ *</Label>
                <Input
                  id="code"
                  placeholder="VD: TP, PP, CV"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                  required
                />
                {errorMsg?.code && (
                  <div className="text-red-600 text-xs mt-1">{errorMsg.code.join(" ")}</div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả chi tiết về chức vụ"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="min-h-[80px]"
                required
              />
              {errorMsg?.description && (
                <div className="text-red-600 text-xs mt-1">{errorMsg.description.join(" ")}</div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
              {errorMsg?.status && (
                <div className="text-red-600 text-xs mt-1">{errorMsg.status.join(" ")}</div>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Lưu ý:</strong> Chức vụ mới sẽ được thêm vào cuối danh sách. Bạn có thể kéo thả để sắp xếp
                lại thứ tự sau khi tạo.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editingRole ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
