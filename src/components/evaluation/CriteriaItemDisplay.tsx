import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { EvaluationCriteriaItemDisplayProps } from "@/types/evaluation"

export default function CriteriaItemDisplay({
  criteria,
  categoryId,
  roleId,
  onEdit,
  onDelete
}: EvaluationCriteriaItemDisplayProps) {
  return (
    <div className="bg-gray-50 rounded p-3 flex items-center">
      <div className="flex-1">
        <div className="font-semibold text-sm mb-1">
          #{criteria.order} {criteria.name}
        </div>
        <div className="text-xs text-gray-600 mb-1">
          {criteria.description}
        </div>
        <div className="text-xs text-gray-500">
          Điểm tối đa: {criteria.max_score} &nbsp;|&nbsp; Trọng số: {criteria.weight}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-blue-600"
        onClick={() => onEdit({ ...criteria, categoryId, roleId })}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-600"
        onClick={() => onDelete({ ...criteria, categoryId })}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
} 