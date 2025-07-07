"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, Settings } from "lucide-react"
import type { EvaluationActionsProps } from "@/types/evaluation"

export default function EvaluationActions({ 
  onCreateEvaluation, 
  onRefresh,
  showCreateButton = true
}: Omit<EvaluationActionsProps, 'onViewWorkDescription' | 'showWorkDescriptionButton'>) {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <div className="flex items-center gap-2">
        {showCreateButton && (
          <Button size="sm" variant="outline" onClick={onCreateEvaluation}>
            <Plus className="h-4 w-4 mr-1" />
            Tạo phiếu đánh giá
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 