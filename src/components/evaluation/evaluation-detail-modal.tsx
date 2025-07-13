"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEvaluationDetail } from "@/hooks/useEvaluationDetail"
import { useEvaluation } from "@/hooks/useEvaluation"
import { useUser } from "@/hooks/useUser"
import EvaluationCriteriaList from "./evaluation-criteria-list"
import EvaluationHeaderInfo from "./EvaluationHeaderInfo"
import EvaluationTabsContainer from "./EvaluationTabsContainer"
import WorkDescriptionTable from "./WorkDescriptionTable"
import EvaluationSummary from "./EvaluationSummary"
import { calculateTotalScore, canEditByRole, canEditEvaluation, formatEvaluationDataForSave, getEvaluationStatusLabel } from "@/lib/utils"
import { type EvaluationCriteriaDetail } from "@/types/evaluation"
import { toast } from "sonner"

interface EvaluationDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  evaluationId?: number | string
}

export default function EvaluationDetailModal({ 
  open, 
  onOpenChange, 
  evaluationId
}: EvaluationDetailModalProps) {
  const { data, isLoading, error, refetch } = useEvaluationDetail(evaluationId, open)
  const { saveEvaluation } = useEvaluation()
  const { user } = useUser()
  
  const [activeTab, setActiveTab] = useState("criteria")
  const [details, setDetails] = useState<EvaluationCriteriaDetail[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data?.details) {
      setDetails(data.details)
    }
  }, [data?.details])

  const handleScoreChange = (id: number, field: string, value: string) => {
    setDetails(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }
  
  const handleCommentChange = (id: number, field: string, value: string) => {
    setDetails(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const handleSaveDraft = async () => {
    if (!data || !evaluationId) return
    
    try {
      setSaving(true)
      const requestData = formatEvaluationDataForSave(details, 'draft')
      await saveEvaluation(Number(evaluationId), requestData)
      toast.success("Đã lưu nháp thành công!")
      await refetch()
    } catch (error: any) {
      console.error("Lỗi khi lưu nháp:", error)
      toast.error(error?.response?.data?.message || "Không thể lưu nháp. Vui lòng thử lại!")
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    if (!data || !evaluationId) return
    
    try {
      setSaving(true)
      const requestData = formatEvaluationDataForSave(details, 'submitted')
      await saveEvaluation(Number(evaluationId), requestData)
      toast.success("Đã gửi đánh giá thành công!")
      await refetch()
    } catch (error: any) {
      console.error("Lỗi khi gửi đánh giá:", error)
      toast.error(error?.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại!")
    } finally {
      setSaving(false)
    }
  }

  const handleLevel1Approve = async () => {
    if (!data || !evaluationId) return
    
    try {
      setSaving(true)
      const requestData = formatEvaluationDataForSave(details, 'level1_approved')
      await saveEvaluation(Number(evaluationId), requestData)
      toast.success("Đã đánh giá cấp 1 thành công!")
      await refetch()
    } catch (error: any) {
      console.error("Lỗi khi đánh giá cấp 1:", error)
      toast.error(error?.response?.data?.message || "Không thể đánh giá cấp 1. Vui lòng thử lại!")
    } finally {
      setSaving(false)
    }
  }

  const handleLevel2Approve = async () => {
    if (!data || !evaluationId) return
    
    try {
      setSaving(true)
      const requestData = formatEvaluationDataForSave(details, 'level2_approved')
      await saveEvaluation(Number(evaluationId), requestData)
      toast.success("Đã đánh giá cấp 2 thành công!")
      await refetch()
    } catch (error: any) {
      console.error("Lỗi khi đánh giá cấp 2:", error)
      toast.error(error?.response?.data?.message || "Không thể đánh giá cấp 2. Vui lòng thử lại!")
    } finally {
      setSaving(false)
    }
  }

  const handleComplete = async () => {
    if (!data || !evaluationId) return
    
    try {
      setSaving(true)
      const requestData = formatEvaluationDataForSave(details, 'completed')
      await saveEvaluation(Number(evaluationId), requestData)
      toast.success("Đã hoàn thành đánh giá!")
      await refetch()
    } catch (error: any) {
      console.error("Lỗi khi hoàn thành đánh giá:", error)
      toast.error(error?.response?.data?.message || "Không thể hoàn thành đánh giá. Vui lòng thử lại!")
    } finally {
      setSaving(false)
    }
  }

  // Kiểm tra quyền chỉnh sửa
  const canEdit = data && user ? canEditByRole(data.status, user.role) : false
  
  // Xác định action buttons dựa trên status và role
  const getActionButtons = () => {
    if (!data || !user) return []

    const buttons = []
    const currentStatus = data.status
    const userRole = user.role

    // Nhân viên/Chuyên viên
    if (userRole === 'nhanvien' || userRole === 'chuyenvien') {
      if (currentStatus === 'draft') {
        buttons.push(
          <Button key="draft" variant="outline" onClick={handleSaveDraft} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu nháp"}
          </Button>,
          <Button key="submit" onClick={handleSubmit} disabled={saving}>
            {saving ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        )
      }
    }
    
    // Trưởng phòng/Phó phòng
    if (userRole === 'truongphong' || userRole === 'phophong') {
      if (currentStatus === 'submitted') {
        buttons.push(
          <Button key="level1" onClick={handleLevel1Approve} disabled={saving}>
            {saving ? "Đang đánh giá..." : "Đánh giá cấp 1"}
          </Button>
        )
      } else if (currentStatus === 'level1_approved') {
        buttons.push(
          <Button key="level1" variant="outline" onClick={handleLevel1Approve} disabled={saving}>
            {saving ? "Đang cập nhật..." : "Cập nhật đánh giá cấp 1"}
          </Button>
        )
      }
    }
    
    // Admin/Chủ tịch/Phó chủ tịch
    if (userRole === 'admin' || userRole === 'chutich' || userRole === 'phochutich') {
      if (currentStatus === 'submitted') {
        buttons.push(
          <Button key="level1" onClick={handleLevel1Approve} disabled={saving}>
            {saving ? "Đang đánh giá..." : "Đánh giá cấp 1"}
          </Button>
        )
      } else if (currentStatus === 'level1_approved') {
        buttons.push(
          <Button key="level1" variant="outline" onClick={handleLevel1Approve} disabled={saving}>
            {saving ? "Đang cập nhật..." : "Cập nhật đánh giá cấp 1"}
          </Button>,
          <Button key="level2" onClick={handleLevel2Approve} disabled={saving}>
            {saving ? "Đang đánh giá..." : "Đánh giá cấp 2"}
          </Button>
        )
      } else if (currentStatus === 'level2_approved') {
        buttons.push(
          <Button key="level2" variant="outline" onClick={handleLevel2Approve} disabled={saving}>
            {saving ? "Đang cập nhật..." : "Cập nhật đánh giá cấp 2"}
          </Button>,
          <Button key="complete" onClick={handleComplete} disabled={saving}>
            {saving ? "Đang hoàn thành..." : "Hoàn thành"}
          </Button>
        )
      }
    }

    return buttons
  }

  if (!open) return null;
  if (isLoading) return (
    <div className="flex items-center justify-center p-8">Đang tải chi tiết...</div>
  );
  if (error) return (
    <div className="flex items-center justify-center p-8 text-red-500">Lỗi: {error}</div>
  );
  if (!data) return null;

  const totalScore = calculateTotalScore(details)
  const actionButtons = getActionButtons()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            PHIẾU ĐÁNH GIÁ, XẾP LOẠI HÀNG THÁNG
          </DialogTitle>
          <DialogDescription>
            Tháng: {data?.month}/{data?.year} - Họ và tên: {data?.user?.name} - Đơn vị: {data?.department}
            <br />
            Trạng thái: <span className="font-medium">{getEvaluationStatusLabel(data.status)}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Header Info */}
        <EvaluationHeaderInfo 
          data={data}
        />

        {/* Evaluation Tabs */}
        <EvaluationTabsContainer 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          <TabsContent value="criteria" className="space-y-4">
            <EvaluationCriteriaList 
              details={details}
              onScoreChange={handleScoreChange}
              onCommentChange={handleCommentChange}
              isReadOnly={!canEdit}
            />
          </TabsContent>

          <TabsContent value="workDescription" className="space-y-4">
            <WorkDescriptionTable 
              workDescriptions={data?.work_descriptions}
            />
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <EvaluationSummary 
              details={details}
              totalScore={totalScore}
            />
          </TabsContent>
        </EvaluationTabsContainer>

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {!canEdit && "Bạn không có quyền chỉnh sửa phiếu đánh giá này"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            {actionButtons}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 