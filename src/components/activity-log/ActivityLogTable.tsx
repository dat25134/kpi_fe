import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, User, Clock } from "lucide-react";
import type { ActivityLogTableProps } from "@/types/activity-log";
import React from "react";

export function ActivityLogTable({
  logs,
  loading,
  getActionIcon,
  getActionColor,
  getActionText,
  getModelName,
  getLogContent,
  getUserName,
  formatDate,
  pagination,
}: ActivityLogTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">#</TableHead>
            <TableHead className="w-[120px]">Hành động</TableHead>
            <TableHead className="w-[150px]">Loại đối tượng</TableHead>
            <TableHead className="w-[80px]">Đối tượng</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead className="w-[150px]">Người thực hiện</TableHead>
            <TableHead className="w-[140px]">Thời gian</TableHead>
            <TableHead className="w-[80px]">Log</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Đang tải dữ liệu...
                </div>
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/50">
                <TableCell>
                  {pagination && pagination.currentPage && pagination.itemsPerPage
                    ? (pagination.currentPage - 1) * pagination.itemsPerPage + logs.indexOf(log) + 1
                    : logs.indexOf(log) + 1
                  }
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getActionIcon(log.description)}
                    <Badge className={`${getActionColor(log.description)} text-xs`}>
                      {getActionText(log.description)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {getModelName(log.subject_type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">#{log.subject_id}</TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate text-sm" title={getLogContent(log)}>
                    {getLogContent(log)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate max-w-[120px]" title={getUserName(log.causer_id)}>
                      {getUserName(log.causer_id)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(log.created_at)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {log.log_name}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 