"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getErrorMessage } from "@/services/errorHandler"
import { toast } from "sonner"
import { API_ENDPOINTS } from "@/config/api"
import { useChangePassword } from "@/hooks/useUser"
import { Label } from "@/components/ui/label"

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const { doChangePassword, loading: changePasswordLoading, error: changePasswordError, success: changePasswordSuccess } = useChangePassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    // Client validation
    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.")
      return
    }
    if (newPassword !== newPasswordConfirmation) {
      setError("Xác nhận mật khẩu mới không khớp.")
      return
    }
    if (currentPassword === newPassword) {
      setError("Mật khẩu mới không được trùng với mật khẩu hiện tại.")
      return
    }
    try {
      const data = await doChangePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      })
      if (data.success) {
        setSuccess("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.")
        toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.")
        setTimeout(() => {
          setSuccess(null)
          onOpenChange(false)
          router.push("/login")
        }, 1500)
      } else {
        setError(data.message || "Đã xảy ra lỗi.")
        toast.error(data.message || "Đã xảy ra lỗi.")
      }
    } catch (err: any) {
      const msg = getErrorMessage(err)
      setError(err.response.data.message)
      toast.error(msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Mật khẩu hiện tại"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-password">Mật khẩu mới (≥ 8 ký tự)</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Mật khẩu mới (≥ 8 ký tự)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-password-confirmation">Xác nhận mật khẩu mới</Label>
            <Input
              id="new-password-confirmation"
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={newPasswordConfirmation}
              onChange={e => setNewPasswordConfirmation(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang đổi..." : "Đổi mật khẩu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 