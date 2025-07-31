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
  onSuccess?: () => void
}

export default function EvaluationDetailModal({ 
  open, 
  onOpenChange, 
  evaluationId,
  onSuccess
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
    fieldErrors,
    handleUpdateWorkDescriptions
  } = useEvaluationDetailModal(evaluationId, open, onSuccess)

  if (!open) return null;
  if (isLoading) return (
    <div className="flex items-center justify-center p-8">Đang tải chi tiết...</div>
  );
  if (error) return (
    <div className="flex items-center justify-center p-8 text-red-500">Lỗi: {error}</div>
  );
  if (!data) return null;

  const totalScore = calculateTotalScore(state.details)
  const isLevel1Approver = user && data && user.role === data.level1_approver_role
  const canEditWorkDescriptions = isLevel1Approver && actionButtonsConfig.canLevel1Approve

  // Xác định currentMode cho ActionButtons
  let currentMode: 'draft' | 'submit' | 'level1-approve' | 'level1-update' | 'level2-approve' | 'level2-update' | 'level2-update-or-complete' | 'complete' = 'draft';
  if (data?.status === 'draft' && user?.role === data?.creator_role) {
    currentMode = 'draft';
  } else if (data?.status === 'submitted' && user?.role === data?.level1_approver_role) {
    currentMode = 'level1-approve';
  } else if (data?.status === 'level1_approved' && user?.role === data?.level1_approver_role) {
    currentMode = 'level1-update';
  } else if (data?.status === 'level1_approved' && user?.role === data?.level2_approver_role) {
    currentMode = 'level2-approve';
  } else if (data?.status === 'level2_approved' && user?.role === data?.level2_approver_role) {
    currentMode = 'level2-update-or-complete';
  } else if (data?.status === 'completed') {
    currentMode = 'complete';
  }

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
              isReadOnly={false} // sẽ xác định ở bên trong từng tab
              fieldErrors={fieldErrors}
              currentUserRole={user?.role}
              evaluationStatus={data?.status}
              creatorRole={data?.creator_role}
              level1ApproverRole={data?.level1_approver_role}
              level2ApproverRole={data?.level2_approver_role}
            />
          </TabsContent>

          <TabsContent value="workDescription" className="space-y-4">
            <WorkDescriptionTable 
              workDescriptions={data?.work_descriptions}
              isEditable={!!canEditWorkDescriptions}
              onSave={handleUpdateWorkDescriptions}
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
            {canEdit && (
              <ActionButtons
                actionButtonsConfig={actionButtonsConfig}
                saving={state.saving}
                onSaveDraft={handleSaveDraft}
                onSubmit={handleSubmit}
                onLevel1Approve={handleLevel1Approve}
                onLevel2Approve={handleLevel2Approve}
                onComplete={handleComplete}
                currentMode={currentMode}
              />
            )}
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
        confirmText="Xác nhận gửi"
      />
    </Dialog>
  )
} 