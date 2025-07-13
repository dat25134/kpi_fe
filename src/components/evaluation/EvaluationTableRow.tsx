import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FileText, Trash2 } from "lucide-react"
import { cn, getStatusBadgeVariant, getStatusLabel, getStatusType, getEvaluationTableRowData } from "@/lib/utils"
import { Evaluation } from "@/types/evaluation"
import QualityRatingBadge from "./QualityRatingBadge"

interface EvaluationTableRowProps {
  item: Evaluation
  index: number
  onView: (id: string) => void
  onDelete: (id: number) => void
}

export default function EvaluationTableRow({ 
  item, 
  index, 
  onView, 
  onDelete 
}: EvaluationTableRowProps) {
  const rowData = getEvaluationTableRowData(item, index)

  return (
    <TableRow key={rowData.id} className="hover:bg-gray-50">
      <TableCell className="text-center">{rowData.index}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
              {rowData.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{rowData.name}</div>
            <div className="text-sm text-gray-500">{rowData.department}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {rowData.roleName}
        </Badge>
      </TableCell>
      <TableCell>{rowData.period}</TableCell>
      <TableCell className="text-center font-medium">
        {rowData.totalScore}/100
      </TableCell>
      <TableCell>
        <QualityRatingBadge rating={rowData.finalGrade} />
      </TableCell>
      <TableCell>
        <Badge className={cn("font-normal", getStatusBadgeVariant(getStatusType(rowData.status)))}>
          {getStatusLabel(rowData.status)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => onView(rowData.id.toString())}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 text-red-600"
            onClick={() => onDelete(rowData.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
} 