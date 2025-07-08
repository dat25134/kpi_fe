"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type WorkDescriptionItem } from "@/types/evaluation"
import { calculatePoints, calculateWeightedQualityPoints, calculateFinalPoints } from "@/lib/utils"
import type { WorkItemFormProps } from "@/types/evaluation"

export default function WorkItemForm({ 
  item, 
  onSave, 
  onCancel, 
  isEditing = false 
}: WorkItemFormProps) {
  const [formData, setFormData] = useState({
    task_title: item.task_title || "",
    unit: item.unit || "",
    target: item.target || "",
    complexity_weight: item.complexity_weight || 2,
    quality_weight: item.quality_weight || 3,
    result_level: item.result_level || 3,
    explanation: item.explanation || ""
  })

  const handleSubmit = () => {
    const points = calculatePoints(formData.result_level)
    const weightedQualityPoints = calculateWeightedQualityPoints(points, formData.quality_weight)
    const finalPoints = calculateFinalPoints(weightedQualityPoints, formData.complexity_weight)

    const workItem: WorkDescriptionItem = {
      id: item.id || Date.now(),
      task_status: "active",
      task_start_date: new Date().toISOString().split('T')[0],
      task_due_date: new Date().toISOString().split('T')[0],
      task_weight: formData.complexity_weight,
      task_title: formData.task_title,
      task_description: formData.explanation,
      unit: formData.unit,
      target: formData.target,
      complexity_weight: formData.complexity_weight,
      quality_weight: formData.quality_weight,
      result_level: formData.result_level,
      result_score: points.toString(),
      final_score: finalPoints.toFixed(1),
      explanation: formData.explanation,
      order: item.order || 1
    }

    onSave(workItem)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Tên công việc, nhiệm vụ</Label>
        <Textarea
          value={formData.task_title}
          onChange={(e) => setFormData({...formData, task_title: e.target.value})}
          placeholder="Nhập tên công việc..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Đơn vị tính</Label>
          <Input
            value={formData.unit}
            onChange={(e) => setFormData({...formData, unit: e.target.value})}
            placeholder="VD: Thời gian HT"
          />
        </div>
        <div>
          <Label>Mục tiêu</Label>
          <Input
            value={formData.target}
            onChange={(e) => setFormData({...formData, target: e.target.value})}
            placeholder="VD: 25/6/24"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Trọng số phức tạp</Label>
          <Select
            value={formData.complexity_weight.toString()}
            onValueChange={(value) => setFormData({...formData, complexity_weight: Number(value)})}
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
            value={formData.quality_weight.toString()}
            onValueChange={(value) => setFormData({...formData, quality_weight: Number(value)})}
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
          value={formData.result_level.toString()}
          onValueChange={(value) => setFormData({...formData, result_level: Number(value)})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Chưa đạt</SelectItem>
            <SelectItem value="2">Đạt, còn hạn chế</SelectItem>
            <SelectItem value="3">Đạt</SelectItem>
            <SelectItem value="4">Đạt vượt mức</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Diễn giải kết quả</Label>
        <Textarea
          value={formData.explanation}
          onChange={(e) => setFormData({...formData, explanation: e.target.value})}
          placeholder="Giải thích chi tiết kết quả đạt được..."
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button onClick={handleSubmit}>
          {isEditing ? 'Cập nhật' : 'Thêm'}
        </Button>
      </div>
    </div>
  )
} 