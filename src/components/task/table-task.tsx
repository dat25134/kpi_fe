import { Task } from "@/types/task"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip } from "antd";
import { getAvatarFromName } from "@/lib/utils";

export default function TableTask({ tasks }: { tasks: Task[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead className="w-24 text-center hidden md:table-cell">Trọng số</TableHead>
                    <TableHead className="w-28 hidden md:table-cell">Hạn xử lý</TableHead>
                    <TableHead className="w-28 hidden md:table-cell">Ngày tạo</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {(!tasks || tasks.length === 0) ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-8">Không có dữ liệu để hiển thị</TableCell>
                    </TableRow>
                ) : (
                    tasks?.map((task: Task) => (
                        <TableRow key={task.id}>
                            <TableCell>
                                <input type="checkbox" className="rounded" />
                            </TableCell>
                            <TableCell>{task.id}</TableCell>
                            <TableCell>
                                <div className="flex">
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
                                    <div className="break-words whitespace-normal flex-1">
                                        {task.content}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center hidden md:table-cell">{task.count}</TableCell>
                            <TableCell className="text-red-500 hidden md:table-cell">{task.deadline}</TableCell>
                            <TableCell className="hidden md:table-cell">{task.createdAt}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}