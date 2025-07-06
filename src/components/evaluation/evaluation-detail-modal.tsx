"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { 
  EVALUATION_CRITERIA, 
  EvaluationTargetType, 
  CompletionLevel, 
  QualityRating,
  ComplexityWeight,
  QualityWeight,
  type EvaluationForm,
  type WorkDescriptionItem
} from "@/types/evaluation"
import { cn, getResultLevelName, getRoleLabel } from "@/lib/utils"
import { useEvaluationDetail } from "@/hooks/useEvaluationDetail"
import EvaluationCriteriaList from "./evaluation-criteria-list"

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

  const getQualityRating = (points: number): QualityRating => {
    if (points >= 90) return QualityRating.EXCELLENT
    if (points >= 70) return QualityRating.GOOD
    if (points >= 50) return QualityRating.ACHIEVED
    return QualityRating.NOT_ACHIEVED
  }

  const getQualityRatingLabel = (rating: QualityRating) => {
    switch (rating) {
      case QualityRating.EXCELLENT:
        return "Hoàn thành xuất sắc nhiệm vụ"
      case QualityRating.GOOD:
        return "Hoàn thành tốt nhiệm vụ"
      case QualityRating.ACHIEVED:
        return "Hoàn thành nhiệm vụ"
      case QualityRating.NOT_ACHIEVED:
        return "Không hoàn thành nhiệm vụ"
      default:
        return "Không xác định"
    }
  }

  const getQualityRatingBadge = (rating: QualityRating) => {
    const variants = {
      [QualityRating.EXCELLENT]: "bg-green-100 text-green-800",
      [QualityRating.GOOD]: "bg-blue-100 text-blue-800", 
      [QualityRating.ACHIEVED]: "bg-yellow-100 text-yellow-800",
      [QualityRating.NOT_ACHIEVED]: "bg-red-100 text-red-800"
    }
    
    const labels = {
      [QualityRating.EXCELLENT]: "Xuất sắc",
      [QualityRating.GOOD]: "Tốt",
      [QualityRating.ACHIEVED]: "Đạt",
      [QualityRating.NOT_ACHIEVED]: "Không đạt"
    }

    return (
      <Badge className={cn("font-normal", variants[rating])}>
        {labels[rating]}
      </Badge>
    )
  }

  // Calculate total score from details
  const calculateTotalScore = () => {
    if (!data?.details) return 0
    return data?.details?.reduce((total, item) => {
      return total + (parseFloat(item.final_score || "0"))
    }, 0)
  }

  const totalScore = calculateTotalScore()
  const totalWorkDescriptionScore = data?.work_descriptions?.reduce((sum, item) => sum + parseFloat(item?.final_score || "0"), 0) || 0
  const totalWorkDescriptionWeight = data?.work_descriptions?.reduce((sum, item) => sum + parseFloat(item?.task_weight?.toString() || "0"), 0) || 0
  const kpiScore = totalWorkDescriptionScore ? totalWorkDescriptionScore / totalWorkDescriptionWeight : 0
  const kpiQualityRating = getQualityRating(kpiScore)
  if (!open) return null;
  if (isLoading) return (
    <div className="flex items-center justify-center p-8">Đang tải chi tiết...</div>
  );
  if (error) return (
    <div className="flex items-center justify-center p-8 text-red-500">Lỗi: {error}</div>
  );
  if (!data) return null;

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

        <div className="space-y-6">
          {/* Header Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Họ và tên</Label>
                  <Input value={data?.user?.name} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Đơn vị công tác</Label>
                  <Input value={data?.user?.department} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Chức vụ</Label>
                  <Input value={getRoleLabel(data?.user?.role)} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Tháng đánh giá</Label>
                  <Input value={`${data?.month}/${data?.year}`} readOnly className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="criteria">Tiêu chí đánh giá</TabsTrigger>
              <TabsTrigger value="workDescription">Bảng mô tả công việc</TabsTrigger>
              <TabsTrigger value="summary">Tổng hợp</TabsTrigger>
            </TabsList>

            <TabsContent value="criteria" className="space-y-4">
              <EvaluationCriteriaList 
                details={data?.details} 
                isReadOnly={true}
              />
            </TabsContent>

            <TabsContent value="workDescription" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bảng mô tả công việc (KPIs)</CardTitle>
                  <CardDescription>
                    Thống kê chi tiết từng công việc, nhiệm vụ và đo lường bằng sản phẩm cụ thể
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">TT</TableHead>
                          <TableHead className="text-center">Nhiệm vụ, công việc</TableHead>
                          <TableHead className="text-center">ĐVT</TableHead>
                          <TableHead className="text-center">Mục tiêu</TableHead>
                          <TableHead className="text-center">Trọng số phức tạp</TableHead>
                          <TableHead className="text-center">Kết quả</TableHead>
                          <TableHead className="text-center">Điểm</TableHead>
                          <TableHead className="text-center">Trọng số chất lượng</TableHead>
                          <TableHead className="text-center">Điểm có trọng số</TableHead>
                          <TableHead className="text-center">Điểm cuối cùng</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.work_descriptions?.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="max-w-xs truncate" title={item?.task_title}>{item?.task_title}</TableCell>
                            <TableCell>{item?.unit}</TableCell>
                            <TableCell>{item?.target}</TableCell>
                            <TableCell className="text-center">{item?.task_weight}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {getResultLevelName(item?.result_level.toString())}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{item?.result_level}</TableCell>
                            <TableCell className="text-center">{item?.quality_weight}</TableCell>
                            <TableCell className="text-center">{item?.result_score}</TableCell>
                            <TableCell className="text-center font-medium">{item?.final_score}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mt-4">
                    <div className="text-lg font-semibold">
                      Tổng điểm: {data?.work_descriptions?.reduce((sum, item) => sum + parseFloat(item.final_score || "0"), 0)}
                    </div>
                    <div className="text-lg font-semibold">
                      Điểm KPI: {kpiScore.toFixed(2)} ({getQualityRatingLabel(kpiQualityRating)})
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tổng hợp kết quả đánh giá</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Chi tiết điểm</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Tổng điểm tiêu chí:</span>
                          <span className="font-medium">{totalScore.toFixed(2)}/100</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Tổng điểm:</span>
                          <span>{totalScore.toFixed(2)}/100</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Kết quả xếp loại</h4>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{totalScore.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">Tổng điểm</div>
                        </div>
                        
                        <div className="text-center">
                          {getQualityRatingBadge(getQualityRating(totalScore))}
                          <div className="mt-2 text-sm text-gray-600">
                            {getQualityRatingLabel(getQualityRating(totalScore))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm">
                            <strong>Tiêu chí xếp loại:</strong>
                          </div>
                          <div className="text-xs space-y-1">
                            <div>• Hoàn thành xuất sắc: 90 điểm trở lên</div>
                            <div>• Hoàn thành tốt: 70-89 điểm</div>
                            <div>• Hoàn thành: 50-69 điểm</div>
                            <div>• Không hoàn thành: dưới 50 điểm</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
        </div>
      </DialogContent>
    </Dialog>
  )
} 