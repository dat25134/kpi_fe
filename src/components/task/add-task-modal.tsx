"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { format } from "date-fns"
import { Input } from "../ui/input"
import { Select as AntdSelect } from "antd"
import { Category } from "@/types/category"
import { useEmployees } from "@/hooks/useEmployees"
import { toast } from "sonner"
import { getErrorMessage, getValidationErrors } from "@/services/errorHandler"
import { Timeline } from "antd"
import TaskProgressPanel from "./TaskProgressPanel"
import { ProgressItem } from "@/types/task"
import { useProgress } from "@/hooks/useProgress"
import { useDepartmentsListSelect } from "@/hooks/useDepartments"

type AddTaskModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: any) => Promise<void>
  onEditTask?: (id: number, task: any) => Promise<void>
  editingTask?: any
  categories: Category[]
  refreshTasks: () => void
}

export default function AddTaskModal({ open, onOpenChange, onAddTask, onEditTask, editingTask, categories, refreshTasks }: AddTaskModalProps) {
  const [content, setContent] = useState("")
  const [deadline, setDeadline] = useState<Date | undefined>(new Date())
  const [priority, setPriority] = useState("")
  const [weight, setWeight] = useState("4")
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([])
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [assigner, setAssigner] = useState<number | undefined>(undefined)
  const [mainHandler, setMainHandler] = useState<number | undefined>(undefined)
  const [mainHandlerError, setMainHandlerError] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [startDateError, setStartDateError] = useState("")
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined)
  const { allUsers, loading } = useEmployees()
  const { data: departments, isLoading: loadingDepartments } = useDepartmentsListSelect()
  const [errorMsg, setErrorMsg] = useState<Record<string, string[]> | null>(null)
  const [status, setStatus] = useState("pending")
  const [progressHistory, setProgressHistory] = useState<ProgressItem[]>([])
  const { updateProgress } = useProgress()

  // Dữ liệu mẫu cho người phối hợp
  const collaborators = allUsers?.map((employee) => ({
    value: employee.id,
    label: employee.name,
    avatar: employee.avatar,
  }))

  useEffect(() => {
    if (editingTask) {
      setContent(editingTask.content || "")
      setDeadline(editingTask.deadline ? new Date(editingTask.deadline) : new Date())
      setStartDate(editingTask.startDate ? new Date(editingTask.startDate) : new Date())
      setPriority(editingTask.category?.id?.toString() || "")
      setWeight(editingTask.count?.toString() || "4")
      setSelectedCollaborators(editingTask.assignees?.map((a: any) => Number(a.id)) || [])
      setAssigner(editingTask.assigner?.id)
      setMainHandler(editingTask.mainHandler?.id)
      setDepartmentId(editingTask.department?.id)
      setMainHandlerError("")
      setStartDateError("")
      setStatus(editingTask.status || "pending")
      setProgressHistory(editingTask?.progressHistory || [])
    } else {
      resetForm()
    }
    setErrorMsg(null)
  }, [editingTask, open])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Chuẩn bị dữ liệu
    const taskData = {
      content,
      status,
      category: priority,
      assignees: selectedCollaborators.map(Number),
      count: Number.parseInt(weight),
      startDate: startDate ? startDate.toISOString() : "",
      deadline: deadline ? deadline.toISOString() : "",
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      assigner: assigner ?? undefined,
      mainHandler: mainHandler ?? undefined,
      department: departmentId ?? undefined,
      description: editingTask ? editingTask.description : "",
      progressHistory,
    }
    try {
      if (editingTask && onEditTask) {
        await onEditTask(editingTask.id, taskData)
        toast.success("Cập nhật công việc thành công!")
      } else {
        await onAddTask(taskData)
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
    setDeadline(new Date())
    setStartDate(new Date())
    setStartDateError("")
    setPriority("")
    setWeight("")
    setSelectedCollaborators([])
    setAssigner(undefined)
    setMainHandler(undefined)
    setDepartmentId(undefined)
    setMainHandlerError("")
    setStatus("pending")
    setProgressHistory([])
  }

  const collaboratorOptions = collaborators.map(c => ({
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
      <DialogContent className={`w-full max-w-full sm:max-w-[${editingTask ? "900px" : "600px"}] max-h-[90vh] overflow-y-auto`}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Chỉnh sửa công việc" : "Thêm mới công việc"}</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết công việc cần {editingTask ? "cập nhật" : "thêm mới"} vào hệ thống.</DialogDescription>
          </DialogHeader>
          {errorMsg?.general && (
            <div className="text-red-600 text-sm mb-2">{errorMsg.general.join(" ")}</div>
          )}
          <div className="flex flex-col md:flex-row gap-6 py-4">
            {/* Cột trái: Thông tin công việc */}
            <div className="flex-1 min-w-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="content">Nội dung công việc</Label>
                  <Textarea
                    id="content"
                    placeholder="Nhập nội dung công việc"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[100px] resize-none"
                    required
                  />
                  {errorMsg?.content && <span className="text-red-500 text-xs">{errorMsg.content.join(" ")}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4 items-start">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                      type="date"
                      className="w-full block"
                      value={startDate instanceof Date && !isNaN(startDate.getTime()) ? format(startDate, "yyyy-MM-dd") : ""}
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      required
                    />
                    {startDateError && <span className="text-red-500 text-xs">{startDateError}</span>}
                    {errorMsg?.startDate && <span className="text-red-500 text-xs">{errorMsg.startDate.join(" ")}</span>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Hạn xử lý</Label>
                    <Input
                      type="date"
                      className="w-full block"
                      value={deadline instanceof Date && !isNaN(deadline.getTime()) ? format(deadline, "yyyy-MM-dd") : ""}
                      onChange={(e) => setDeadline(new Date(e.target.value))}
                    />
                    {errorMsg?.deadline && <span className="text-red-500 text-xs">{errorMsg.deadline.join(" ")}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Phân loại</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn phân loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Phân loại</SelectLabel>
                          {categories?.map((category: Category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.display_name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errorMsg?.category && <span className="text-red-500 text-xs">{errorMsg.category.join(" ")}</span>}
                  </div>
                  <div className="grid gap-2">
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
                    />
                    {errorMsg?.department && <span className="text-red-500 text-xs">{errorMsg.department.join(" ")}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Trọng số</Label>
                    <Select value={weight} onValueChange={setWeight}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trọng số" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Trọng số</SelectLabel>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errorMsg?.count && <span className="text-red-500 text-xs">{errorMsg.count.join(" ")}</span>}
                  </div>
                </div>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="assigner">Người giao:</Label>
                      <AntdSelect
                        id="assigner"
                        style={{ width: "100%" }}
                        placeholder="Vui lòng chọn"
                        value={assigner}
                        onChange={setAssigner}
                        options={collaborators.map(c => ({ label: c.label, value: c.value }))}
                        allowClear
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        showSearch
                        filterOption={(input, option: any) => {
                          const opt = option as { label: string; value: number };
                          if (!opt || !opt.label) return false;
                          return opt.label.toLowerCase().includes(input.toLowerCase());
                        }}
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
                        options={collaborators.map(c => ({ label: c.label, value: c.value }))}
                        allowClear
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        showSearch
                        filterOption={(input, option: any) => {
                          const opt = option as { label: string; value: number };
                          if (!opt || !opt.label) return false;
                          return opt.label.toLowerCase().includes(input.toLowerCase());
                        }}
                      />
                      {mainHandlerError && <span className="text-red-500 text-xs">{mainHandlerError}</span>}
                      {errorMsg?.mainHandler && <span className="text-red-500 text-xs">{errorMsg.mainHandler.join(" ")}</span>}
                    </div>
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
                  />
                  {errorMsg?.assignees && <span className="text-red-500 text-xs">{errorMsg.assignees.join(" ")}</span>}
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
