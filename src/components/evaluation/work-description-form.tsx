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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2, Calculator, Save } from "lucide-react"
import { 
  CompletionLevel, 
  ComplexityWeight,
  QualityWeight,
  type WorkDescriptionItem
} from "@/types/evaluation"
import { cn } from "@/lib/utils"

interface WorkDescriptionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeName?: string
  department?: string
}

export default function WorkDescriptionForm({ 
  open, 
  onOpenChange, 
  employeeName = "Phan Vinh Khang",
  department = "Phòng Quản trị nền tảng số và VTTT"
}: WorkDescriptionFormProps) {
  const [workItems, setWorkItems] = useState<WorkDescriptionItem[]>([
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
    }
  ])

  const [newItem, setNewItem] = useState({
    taskName: "",
    unit: "",
    target: "",
    complexityWeight: ComplexityWeight.LEVEL_2,
    qualityWeight: QualityWeight.LEVEL_3,
    completionLevel: CompletionLevel.ACHIEVED,
    result: "",
    explanation: ""
  })

  const [showAddForm, setShowAddForm] = useState(false)

  const calculatePoints = (completionLevel: CompletionLevel): number => {
    switch (completionLevel) {
      case CompletionLevel.NOT_ACHIEVED:
        return 1
      case CompletionLevel.ACHIEVED_WITH_LIMITATIONS:
        return 2
      case CompletionLevel.ACHIEVED:
        return 3
      case CompletionLevel.EXCEEDED:
        return 4
      default:
        return 3
    }
  }

  const calculateWeightedQualityPoints = (points: number, qualityWeight: QualityWeight): number => {
    return (points * qualityWeight) / 5
  }

  const calculateFinalPoints = (weightedQualityPoints: number, complexityWeight: ComplexityWeight): number => {
    return weightedQualityPoints * complexityWeight
  }

  const getCompletionLevelLabel = (level: CompletionLevel) => {
    switch (level) {
      case CompletionLevel.NOT_ACHIEVED:
        return "Chưa đạt"
      case CompletionLevel.ACHIEVED_WITH_LIMITATIONS:
        return "Đạt, còn hạn chế"
      case CompletionLevel.ACHIEVED:
        return "Đạt"
      case CompletionLevel.EXCEEDED:
        return "Đạt vượt mức"
      default:
        return "Không xác định"
    }
  }

  const getCompletionLevelBadge = (level: CompletionLevel) => {
    const variants = {
      [CompletionLevel.NOT_ACHIEVED]: "bg-red-100 text-red-800",
      [CompletionLevel.ACHIEVED_WITH_LIMITATIONS]: "bg-yellow-100 text-yellow-800",
      [CompletionLevel.ACHIEVED]: "bg-green-100 text-green-800",
      [CompletionLevel.EXCEEDED]: "bg-blue-100 text-blue-800"
    }

    return (
      <Badge className={cn("font-normal", variants[level])}>
        {getCompletionLevelLabel(level)}
      </Badge>
    )
  }

  const addWorkItem = () => {
    const points = calculatePoints(newItem.completionLevel)
    const weightedQualityPoints = calculateWeightedQualityPoints(points, newItem.qualityWeight)
    const finalPoints = calculateFinalPoints(weightedQualityPoints, newItem.complexityWeight)

    const item: WorkDescriptionItem = {
      id: Date.now().toString(),
      taskName: newItem.taskName,
      unit: newItem.unit,
      target: newItem.target,
      complexityWeight: newItem.complexityWeight,
      qualityWeight: newItem.qualityWeight,
      completionLevel: newItem.completionLevel,
      result: newItem.result,
      points,
      weightedQualityPoints,
      finalPoints,
      explanation: newItem.explanation
    }

    setWorkItems([...workItems, item])
    setNewItem({
      taskName: "",
      unit: "",
      target: "",
      complexityWeight: ComplexityWeight.LEVEL_2,
      qualityWeight: QualityWeight.LEVEL_3,
      completionLevel: CompletionLevel.ACHIEVED,
      result: "",
      explanation: ""
    })
    setShowAddForm(false)
  }

  const removeWorkItem = (id: string) => {
    setWorkItems(workItems.filter(item => item.id !== id))
  }

  const updateWorkItem = (id: string, field: keyof WorkDescriptionItem, value: any) => {
    setWorkItems(workItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        
        // Recalculate points if completion level changed
        if (field === 'completionLevel') {
          const points = calculatePoints(value)
          const weightedQualityPoints = calculateWeightedQualityPoints(points, updatedItem.qualityWeight)
          const finalPoints = calculateFinalPoints(weightedQualityPoints, updatedItem.complexityWeight)
          
          return {
            ...updatedItem,
            points,
            weightedQualityPoints,
            finalPoints
          }
        }
        
        // Recalculate if quality weight changed
        if (field === 'qualityWeight') {
          const weightedQualityPoints = calculateWeightedQualityPoints(updatedItem.points, value)
          const finalPoints = calculateFinalPoints(weightedQualityPoints, updatedItem.complexityWeight)
          
          return {
            ...updatedItem,
            weightedQualityPoints,
            finalPoints
          }
        }
        
        // Recalculate if complexity weight changed
        if (field === 'complexityWeight') {
          const finalPoints = calculateFinalPoints(updatedItem.weightedQualityPoints, value)
          
          return {
            ...updatedItem,
            finalPoints
          }
        }
        
        return updatedItem
      }
      return item
    }))
  }

  const totalFinalPoints = workItems.reduce((sum, item) => sum + item.finalPoints, 0)
  const totalComplexityWeight = workItems.reduce((sum, item) => sum + item.complexityWeight, 0)
  const kpiScore = totalComplexityWeight > 0 ? totalFinalPoints / totalComplexityWeight : 0

  const getKPIRating = (score: number) => {
    if (score < 2.2) return "Không đạt"
    if (score < 2.7) return "Đạt, còn hạn chế"
    if (score < 3.4) return "Đạt"
    return "Đạt vượt mức"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            BẢNG MÔ TẢ CÔNG VIỆC (KPIs)
          </DialogTitle>
          <DialogDescription>
            Thống kê chi tiết từng công việc, nhiệm vụ và đo lường bằng sản phẩm cụ thể
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Họ và tên</Label>
                  <Input value={employeeName} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Phòng/bộ phận/đơn vị</Label>
                  <Input value={department} readOnly className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Items Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh sách công việc, nhiệm vụ</CardTitle>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm công việc
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">TT</TableHead>
                      <TableHead>Nhiệm vụ, công việc</TableHead>
                      <TableHead className="w-24">ĐVT</TableHead>
                      <TableHead className="w-24">Mục tiêu</TableHead>
                      <TableHead className="w-32">Trọng số phức tạp</TableHead>
                      <TableHead className="w-32">Kết quả</TableHead>
                      <TableHead className="w-16">Điểm</TableHead>
                      <TableHead className="w-32">Trọng số chất lượng</TableHead>
                      <TableHead className="w-32">Điểm có trọng số</TableHead>
                      <TableHead className="w-32">Điểm cuối cùng</TableHead>
                      <TableHead className="w-20">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="max-w-xs">
                          <Input
                            value={item.taskName}
                            onChange={(e) => updateWorkItem(item.id, 'taskName', e.target.value)}
                            className="border-0 p-0 h-auto"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.unit}
                            onChange={(e) => updateWorkItem(item.id, 'unit', e.target.value)}
                            className="border-0 p-0 h-auto"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.target}
                            onChange={(e) => updateWorkItem(item.id, 'target', e.target.value)}
                            className="border-0 p-0 h-auto"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.complexityWeight.toString()}
                            onValueChange={(value) => updateWorkItem(item.id, 'complexityWeight', Number(value))}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Đơn giản</SelectItem>
                              <SelectItem value="2">2 - Trung bình</SelectItem>
                              <SelectItem value="3">3 - Phức tạp</SelectItem>
                              <SelectItem value="4">4 - Rất phức tạp</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.completionLevel}
                            onValueChange={(value) => updateWorkItem(item.id, 'completionLevel', value as CompletionLevel)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={CompletionLevel.NOT_ACHIEVED}>Chưa đạt</SelectItem>
                              <SelectItem value={CompletionLevel.ACHIEVED_WITH_LIMITATIONS}>Đạt, còn hạn chế</SelectItem>
                              <SelectItem value={CompletionLevel.ACHIEVED}>Đạt</SelectItem>
                              <SelectItem value={CompletionLevel.EXCEEDED}>Đạt vượt mức</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center font-medium">{item.points}</TableCell>
                        <TableCell>
                          <Select
                            value={item.qualityWeight.toString()}
                            onValueChange={(value) => updateWorkItem(item.id, 'qualityWeight', Number(value))}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Thấp</SelectItem>
                              <SelectItem value="2">2 - Trung bình thấp</SelectItem>
                              <SelectItem value="3">3 - Trung bình</SelectItem>
                              <SelectItem value="4">4 - Trung bình cao</SelectItem>
                              <SelectItem value="5">5 - Cao</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">{item.weightedQualityPoints.toFixed(1)}</TableCell>
                        <TableCell className="text-center font-medium">{item.finalPoints.toFixed(1)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => removeWorkItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tổng hợp kết quả</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalFinalPoints.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Tổng điểm có trọng số</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{totalComplexityWeight}</div>
                  <div className="text-sm text-gray-600">Tổng trọng số phức tạp</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{kpiScore.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Điểm KPI</div>
                  <Badge className="mt-1">{getKPIRating(kpiScore)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
            <Button>
              <Calculator className="h-4 w-4 mr-2" />
              Tính KPI
            </Button>
          </div>
        </div>

        {/* Add Work Item Modal */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm công việc mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tên công việc, nhiệm vụ</Label>
                <Textarea
                  value={newItem.taskName}
                  onChange={(e) => setNewItem({...newItem, taskName: e.target.value})}
                  placeholder="Nhập tên công việc..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Đơn vị tính</Label>
                  <Input
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    placeholder="VD: Thời gian HT"
                  />
                </div>
                <div>
                  <Label>Mục tiêu</Label>
                  <Input
                    value={newItem.target}
                    onChange={(e) => setNewItem({...newItem, target: e.target.value})}
                    placeholder="VD: 25/6/24"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Trọng số phức tạp</Label>
                  <Select
                    value={newItem.complexityWeight.toString()}
                    onValueChange={(value) => setNewItem({...newItem, complexityWeight: Number(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Đơn giản</SelectItem>
                      <SelectItem value="2">2 - Trung bình</SelectItem>
                      <SelectItem value="3">3 - Phức tạp</SelectItem>
                      <SelectItem value="4">4 - Rất phức tạp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Trọng số chất lượng</Label>
                  <Select
                    value={newItem.qualityWeight.toString()}
                    onValueChange={(value) => setNewItem({...newItem, qualityWeight: Number(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Thấp</SelectItem>
                      <SelectItem value="2">2 - Trung bình thấp</SelectItem>
                      <SelectItem value="3">3 - Trung bình</SelectItem>
                      <SelectItem value="4">4 - Trung bình cao</SelectItem>
                      <SelectItem value="5">5 - Cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Kết quả đạt được</Label>
                <Select
                  value={newItem.completionLevel}
                  onValueChange={(value) => setNewItem({...newItem, completionLevel: value as CompletionLevel})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CompletionLevel.NOT_ACHIEVED}>Chưa đạt</SelectItem>
                    <SelectItem value={CompletionLevel.ACHIEVED_WITH_LIMITATIONS}>Đạt, còn hạn chế</SelectItem>
                    <SelectItem value={CompletionLevel.ACHIEVED}>Đạt</SelectItem>
                    <SelectItem value={CompletionLevel.EXCEEDED}>Đạt vượt mức</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Diễn giải kết quả</Label>
                <Textarea
                  value={newItem.explanation}
                  onChange={(e) => setNewItem({...newItem, explanation: e.target.value})}
                  placeholder="Giải thích chi tiết kết quả đạt được..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Hủy
                </Button>
                <Button onClick={addWorkItem}>
                  Thêm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
} 