import { Button } from "@/components/ui/button"
import { Edit, Plus, Settings, Trash2 } from "lucide-react"
import { EvaluationCriteriaCategoryDisplayProps } from "@/types/evaluation"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import CriteriaItemDisplay from "@/components/evaluation/CriteriaItemDisplay"

export default function CriteriaCategoryDisplay({
  category,
  onEditCategory,
  onDeleteCategory,
  onCreateCriteria,
  onEditCriteria,
  onDeleteCriteria
}: EvaluationCriteriaCategoryDisplayProps) {
  const totalMaxScore = category.evaluation_criteria.reduce(
    (sum, c) => sum + parseFloat(c.max_score), 0
  )

  return (
    <div className="bg-white rounded shadow-sm p-4 border border-gray-200">
      <div className="flex flex md:flex-row md:items-center md:mb-2 gap-2 md:gap-0">
        <div className="flex-1 flex flex-col md:flex-row md:items-center">
          <span className="font-semibold text-base mr-2">{category.name}</span>
          <span className="text-xs text-gray-500 md:ml-2">
            ({category.evaluation_criteria.length} tiêu chí)
          </span>
          <span className="text-xs text-blue-600 md:ml-4">
            Tối đa: {totalMaxScore} điểm
          </span>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0 md:ml-auto">
          <Button 
            className="bg-blue-600 text-white" 
            size="sm" 
            onClick={() => onCreateCriteria(category.id)}
          >
            <Plus className="w-4 h-4 mr-1" /> 
            <span className="hidden sm:inline">Tạo tiêu chí</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditCategory({ id: category.id, name: category.name })}>
                <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteCategory({ id: category.id, name: category.name })} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-2">
        {category.evaluation_criteria.map((criteria) => (
          <CriteriaItemDisplay
            key={criteria.id}
            criteria={criteria}
            categoryId={category.id}
            roleId={category.role_id}
            onEdit={onEditCriteria}
            onDelete={onDeleteCriteria}
          />
        ))}
        {category.evaluation_criteria.length === 0 && (
          <div className="text-xs text-gray-400 italic">
            Chưa có tiêu chí nào
          </div>
        )}
      </div>
    </div>
  )
} 