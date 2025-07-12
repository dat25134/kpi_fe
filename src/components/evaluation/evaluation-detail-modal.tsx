"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEvaluationDetail } from "@/hooks/useEvaluationDetail"
import EvaluationCriteriaList from "./evaluation-criteria-list"
import EvaluationHeaderInfo from "./EvaluationHeaderInfo"
import EvaluationTabsContainer from "./EvaluationTabsContainer"
import WorkDescriptionTable from "./WorkDescriptionTable"
import EvaluationSummary from "./EvaluationSummary"
import { calculateTotalScore } from "@/lib/utils"
import { type EvaluationCriteriaDetail } from "@/types/evaluation"

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
  const { data, isLoading, error } = useEvaluationDetail(evaluationId, open)
  const [activeTab, setActiveTab] = useState("criteria")
  const [details, setDetails] = useState<EvaluationCriteriaDetail[]>([])

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

  if (!open) return null;
  if (isLoading) return (
    <div className="flex items-center justify-center p-8">Đang tải chi tiết...</div>
  );
  if (error) return (
    <div className="flex items-center justify-center p-8 text-red-500">Lỗi: {error}</div>
  );
  if (!data) return null;

  const totalScore = calculateTotalScore(details)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            PHIẾU ĐÁNH GIÁ, XẾP LOẠI HÀNG THÁNG
          </DialogTitle>
          <DialogDescription>
            Tháng: {data?.month}/{data?.year} - Họ và tên: {data?.user?.name} - Đơn vị: {data?.user?.department}
          </DialogDescription>
        </DialogHeader>

        {/* Header Info */}
        <EvaluationHeaderInfo 
          user={data.user}
          month={data.month}
          year={data.year}
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
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button variant="outline">
            Lưu nháp
          </Button>
          <Button>
            Gửi đánh giá
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 