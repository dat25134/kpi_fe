import { TabsContent } from "@/components/ui/tabs"
import { EvaluationFilterBarProps, EvaluationTableProps } from "@/types/evaluation"
import EvaluationFilterBar from "./EvaluationFilterBar"
import EvaluationActions from "./EvaluationActions"
import EvaluationTable from "./EvaluationTable"
import EvaluationPagination from "./EvaluationPagination"

interface EvaluationTabContentProps {
  tabValue: string
  filterProps: EvaluationFilterBarProps
  tableProps: EvaluationTableProps
  pagination: any
  onPageChange: (page: number) => void
  onCreateEvaluation: () => void
  onRefresh: () => void
  showCreateButton?: boolean
}

export default function EvaluationTabContent({
  tabValue,
  filterProps,
  tableProps,
  pagination,
  onPageChange,
  onCreateEvaluation,
  onRefresh,
  showCreateButton = true
}: EvaluationTabContentProps) {
  return (
    <TabsContent value={tabValue} className="space-y-4">
      {/* Filter Bar */}
      <EvaluationFilterBar {...filterProps} />
      
      {/* Header Actions */}
      <EvaluationActions
        onCreateEvaluation={onCreateEvaluation}
        onRefresh={onRefresh}
        showCreateButton={showCreateButton}
      />

      {/* Evaluation Table */}
      <div className="overflow-x-auto">
        <EvaluationTable {...tableProps} />
      </div>

      {/* Pagination */}
      {pagination && (
        <EvaluationPagination
          pagination={pagination}
          onPageChange={onPageChange}
        />
      )}
    </TabsContent>
  )
} 