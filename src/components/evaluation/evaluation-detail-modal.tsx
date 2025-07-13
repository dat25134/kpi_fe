"use client"

import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEvaluationDetailModal } from "@/hooks/useEvaluationDetailModal"
import EvaluationCriteriaList from "@/components/evaluation/evaluation-criteria-list"
import EvaluationHeaderInfo from "@/components/evaluation/EvaluationHeaderInfo"
import EvaluationTabsContainer from "@/components/evaluation/EvaluationTabsContainer"
import WorkDescriptionTable from "@/components/evaluation/WorkDescriptionTable"
import EvaluationSummary from "@/components/evaluation/EvaluationSummary"
import { calculateTotalScore, getEvaluationStatusLabel } from "@/lib/utils"
import ActionButtons from "@/components/evaluation/ActionButtons"
import ConfirmModal from "@/components/shared/confirm-delete-modal"

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
  const {
    // State
    state,
    data,
    isLoading,
    error,
    user,
    canEdit,
    actionButtonsConfig,
    showConfirmModal,
    confirmMessage,
    setShowConfirmModal,
    handleConfirm,
    
    // Handlers
    handleScoreChange,
    handleCommentChange,
    handleSaveDraft,
    handleSubmit,
    handleLevel1Approve,
    handleLevel2Approve,
    handleComplete,
    handleTabChange,
    fieldErrors
  } = useEvaluationDetailModal(evaluationId, open)

  if (!open) return null;
  if (isLoading) return (
    <div className="flex items-center justify-center p-8">Đang tải chi tiết...</div>
  );
  if (error) return (
    <div className="flex items-center justify-center p-8 text-red-500">Lỗi: {error}</div>
  );
  if (!data) return null;

  const totalScore = calculateTotalScore(state.details)

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
          activeTab={state.activeTab}
          onTabChange={handleTabChange}
        >
          <TabsContent value="criteria" className="space-y-4">
            <EvaluationCriteriaList 
              details={state.details}
              onScoreChange={handleScoreChange}
              onCommentChange={handleCommentChange}
              isReadOnly={!canEdit}
              fieldErrors={fieldErrors}
            />
          </TabsContent>

          <TabsContent value="workDescription" className="space-y-4">
            <WorkDescriptionTable 
              workDescriptions={data?.work_descriptions}
            />
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <EvaluationSummary 
              details={state.details}
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
            <ActionButtons
              actionButtonsConfig={actionButtonsConfig}
              saving={state.saving}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
              onLevel1Approve={handleLevel1Approve}
              onLevel2Approve={handleLevel2Approve}
              onComplete={handleComplete}
            />
          </div>
        </div>
      </DialogContent>
      {/* Confirm Modal */}
      <ConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        title="Xác nhận gửi đánh giá"
        description={confirmMessage}
        onConfirm={handleConfirm}
      />
    </Dialog>
  )
} 