"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Home, RefreshCw, Settings, User, FileText, Plus, Trash2, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import React from "react"
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
import EvaluationDetailModal from "./evaluation-detail-modal"
import WorkDescriptionForm from "./work-description-form"

// Dữ liệu mẫu cho phiếu đánh giá
const mockEvaluations = [
  {
    id: "1",
    employeeName: "Phan Vinh Khang",
    avatar: "PVK",
    position: "Chuyên viên",
    department: "Phòng Quản trị nền tảng số và VTTT",
    period: "4/2025",
    status: "CHỜ TỰ ĐÁNH GIÁ",
    statusType: "waiting",
    targetType: EvaluationTargetType.STAFF,
    totalPoints: 0,
    qualityRating: QualityRating.ACHIEVED
  },
  {
    id: "2", 
    employeeName: "Lê Hữu Lợi",
    avatar: "LHL",
    position: "Chuyên viên",
    department: "Phòng Quản trị nền tảng số và VTTT",
    period: "3/2025",
    status: "CHỜ TỰ ĐÁNH GIÁ",
    statusType: "waiting",
    targetType: EvaluationTargetType.STAFF,
    totalPoints: 0,
    qualityRating: QualityRating.ACHIEVED
  },
  {
    id: "3",
    employeeName: "Đặng Trần Như Hảo",
    avatar: "ĐTNH",
    position: "Phó phòng",
    department: "Phòng Quản trị nền tảng số và VTTT",
    period: "3/2025",
    status: "CHỜ ĐÁNH GIÁ CẤP 1",
    statusType: "review1",
    targetType: EvaluationTargetType.DEPARTMENT_DEPUTY,
    totalPoints: 0,
    qualityRating: QualityRating.ACHIEVED
  },
  {
    id: "4",
    employeeName: "Đàm Hải Đăng",
    avatar: "ĐHĐ",
    position: "Trưởng phòng",
    department: "Phòng Quản trị nền tảng số và VTTT",
    period: "3/2025",
    status: "CHỜ ĐÁNH GIÁ CẤP 2",
    statusType: "review2",
    targetType: EvaluationTargetType.DEPARTMENT_HEAD,
    totalPoints: 0,
    qualityRating: QualityRating.ACHIEVED
  }
]

// Dữ liệu mẫu cho bảng mô tả công việc
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

export default function EvaluationForm() {
  const [activeTab, setActiveTab] = useState("personal")
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null)
  const [showWorkDescription, setShowWorkDescription] = useState(false)
  const [showEvaluationDetail, setShowEvaluationDetail] = useState(false)
  const [showWorkDescriptionForm, setShowWorkDescriptionForm] = useState(false)
  const [showCreateEvaluation, setShowCreateEvaluation] = useState(false)

  const getStatusBadgeVariant = (statusType: string) => {
    switch (statusType) {
      case "waiting":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "review1":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "review2":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
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

  const getTargetTypeLabel = (type: EvaluationTargetType) => {
    switch (type) {
      case EvaluationTargetType.DEPARTMENT:
        return "Phòng ban"
      case EvaluationTargetType.DEPARTMENT_HEAD:
        return "Trưởng phòng"
      case EvaluationTargetType.DEPARTMENT_DEPUTY:
        return "Phó phòng"
      case EvaluationTargetType.STAFF:
        return "Chuyên viên"
      default:
        return "Không xác định"
    }
  }

  const handleViewEvaluation = (evaluationId: string) => {
    setSelectedEvaluation(evaluationId)
    setShowEvaluationDetail(true)
  }

  const handleViewWorkDescription = () => {
    setShowWorkDescriptionForm(true)
  }

  const handleCreateEvaluation = () => {
    setSelectedEvaluation(null)
    setShowCreateEvaluation(true)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
        </Button>
        <h2 className="text-lg font-medium">Đơn vị hiện tại</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Cá nhân</h3>
            <Button variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50 hover:bg-blue-100">
              <User className="h-4 w-4 mr-2" />
              Phiếu đánh giá cá nhân
            </Button>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Đơn vị phụ trách</h3>
            <Button variant="ghost" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              <span className="truncate" title="Phòng Quản trị nền tảng số và VTTT">
                Phòng Quản trị nền tảng số và VTTT
              </span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 border overflow-x-auto">
          <Tabs defaultValue="personal" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 overflow-x-auto">
              <TabsTrigger
                value="personal"
                className={cn(
                  "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4",
                  activeTab === "personal" ? "text-blue-600" : "",
                )}
              >
                Cá nhân
              </TabsTrigger>
              <TabsTrigger
                value="specialist"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4"
              >
                Chuyên viên
              </TabsTrigger>
              <TabsTrigger
                value="department"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4"
              >
                Phó phòng
              </TabsTrigger>
              <TabsTrigger
                value="manager"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4"
              >
                Trưởng phòng
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              {/* Header Actions */}
              <div className="flex justify-between items-center p-2 border-b">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleCreateEvaluation}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tạo phiếu đánh giá
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleViewWorkDescription}
                  >
                    <Calculator className="h-4 w-4 mr-1" />
                    Bảng mô tả công việc
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Evaluation Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">STT</TableHead>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Loại phiếu</TableHead>
                      <TableHead className="w-28">Thời gian</TableHead>
                      <TableHead className="w-32">Tổng điểm</TableHead>
                      <TableHead className="w-32">Xếp loại</TableHead>
                      <TableHead className="w-40">Trạng thái</TableHead>
                      <TableHead className="w-24">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEvaluations.map((item, index) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                {item.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{item.employeeName}</div>
                              <div className="text-sm text-gray-500">{item.department}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getTargetTypeLabel(item.targetType)}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.period}</TableCell>
                        <TableCell className="text-center font-medium">
                          {item.totalPoints}/100
                        </TableCell>
                        <TableCell>
                          {getQualityRatingBadge(item.qualityRating)}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("font-normal", getStatusBadgeVariant(item.statusType))}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewEvaluation(item.id)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center p-4 text-sm">
                <div>1-4 trên 4 phiếu</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Trước</Button>
                  <Button variant="outline" size="sm">1</Button>
                  <Button variant="outline" size="sm">Sau</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specialist">
              <div className="p-8 text-center text-gray-500">
                Không có phiếu đánh giá chuyên viên
              </div>
            </TabsContent>

            <TabsContent value="department">
              <div className="p-8 text-center text-gray-500">
                Không có phiếu đánh giá phó phòng
              </div>
            </TabsContent>

            <TabsContent value="manager">
              <div className="p-8 text-center text-gray-500">
                Không có phiếu đánh giá trưởng phòng
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Evaluation Detail Modal */}
      <EvaluationDetailModal
        open={showEvaluationDetail}
        onOpenChange={setShowEvaluationDetail}
        evaluation={undefined}
      />

      {/* Work Description Form Modal */}
      <WorkDescriptionForm
        open={showWorkDescriptionForm}
        onOpenChange={setShowWorkDescriptionForm}
        employeeName="Phan Vinh Khang"
        department="Phòng Quản trị nền tảng số và VTTT"
      />

      {/* Evaluation Detail Modal (Tạo mới) */}
      <EvaluationDetailModal
        open={showCreateEvaluation}
        onOpenChange={setShowCreateEvaluation}
        evaluation={undefined}
      />
    </div>
  )
}
