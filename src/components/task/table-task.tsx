import { Task } from "@/types/task"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip } from "antd";
import { formatDate, getAvatarFromName } from "@/lib/utils";
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import SubTaskRows from "./SubTaskRows";

function getAllVisibleTaskAndSubtaskIds(tasks: Task[], expandedTaskIds: number[]): number[] {
  const ids: number[] = [];
  tasks.forEach(task => {
    ids.push(task.id);
    if (task.subtasks && task.subtasks.length > 0 && expandedTaskIds.includes(task.id)) {
      ids.push(...task.subtasks.map(st => st.id));
    }
  });
  return ids;
}

export default function TableTask({ tasks, onRowClick, pagination, selectedTaskIds = [], onSelectTaskIds, onAddSubTask }: { tasks: Task[], onRowClick?: (task: Task) => void, pagination?: any, selectedTaskIds?: number[], onSelectTaskIds?: (ids: number[]) => void, onAddSubTask?: (task: Task) => void }) {
  const [expandedTaskIds, setExpandedTaskIds] = useState<number[]>([]);
  const toggleExpand = (taskId: number) => {
    setExpandedTaskIds(ids =>
      ids.includes(taskId) ? ids.filter(id => id !== taskId) : [...ids, taskId]
    );
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <input
                type="checkbox"
                className="rounded"
                checked={tasks?.length > 0 && selectedTaskIds?.length === getAllVisibleTaskAndSubtaskIds(tasks, expandedTaskIds).length}
                ref={(input) => {
                  if (input) {
                    input.indeterminate =
                      selectedTaskIds.length > 0 &&
                      selectedTaskIds.length < getAllVisibleTaskAndSubtaskIds(tasks, expandedTaskIds).length;
                  }
                }}
                onChange={e => {
                  if (!onSelectTaskIds) return;
                  if (e.target.checked) {
                    onSelectTaskIds(getAllVisibleTaskAndSubtaskIds(tasks, expandedTaskIds));
                  } else {
                    onSelectTaskIds([]);
                  }
                }}
              />
            </TableHead>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead className="w-24 text-center hidden md:table-cell">Trọng số</TableHead>
            <TableHead className="w-28 hidden md:table-cell">Ngày bắt đầu</TableHead>
            <TableHead className="w-28 hidden md:table-cell">Hạn xử lý</TableHead>
            <TableHead className="w-28 hidden md:table-cell">Ngày tạo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(!tasks || tasks.length === 0) ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">Không có dữ liệu để hiển thị</TableCell>
            </TableRow>
          ) : (
            tasks?.map((task: Task, i) => {
              const subtasksArr = task.subtasks ?? [];
              const hasSubtasks = subtasksArr.length > 0;
              const completedSubtasks = subtasksArr.filter(st => st.status === 'completed').length;
              return (
                <React.Fragment key={task.id}>
                  <TableRow key={task.id} className={`hover:bg-blue-50 ${task.status === 'completed' ? 'bg-green-50' : ''}`}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedTaskIds.includes(task.id)}
                        onChange={e => {
                          if (!onSelectTaskIds) return;
                          if (e.target.checked) {
                            onSelectTaskIds([...selectedTaskIds, task.id])
                          } else {
                            onSelectTaskIds(selectedTaskIds.filter(id => id !== task.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {pagination && pagination.currentPage && pagination.itemsPerPage
                        ? (pagination.currentPage - 1) * pagination.itemsPerPage + i + 1
                        : i + 1
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start">
                        <div className="flex flex-col items-center justify-center min-w-[56px] max-w-[56px] mr-3">
                          {task.mainHandler && (
                            <Tooltip title={`Xử lý chính: ${task.mainHandler.name}`} placement="top">
                              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-base font-bold cursor-default mb-1">
                                {getAvatarFromName(task.mainHandler.name)}
                              </div>
                            </Tooltip>
                          )}
                        </div>
                        <div className="flex flex-col min-w-[60px] max-w-[130px] mr-3 w-full">
                          {task?.category && (
                            <span className={`block bg-${task?.category?.color}-100 text-${task?.category?.color}-800 text-xs px-2 py-0.5 rounded mb-1`}>
                              {String(task?.category?.display_name)}
                            </span>
                          )}
                          {task.assignees.length > 0 && (
                            <div>
                              <span className="text-sm text-gray-500">Phối hợp: </span>
                              {(() => {
                                const MAX_DISPLAY = 3;
                                const displayedAssignees = task.assignees.slice(0, MAX_DISPLAY);
                                const hiddenCount = task.assignees.length - MAX_DISPLAY;
                                return (
                                  <>
                                    {displayedAssignees.map((assignee: any, index: number) => (
                                      <span
                                        title={assignee.name}
                                        key={index}
                                        className={
                                          "inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs " +
                                          (index > 0 ? "-ml-2 border-2 border-white" : "")
                                        }
                                      >
                                        {getAvatarFromName(assignee.name)}
                                      </span>
                                    ))}
                                    {hiddenCount > 0 && (
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs -ml-2 border-2 border-white">
                                        +{hiddenCount}
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                        <div
                          className="break-words whitespace-normal flex-1"
                        >
                          <div 
                          className="font-medium cursor-pointer hover:underline" 
                          onClick={e => {
                            e.stopPropagation();
                            onRowClick && onRowClick(task);
                          }}>
                            {task.content}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            {hasSubtasks && (
                              <>
                                <span>Subtasks: {completedSubtasks}/{subtasksArr.length}</span>
                                <button
                                  type="button"
                                  className="focus:outline-none"
                                  onClick={e => { e.stopPropagation(); toggleExpand(task.id); }}
                                  title={expandedTaskIds.includes(task.id) ? 'Ẩn task con' : 'Hiện task con'}
                                >
                                  <ChevronRight
                                    size={16}
                                    className={`transition-transform duration-200 ${expandedTaskIds.includes(task.id) ? 'rotate-90' : ''}`}
                                  />
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              className="border border-blue-200 text-blue-600 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-red-50 ml-1 cursor-pointer"
                              onClick={e => { e.stopPropagation(); onAddSubTask && onAddSubTask(task); }}
                              title="Thêm subtask"
                            >
                              <Plus size={14} />
                              <span>Thêm subtask</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">{task.count}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(task.startDate)}</TableCell>
                    <TableCell className="text-red-500 hidden md:table-cell">{formatDate(task.deadline)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(task.createdAt)}
                    </TableCell>
                  </TableRow>
                  {hasSubtasks && expandedTaskIds.includes(task.id) && (
                    <SubTaskRows
                      subtasks={subtasksArr}
                      parentIndex={i}
                      onRowClick={onRowClick}
                      selectedTaskIds={selectedTaskIds}
                      onSelectTaskIds={onSelectTaskIds}
                    />
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}