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
import { cn } from "@/lib/utils"

interface EvaluationDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  evaluation?: EvaluationForm
}

export default function EvaluationDetailModal({ 
  open, 
  onOpenChange, 
  evaluation 
}: EvaluationDetailModalProps) {
  const [activeTab, setActiveTab] = useState("criteria")
  const [formData, setFormData] = useState({
    politicalPoints: 5,
    ethicsPoints: 5,
    workStylePoints: 5,
    disciplinePoints: 5,
    digitalTransformationPoints: 10,
    leadershipPoints: 10,
    taskPerformancePoints: 70,
    deductionPoints: 0
  })

  const totalPoints = Object.values(formData).reduce((sum, points) => sum + points, 0)

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

  const handlePointsChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const mockWorkDescriptionItems: WorkDescriptionItem[] = [
    {
      id: "1",
      taskName: "Báo cáo công tác chuyển đổi số định kỳ hàng tháng",
      unit: "Thời gian HT",
      target: "25/6/24",
      complexityWeight: ComplexityWeight.LEVEL_4,
      qualityWeight: QualityWeight.LEVEL_4,
      completionLevel: CompletionLevel.ACHIEVED,
      result: "đạt",
      points: 3,
      weightedQualityPoints: 2.4,
      finalPoints: 9.6,
      explanation: "Báo cáo được Lãnh đạo UBND phê duyệt"
    },
    {
      id: "2",
      taskName: "Cập nhật số liệu của phòng lên hệ thống báo cáo của Sở/tỉnh",
      unit: "Thời gian HT",
      target: "29/6/24",
      complexityWeight: ComplexityWeight.LEVEL_2,
      qualityWeight: QualityWeight.LEVEL_3,
      completionLevel: CompletionLevel.NOT_ACHIEVED,
      result: "chưa đạt",
      points: 1,
      weightedQualityPoints: 0.6,
      finalPoints: 1.2,
      explanation: "VB được LĐ phòng phê duyệt"
    },
    {
      id: "3",
      taskName: "Xây dựng KH ngày CĐS Quốc gia năm 2024",
      unit: "Thời gian HT",
      target: "25/6/24",
      complexityWeight: ComplexityWeight.LEVEL_4,
      qualityWeight: QualityWeight.LEVEL_5,
      completionLevel: CompletionLevel.EXCEEDED,
      result: "đạt vượt",
      points: 4,
      weightedQualityPoints: 4,
      finalPoints: 16,
      explanation: "VB được LĐ UBND phê duyệt"
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            PHIẾU ĐÁNH GIÁ, XẾP LOẠI HÀNG THÁNG
          </DialogTitle>
          <DialogDescription>
            Tháng: 4/2025 - Họ và tên: Phan Vinh Khang - Đơn vị: Phòng Quản trị nền tảng số và VTTT
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
                  <Input value="Phan Vinh Khang" readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Đơn vị công tác</Label>
                  <Input value="Phòng Quản trị nền tảng số và VTTT" readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Chức vụ</Label>
                  <Input value="Chuyên viên" readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Tháng đánh giá</Label>
                  <Input value="4/2025" readOnly className="mt-1" />
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
              <Card>
                <CardHeader>
                  <CardTitle>Nhóm chỉ tiêu về chính trị, tư tưởng; Đạo đức, lối sống; Tác phong, lề lối làm việc; Ý thức tổ chức kỷ luật; Thực hiện chuyển đổi số và cải cách hành chính</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {EVALUATION_CRITERIA.slice(0, 5).map((criteria) => (
                    <div key={criteria.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">
                          {criteria.name} ({criteria.maxPoints} điểm)
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max={criteria.maxPoints}
                            value={formData[`${criteria.id}Points` as keyof typeof formData] || 0}
                            onChange={(e) => handlePointsChange(`${criteria.id}Points`, Number(e.target.value))}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">/ {criteria.maxPoints}</span>
                        </div>
                      </div>
                      {criteria.description && (
                        <p className="text-sm text-gray-600">{criteria.description}</p>
                      )}
                      {criteria.subCriteria && (
                        <div className="ml-4 space-y-1">
                          {criteria.subCriteria.map((sub) => (
                            <div key={sub.id} className="text-sm text-gray-600">
                              • {sub.name} ({sub.maxPoints} điểm)
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nhóm các tiêu chí về kết quả thực hiện nhiệm vụ, chức trách được giao</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {EVALUATION_CRITERIA.slice(5).map((criteria) => (
                    <div key={criteria.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">
                          {criteria.name} ({criteria.maxPoints} điểm)
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max={criteria.maxPoints}
                            value={formData[`${criteria.id}Points` as keyof typeof formData] || 0}
                            onChange={(e) => handlePointsChange(`${criteria.id}Points`, Number(e.target.value))}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">/ {criteria.maxPoints}</span>
                        </div>
                      </div>
                      {criteria.description && (
                        <p className="text-sm text-gray-600">{criteria.description}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Điểm trừ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Điểm trừ</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={formData.deductionPoints}
                        onChange={(e) => handlePointsChange("deductionPoints", Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-500">điểm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                          <TableHead>TT</TableHead>
                          <TableHead>Nhiệm vụ, công việc</TableHead>
                          <TableHead>ĐVT</TableHead>
                          <TableHead>Mục tiêu</TableHead>
                          <TableHead>Trọng số phức tạp</TableHead>
                          <TableHead>Kết quả</TableHead>
                          <TableHead>Điểm</TableHead>
                          <TableHead>Trọng số chất lượng</TableHead>
                          <TableHead>Điểm có trọng số</TableHead>
                          <TableHead>Điểm cuối cùng</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockWorkDescriptionItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="max-w-xs">{item.taskName}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.target}</TableCell>
                            <TableCell className="text-center">{item.complexityWeight}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {item.result}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{item.points}</TableCell>
                            <TableCell className="text-center">{item.qualityWeight}</TableCell>
                            <TableCell className="text-center">{item.weightedQualityPoints}</TableCell>
                            <TableCell className="text-center font-medium">{item.finalPoints}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mt-4">
                    <div className="text-lg font-semibold">
                      Tổng điểm: 26.8
                    </div>
                    <div className="text-lg font-semibold">
                      Điểm KPI: 2.68 (Đạt)
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
                          <span>Chính trị tư tưởng:</span>
                          <span className="font-medium">{formData.politicalPoints}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Đạo đức, lối sống:</span>
                          <span className="font-medium">{formData.ethicsPoints}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tác phong, lề lối làm việc:</span>
                          <span className="font-medium">{formData.workStylePoints}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ý thức tổ chức kỷ luật:</span>
                          <span className="font-medium">{formData.disciplinePoints}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Chuyển đổi số và cải cách hành chính:</span>
                          <span className="font-medium">{formData.digitalTransformationPoints}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Năng lực lãnh đạo, quản lý:</span>
                          <span className="font-medium">{formData.leadershipPoints}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kết quả thực hiện nhiệm vụ:</span>
                          <span className="font-medium">{formData.taskPerformancePoints}/70</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span>Điểm trừ:</span>
                          <span className="font-medium text-red-600">-{formData.deductionPoints}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Tổng điểm:</span>
                          <span>{totalPoints}/100</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Kết quả xếp loại</h4>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
                          <div className="text-sm text-gray-600">Tổng điểm</div>
                        </div>
                        
                        <div className="text-center">
                          {getQualityRatingBadge(getQualityRating(totalPoints))}
                          <div className="mt-2 text-sm text-gray-600">
                            {getQualityRatingLabel(getQualityRating(totalPoints))}
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