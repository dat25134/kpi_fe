"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Select as AntdSelect } from "antd"
import { Category } from "@/types/category"
import { useAllUsers } from "@/hooks/useEmployees"
import { toast } from "sonner"
import { getErrorMessage, getValidationErrors } from "@/services/errorHandler"
import TaskProgressPanel from "./TaskProgressPanel"
import { ProgressItem } from "@/types/task"
import { useProgress } from "@/hooks/useProgress"
import { useDepartmentsListSelect } from "@/hooks/useDepartments"
import { DatePicker, ConfigProvider } from "antd"
import viVN from "antd/es/locale/vi_VN"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/vi"
import { UploadOutlined } from '@ant-design/icons';
import { deleteTaskFile } from "@/services/task"
import ChangeReasonInput from "./ChangeReasonInput";
dayjs.locale("vi")

type AddTaskModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: any) => Promise<void>
  onEditTask?: (id: number, task: any) => Promise<void>
  editingTask?: any
  categories: Category[]
  refreshTasks: () => void
  isCompletedTask?: boolean
}

export default function AddTaskModal({ open, onOpenChange, onAddTask, onEditTask, editingTask, categories, refreshTasks, parentTask, isCompletedTask }: AddTaskModalProps & { parentTask?: { id: number, name: string } | null }) {
  const [content, setContent] = useState("")
  const [deadline, setDeadline] = useState<Dayjs | null>(dayjs(new Date()))
  const [priority, setPriority] = useState(null)
  const [weight, setWeight] = useState(null)
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([])
  const [assigner, setAssigner] = useState<number | undefined>(undefined)
  const [mainHandler, setMainHandler] = useState<number | undefined>(undefined)
  const [mainHandlerError, setMainHandlerError] = useState("")
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()))
  const [startDateError, setStartDateError] = useState("")
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined)
  const { allUsers, loading } = useAllUsers()
  const { data: departments, isLoading: loadingDepartments } = useDepartmentsListSelect()
  const [errorMsg, setErrorMsg] = useState<Record<string, string[]> | null>(null)
  const [status, setStatus] = useState("pending")
  const [progressHistory, setProgressHistory] = useState<ProgressItem[]>([])
  const { updateProgress } = useProgress()
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [deletingFileId, setDeletingFileId] = useState<number | null>(null)
  const [changeReason, setChangeReason] = useState("")
  const [qualityWeight, setQualityWeight] = useState(null)

  // Dữ liệu mẫu cho người phối hợp
  const collaborators = allUsers?.map((employee: any) => ({
    value: employee.id,
    label: employee.name,
    avatar: employee.avatar,
  }))

  // Reset form khi modal đóng
  useEffect(() => {
    if (!open) {
      resetForm();
      setErrorMsg(null);
    }
  }, [open]);

  // Set lại state khi editingTask đổi và modal đang mở
  useEffect(() => {
    if (open && editingTask) {
      setContent(editingTask.content || "");
      setDeadline(editingTask.deadline ? dayjs(editingTask.deadline) : dayjs(new Date()));
      setStartDate(editingTask.startDate ? dayjs(editingTask.startDate) : dayjs(new Date()));
      setPriority(editingTask.category?.id?.toString() || "");
      setWeight(editingTask.count?.toString() || "4");
      setSelectedCollaborators(editingTask.assignees?.map((a: any) => Number(a.id)) || []);
      setAssigner(editingTask.assigner?.id);
      setMainHandler(editingTask.mainHandler?.id);
      setDepartmentId(editingTask.department?.id);
      setMainHandlerError("");
      setStartDateError("");
      setStatus(editingTask.status || "pending");
      setProgressHistory(editingTask?.progressHistory || []);
      setChangeReason("");
      setErrorMsg(null);
      setQualityWeight(editingTask.qualityWeight?.toString() || null)
    } else if (open && parentTask && !editingTask) {
      // Trường hợp tạo subtask: reset form, giữ parentTask
      resetForm();
    }
  }, [editingTask, open, parentTask]);

  const handleCloseModal = () => {
    onOpenChange(false)
    resetForm()
  }

  const handleAddProgress = async (item: ProgressItem) => {
    if (!editingTask?.id) return;
    const newProgress = await updateProgress(editingTask.id, item.contentProgress)
    setProgressHistory(prev => [...prev, newProgress])
    refreshTasks()
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Reset input file để input hiển thị đúng số file đã chọn
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return newFiles;
    });
  };

  const handleDeleteAttachedFile = async (fileId: number) => {
    if (!editingTask?.id) return;
    
    try {
      setDeletingFileId(fileId);
      await deleteTaskFile(editingTask.id, fileId);
      
      // Cập nhật lại danh sách file trong editingTask
      if (editingTask.files) {
        editingTask.files = editingTask.files.filter((file: any) => file.id !== fileId);
      }
      
      toast.success("Xóa file thành công!");
      refreshTasks(); // Refresh lại danh sách task
    } catch (error: any) {
      const msg = getErrorMessage(error);
      toast.error(msg || "Có lỗi xảy ra khi xóa file");
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Chuẩn bị dữ liệu
    const taskData = {
      content,
      status,
      category: priority,
      assignees: selectedCollaborators.map(Number),
      count: weight ? Number.parseInt(weight) : undefined,
      startDate: startDate ? startDate.toISOString() : "",
      deadline: deadline ? deadline.toISOString() : "",
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      assigner: assigner ?? undefined,
      mainHandler: mainHandler ?? undefined,
      department: departmentId ?? undefined,
      description: editingTask ? editingTask.description : "",
      progressHistory,
      changeReason: editingTask ? changeReason : undefined, // Chỉ gửi khi update
      parent_id: (!editingTask && parentTask) ? parentTask.id : undefined, // chỉ gửi khi tạo subtask
      qualityWeight: qualityWeight ? Number.parseInt(qualityWeight) : undefined,
    };

    const formData = new FormData();
    Object.entries(taskData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (key === 'assignees') {
          value.forEach((v) => formData.append('assignees[]', v));
        } else if (key === 'progressHistory') {
          value.forEach((v, idx) => formData.append(`progressHistory[${idx}]`, JSON.stringify(v)));
        } else {
          value.forEach((v) => formData.append(`${key}[]`, v));
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    formData.append('_method ', "PUT")
    files.forEach((file) => {
      formData.append('files[]', file);
    });

    try {
      if (editingTask && onEditTask) {
        await onEditTask(editingTask.id, formData)
        toast.success("Cập nhật công việc thành công!")
      } else {
        await onAddTask(formData)
        toast.success("Thêm công việc thành công!")
      }
      resetForm()
      setErrorMsg(null)
      onOpenChange(false)
    } catch (error: any) {
      const msg = getErrorMessage(error)
      setErrorMsg(getValidationErrors(error) || { general: [msg] })
      toast.error(msg)
    }
  }

  const resetForm = () => {
    setContent("")
    setDeadline(dayjs(new Date()))
    setStartDate(dayjs(new Date()))
    setStartDateError("")
    setPriority(null)
    setWeight(null)
    setSelectedCollaborators([])
    setAssigner(undefined)
    setMainHandler(undefined)
    setDepartmentId(undefined)
    setMainHandlerError("")
    setStatus("pending")
    setProgressHistory([])
    setFiles([])
    setDeletingFileId(null)
    setChangeReason("")
    setQualityWeight(null)
  }

  const collaboratorOptions = collaborators.map((c: any) => ({
    label: (
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center">
          {c.avatar}
        </div>
        <span>{c.label}</span>
      </div>
    ),
    value: c.value,
  }));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${editingTask ? "sm:max-w-7xl" : "sm:max-w-xl"} max-h-[90vh] overflow-y-auto`}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Chỉnh sửa công việc" : parentTask ? "Tạo công việc con" : "Thêm mới công việc"}
            </DialogTitle>
            <DialogDescription>
              {editingTask ? "Nhập thông tin chi tiết công việc cần cập nhật vào hệ thống." : parentTask ? "Tạo công việc con cho task cha bên dưới." : "Nhập thông tin chi tiết công việc cần thêm mới vào hệ thống."}
            </DialogDescription>
          </DialogHeader>
          {/* Hiển thị tên task cha nếu là subtask */}
          {parentTask && !editingTask && (
            <div className="mb-2 text-sm text-blue-600">
              <span>Task cha: </span>
              <span className="font-semibold">{parentTask.name}</span>
            </div>
          )}
          {errorMsg?.general && (
            <div className="text-red-600 text-sm mb-2">{errorMsg.general.join(" ")}</div>
          )}
          <div className="flex flex-col md:flex-row gap-3 py-2">
            {/* Cột trái: Thông tin công việc */}
            <div className="flex-1 min-w-0">
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="content">Nội dung công việc</Label>
                  <Textarea
                    id="content"
                    placeholder="Nhập nội dung công việc"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[60px] resize-none"
                    required
                    disabled={isCompletedTask}
                  />
                  {errorMsg?.content && <span className="text-red-500 text-xs">{errorMsg.content.join(" ")}</span>}
                </div>
                <div className="grid grid-cols-2 gap-2 items-start">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <ConfigProvider locale={viVN}>
                      <DatePicker
                        id="startDate"
                        value={startDate}
                        onChange={setStartDate}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày bắt đầu"
                        className="w-full"
                        required
                        disabled={isCompletedTask}
                      />
                    </ConfigProvider>
                    {startDateError && <span className="text-red-500 text-xs">{startDateError}</span>}
                    {errorMsg?.startDate && <span className="text-red-500 text-xs">{errorMsg.startDate.join(" ")}</span>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Hạn xử lý</Label>
                    <ConfigProvider locale={viVN}>
                      <DatePicker
                        id="deadline"
                        value={deadline}
                        onChange={setDeadline}
                        format="DD/MM/YYYY"
                        placeholder="Chọn hạn xử lý"
                        className="w-full"
                        disabled={isCompletedTask}
                      />
                    </ConfigProvider>
                    {errorMsg?.deadline && <span className="text-red-500 text-xs">{errorMsg.deadline.join(" ")}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 items-start">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Phân loại</Label>
                    <AntdSelect
                      id="priority"
                      style={{ width: "100%" }}
                      placeholder="Chọn phân loại"
                      value={priority}
                      onChange={setPriority}
                      options={categories?.map((c: Category) => ({ label: c.display_name, value: c.id.toString() }))}
                      allowClear
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      showSearch
                      filterOption={(input, option: any) => {
                        const opt = option as { label: string; value: string };
                        if (!opt || !opt.label) return false;
                        return opt.label.toLowerCase().includes(input.toLowerCase());
                      }}
                      disabled={isCompletedTask}
                    />
                    {errorMsg?.category && <span className="text-red-500 text-xs">{errorMsg.category.join(" ")}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="department">Phòng ban</Label>
                    <AntdSelect
                      id="department"
                      style={{ width: "100%" }}
                      placeholder="Chọn phòng ban"
                      value={departmentId}
                      onChange={setDepartmentId}
                      options={departments?.map((dept: any) => ({ label: dept.name, value: dept.id }))}
                      allowClear
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      showSearch
                      filterOption={(input, option: any) => {
                        const opt = option as { label: string; value: number };
                        if (!opt || !opt.label) return false;
                        return opt.label.toLowerCase().includes(input.toLowerCase());
                      }}
                      loading={loadingDepartments}
                      disabled={isCompletedTask}
                    />
                    {errorMsg?.department && <span className="text-red-500 text-xs">{errorMsg.department.join(" ")}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 items-start">
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Trọng số</Label>
                    <AntdSelect
                      id="weight"
                      style={{ width: "100%" }}
                      placeholder="Chọn trọng số"
                      value={weight}
                      onChange={setWeight}
                      options={[
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                      ]}
                      allowClear
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      showSearch
                      filterOption={(input, option: any) => {
                        const opt = option as { label: string; value: string };
                        if (!opt || !opt.label) return false;
                        return opt.label.toLowerCase().includes(input.toLowerCase());
                      }}
                      disabled={isCompletedTask}
                    />
                    {errorMsg?.count && <span className="text-red-500 text-xs">{errorMsg.count.join(" ")}</span>}
                  </div>
                  {isCompletedTask && <div className="grid gap-2">
                    <Label htmlFor="qualityWeight">Trọng số chất lượng</Label>
                    <AntdSelect
                      id="qualityWeight"
                      style={{ width: "100%" }}
                      placeholder="Chọn trọng số chất lượng"
                      value={qualityWeight}
                      onChange={setQualityWeight}
                      options={[
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                      ]}
                      allowClear
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      showSearch
                      filterOption={(input, option: any) => {
                        const opt = option as { label: string; value: string };
                        if (!opt || !opt.label) return false;
                        return opt.label.toLowerCase().includes(input.toLowerCase());
                      }}
                    />
                    {errorMsg?.qualityWeight && <span className="text-red-500 text-xs">{errorMsg.qualityWeight.join(" ")}</span>}
                  </div>}
                </div>
                <div className="grid gap-2 py-2">
                  <div className="grid grid-cols-2 gap-2 items-start">
                    <div className="grid gap-2">
                      <Label htmlFor="assigner">Người giao:</Label>
                      <AntdSelect
                        id="assigner"
                        style={{ width: "100%" }}
                        placeholder="Vui lòng chọn"
                        value={assigner}
                        onChange={setAssigner}
                        options={collaborators.map((c: any) => ({ label: c.label, value: c.value }))}
                        allowClear
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        showSearch
                        filterOption={(input, option: any) => {
                          const opt = option as { label: string; value: number };
                          if (!opt || !opt.label) return false;
                          return opt.label.toLowerCase().includes(input.toLowerCase());
                        }}
                        disabled={isCompletedTask}
                      />
                      {errorMsg?.assigner && <span className="text-red-500 text-xs">{errorMsg.assigner.join(" ")}</span>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="mainHandler">Người xử lý chính:</Label>
                      <AntdSelect
                        id="mainHandler"
                        style={{ width: "100%" }}
                        placeholder="Vui lòng chọn"
                        value={mainHandler}
                        onChange={setMainHandler}
                        options={collaborators.map((c: any) => ({ label: c.label, value: c.value }))}
                        allowClear
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        showSearch
                        filterOption={(input, option: any) => {
                          const opt = option as { label: string; value: number };
                          if (!opt || !opt.label) return false;
                          return opt.label.toLowerCase().includes(input.toLowerCase());
                        }}
                        disabled={isCompletedTask}
                      />
                      {mainHandlerError && <span className="text-red-500 text-xs">{mainHandlerError}</span>}
                      {errorMsg?.mainHandler && <span className="text-red-500 text-xs">{errorMsg.mainHandler.join(" ")}</span>}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Người phối hợp</Label>
                    <AntdSelect
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Chọn người phối hợp"
                      value={selectedCollaborators}
                      onChange={setSelectedCollaborators}
                      options={collaboratorOptions}
                      optionLabelProp="label"
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      allowClear
                      filterOption={(input, option: any) => {
                        const opt = option as { label: string; value: number };
                        if (!opt || !opt.label) return false;
                        return opt.label.toLowerCase().includes(input.toLowerCase());
                      }}
                      disabled={isCompletedTask}
                    />
                    {errorMsg?.assignees && <span className="text-red-500 text-xs">{errorMsg.assignees.join(" ")}</span>}
                  </div>
                  {/* Lý do thay đổi - chỉ hiển thị khi edit */}
                  {editingTask && (
                    <ChangeReasonInput
                      value={changeReason}
                      onChange={setChangeReason}
                      errorMsg={errorMsg?.changeReason}
                    />
                  )}
                  <div className="grid gap-2">
                    <Label>Đính kèm file</Label>
                    <div className="relative w-full">
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files) {
                            setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                        style={{ height: 40 }}
                        disabled={isCompletedTask}
                      />
                      <button
                        type="button"
                        className="flex items-center gap-2 border rounded px-3 py-2 bg-white hover:bg-gray-50 w-full text-left"
                        tabIndex={-1}
                        disabled={isCompletedTask}
                      >
                        <UploadOutlined className="text-blue-500" />
                        <span className="font-medium">Chọn file</span>
                        <span className="ml-auto text-xs text-gray-400">{files.length > 0 ? `${files.length} file đã chọn` : "Không có file nào"}</span>
                      </button>
                    </div>
                    {errorMsg && (
                      (errorMsg.file || errorMsg.files || Object.keys(errorMsg).some(key => key.startsWith("files."))) && (
                        <span className="text-red-500 text-xs">File không hợp lệ</span>
                      )
                    )}
                    {files.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm">
                        {files.map((file, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 10.172 2H7z" />
                            </svg>
                            <span className="truncate max-w-[200px]">{file.name}</span>
                            <button type="button" className="text-red-500 hover:underline" onClick={() => handleRemoveFile(idx)}>Xóa</button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Hiển thị file đính kèm khi xem chi tiết task */}
                    {editingTask && editingTask.files && editingTask.files.length > 0 && (
                      <div className="mt-2">
                        <Label className="text-xs text-gray-500">File đã đính kèm:</Label>
                        <ul className="space-y-1 text-sm mt-1">
                          {editingTask.files.map((file: any) => (
                            <li key={file.id} className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 10.172 2H7z" />
                              </svg>
                              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px]">{file.name}</a>
                              <span className="text-gray-400 text-xs">({(file.size/1024).toFixed(1)} KB)</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteAttachedFile(file.id)}
                                disabled={deletingFileId === file.id}
                                className="ml-auto text-red-500 hover:text-red-700 hover:underline text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deletingFileId === file.id ? "Đang xóa..." : "Xóa"}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Cột phải: Tiến độ & Trạng thái, chỉ hiển thị khi update */}
            {editingTask && (
              <TaskProgressPanel
                progressHistory={progressHistory}
                status={status}
                setStatus={setStatus}
                onAddProgress={handleAddProgress}
                refreshTasks={refreshTasks}
                setErrorMsg={setErrorMsg}
                errorMsg={errorMsg || {}}
                isCompletedTask={isCompletedTask || false}
              />
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit">{editingTask ? "Cập nhật" : "Thêm mới"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
