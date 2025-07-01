"use client"

import type React from "react"

import { useState } from "react"
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

type AddTaskModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: any) => void
  categories: Category[]
}

export default function AddTaskModal({ open, onOpenChange, onAddTask, categories }: AddTaskModalProps) {
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
  const { allUsers, loading } = useEmployees()

  // Dữ liệu mẫu cho người phối hợp
  const collaborators = allUsers?.map((employee) => ({
    value: employee.id,
    label: employee.name,
    avatar: employee.avatar,
  }))

  const handleCloseModal = () => {
    onOpenChange(false)
    resetForm()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate ngày bắt đầu
    if (!startDate) {
      setStartDateError("Vui lòng chọn ngày bắt đầu")
      return
    } else {
      setStartDateError("")
    }
    // Validate mainHandler
    if (!mainHandler) {
      setMainHandlerError("Vui lòng chọn người xử lý chính")
      return
    } else {
      setMainHandlerError("")
    }
    // Tạo task mới
    const newTask = {
      id: Math.floor(Math.random() * 1000), // ID tạm thời
      content,
      status: "ongoing",
      priority: priority || "",
      assignees: selectedCollaborators.map((id) => {
        const collaborator = collaborators.find((c) => c.value === Number(id))
        return collaborator ? collaborator.avatar.charAt(0) : ""
      }),
      count: Number.parseInt(weight),
      startDate: startDate ? format(startDate, "dd/MM/yyyy") : "",
      deadline: deadline ? format(deadline, "dd/MM/yyyy") : "",
      createdAt: format(new Date(), "dd/MM/yyyy"),
      assigner,
      mainHandler,
    }
    onAddTask(newTask)
    resetForm()
    onOpenChange(false)
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
    setMainHandlerError("")
  }

  const toggleCollaborator = (value: string) => {
    setSelectedCollaborators((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
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
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm mới công việc</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết công việc cần thêm mới vào hệ thống.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input type="date" className="w-full block" value={startDate ? format(startDate, "yyyy-MM-dd") : ""} onChange={(e) => setStartDate(new Date(e.target.value))} required />
                {startDateError && <span className="text-red-500 text-xs">{startDateError}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Hạn xử lý</Label>
                <Input type="date" className="w-full block" value={deadline ? format(deadline, "yyyy-MM-dd") : ""} onChange={(e) => setDeadline(new Date(e.target.value))} />
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
              </div>
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
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit">Thêm mới</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
