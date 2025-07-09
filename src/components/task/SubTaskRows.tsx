import { Task } from "@/types/task";
import { TableRow, TableCell } from "@/components/ui/table";
import { getAvatarFromName, formatDate } from "@/lib/utils";

export default function SubTaskRows({ subtasks, parentIndex, onRowClick, selectedTaskIds = [], onSelectTaskIds }: {
  subtasks: Task[],
  parentIndex: number,
  onRowClick?: (task: Task) => void,
  selectedTaskIds?: number[],
  onSelectTaskIds?: (ids: number[]) => void
}) {
  if (!subtasks || subtasks.length === 0) return null;
  return (
    <>
      {subtasks.map((sub, idx) => (
        <TableRow
          key={sub.id}
          className={
            `${sub.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'} text-sm`
          }
        >
          <TableCell>
            <input
              type="checkbox"
              className="rounded"
              checked={selectedTaskIds.includes(sub.id)}
              onChange={e => {
                if (!onSelectTaskIds) return;
                if (e.target.checked) {
                  onSelectTaskIds([...selectedTaskIds, sub.id])
                } else {
                  onSelectTaskIds(selectedTaskIds.filter(id => id !== sub.id))
                }
              }}
            />
          </TableCell>
          <TableCell>{`${parentIndex + 1}.${idx + 1}`}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2 pl-6">
              {sub.mainHandler && (
                <span className="w-7 h-7 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs font-bold">
                  {getAvatarFromName(sub.mainHandler.name)}
                </span>
              )}
              <span className="break-words whitespace-normal flex-1 cursor-pointer hover:underline" onClick={e => { e.stopPropagation(); onRowClick && onRowClick(sub); }}>{sub.content}</span>
            </div>
            {sub.assignees && sub.assignees.length > 0 && (
              <div className="pl-6">
                <span className="text-xs text-gray-500">Phối hợp: </span>
                {(() => {
                  const MAX_DISPLAY = 3;
                  const displayedAssignees = sub.assignees.slice(0, MAX_DISPLAY);
                  const hiddenCount = sub.assignees.length - MAX_DISPLAY;
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
          </TableCell>
          <TableCell className="text-center hidden md:table-cell">{sub.count}</TableCell>
          <TableCell className="hidden md:table-cell">{formatDate(sub.startDate)}</TableCell>
          <TableCell className="text-red-500 hidden md:table-cell">{formatDate(sub.deadline)}</TableCell>
          <TableCell className="hidden md:table-cell">{formatDate(sub.createdAt)}</TableCell>
        </TableRow>
      ))}
    </>
  );
} 