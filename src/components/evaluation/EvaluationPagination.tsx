"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { EvaluationPaginationProps } from "@/types/evaluation"

export default function EvaluationPagination({ pagination, onPageChange }: EvaluationPaginationProps) {
  if (!pagination || pagination.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <span className="text-sm text-muted-foreground">
        Trang {pagination.currentPage} / {pagination.totalPages}
      </span>
      <Button 
        variant="outline"
        size="sm" 
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Trước
      </Button>
      <Button 
        variant="outline"
        size="sm" 
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.totalPages}
      >
        Sau
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
} 