"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calculator, Save } from "lucide-react"
import { type WorkDescriptionItem } from "@/types/evaluation"
import WorkItemTable from "./WorkItemTable"
import WorkItemSummary from "./WorkItemSummary"
import WorkItemForm from "./WorkItemForm"

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
      id: 1,
      task_status: "completed",
      task_start_date: "2024-01-01",
      task_due_date: "2024-06-25",
      task_weight: 4,
      task_title: "Báo cáo công tác chuyển đổi số định kỳ hàng tháng",
      task_description: "Báo cáo được Lãnh đạo UBND phê duyệt",
      unit: "Thời gian HT",
      target: "25/6/24",
      complexity_weight: 4,
      quality_weight: 4,
      result_level: 3,
      result_score: "3",
      final_score: "9.6",
      explanation: "Báo cáo được Lãnh đạo UBND phê duyệt",
      order: 1
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<WorkDescriptionItem> | null>(null)

  const handleAddWorkItem = (item: WorkDescriptionItem) => {
    setWorkItems([...workItems, item])
    setShowAddForm(false)
    setEditingItem(null)
  }

  const handleEditWorkItem = (id: number, field?: string, value?: any) => {
    if (field && value !== undefined) {
      // Inline editing
      setWorkItems(workItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          
          // Recalculate points if needed
          if (field === 'result_level' || field === 'quality_weight' || field === 'complexity_weight') {
            const points = field === 'result_level' ? value : item.result_level
            const qualityWeight = field === 'quality_weight' ? value : item.quality_weight
            const complexityWeight = field === 'complexity_weight' ? value : item.complexity_weight
            
            const weightedQualityPoints = (points * qualityWeight) / 5
            const finalPoints = weightedQualityPoints * complexityWeight
            
            return {
              ...updatedItem,
              result_score: points.toString(),
              final_score: finalPoints.toFixed(1)
            }
          }
          
          return updatedItem
        }
        return item
      }))
    } else {
      // Open form for editing
      const item = workItems.find(item => item.id === id)
      if (item) {
        setEditingItem(item)
        setShowAddForm(true)
      }
    }
  }

  const handleUpdateWorkItem = (item: WorkDescriptionItem) => {
    setWorkItems(workItems.map(workItem => 
      workItem.id === item.id ? item : workItem
    ))
    setShowAddForm(false)
    setEditingItem(null)
  }

  const handleDeleteWorkItem = (id: number) => {
    setWorkItems(workItems.filter(item => item.id !== id))
  }

  const handleSaveWorkItem = (item: WorkDescriptionItem) => {
    if (editingItem) {
      handleUpdateWorkItem(item)
    } else {
      handleAddWorkItem(item)
    }
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
          <WorkItemTable
            items={workItems}
            onEdit={handleEditWorkItem}
            onDelete={handleDeleteWorkItem}
            isReadOnly={false}
          />

          {/* Summary */}
          <WorkItemSummary items={workItems} />

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

        {/* Add/Edit Work Item Modal */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Sửa công việc' : 'Thêm công việc mới'}
              </DialogTitle>
            </DialogHeader>
            <WorkItemForm
              item={editingItem || {}}
              onSave={handleSaveWorkItem}
              onCancel={() => {
                setShowAddForm(false)
                setEditingItem(null)
              }}
              isEditing={!!editingItem}
            />
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
} 