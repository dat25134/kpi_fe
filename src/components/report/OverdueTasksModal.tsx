import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

export interface OverdueTask {
  id: number;
  name: string;
  department: string;
  overdueDays: number;
  assignee: string;
}

interface OverdueTasksModalProps {
  open: boolean;
  onClose: () => void;
  tasks: OverdueTask[];
}

export default function OverdueTasksModal({ open, onClose, tasks }: OverdueTasksModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Công việc quá hạn</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-4">Không có công việc quá hạn</div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div>
                      <div
                        className="font-semibold text-base line-clamp-2 cursor-pointer"
                        title={task.name}
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'normal'
                        }}
                      >
                        {task.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="mr-3">Phòng: <span className="font-medium">{task.department}</span></span>
                        <span>Phụ trách: <span className="font-medium">{task.assignee}</span></span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-block bg-red-100 text-red-700 font-bold text-sm px-3 py-1 rounded-full min-w-[80px] text-center">
                    {task.overdueDays} ngày
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
} 