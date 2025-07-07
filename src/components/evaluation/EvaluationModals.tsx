"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import EvaluationDetailModal from "./evaluation-detail-modal"
import CreateEvaluationForm from "./CreateEvaluationForm"
import type { EvaluationModalsProps } from "@/types/evaluation"

export default function EvaluationModals({
  showEvaluationDetail,
  setShowEvaluationDetail,
  selectedEvaluation,
  showCreateEvaluationModal,
  setShowCreateEvaluationModal,
  currentUser,
  onConfirmCreateEvaluation
}: Omit<EvaluationModalsProps, 'showWorkDescriptionForm' | 'setShowWorkDescriptionForm'>) {
  return (
    <>
      {/* Evaluation Detail Modal */}
      <EvaluationDetailModal
        open={showEvaluationDetail}
        onOpenChange={setShowEvaluationDetail}
        evaluationId={selectedEvaluation || undefined}
      />

      {/* Create Evaluation Modal */}
      <Dialog open={showCreateEvaluationModal} onOpenChange={setShowCreateEvaluationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo phiếu đánh giá mới</DialogTitle>
            <DialogDescription>
              Chọn tháng và năm để tạo phiếu đánh giá
            </DialogDescription>
          </DialogHeader>
          
          <CreateEvaluationForm 
            onConfirm={onConfirmCreateEvaluation}
            onCancel={() => setShowCreateEvaluationModal(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
} 