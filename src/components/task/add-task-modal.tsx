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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn, extractTextFromReactNode } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "../ui/input"
import { Select as AntdSelect } from "antd"

// Dữ liệu mẫu cho người phối hợp
const collaborators = [
  { value: "pnv", label: "Phạm Ngọc Vinh", avatar: "PNV" },
  { value: "pvk", label: "Phan Vinh Khang", avatar: "PVK" },
  { value: "lhl", label: "Lê Hữu Lợi", avatar: "LHL" },
  { value: "dtnh", label: "Đặng Trần Như Hảo", avatar: "ĐTNH" },
  { value: "dhd", label: "Đàm Hải Đăng", avatar: "ĐHĐ" },
  { value: "vdm", label: "Võ Đức Mạnh", avatar: "VĐM" },
]

type AddTaskModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: any) => void
}

export default function AddTaskModal({ open, onOpenChange, onAddTask }: AddTaskModalProps) {
  const [content, setContent] = useState("")
  const [deadline, setDeadline] = useState<Date | undefined>(new Date())
  const [priority, setPriority] = useState("")
  const [weight, setWeight] = useState("4")
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([])
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [assigner, setAssigner] = useState("")
  const [mainHandler, setMainHandler] = useState("")
  const [mainHandlerError, setMainHandlerError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

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
        const collaborator = collaborators.find((c) => c.value === id)
        return collaborator ? collaborator.avatar.charAt(0) : ""
      }),
      count: Number.parseInt(weight),
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
    setPriority("")
    setWeight("4")
    setSelectedCollaborators([])
    setAssigner("")
    setMainHandler("")
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
                <Label htmlFor="deadline">Hạn xử lý</Label>
                <Input type="date" className="w-full block" value={deadline ? format(deadline, "yyyy-MM-dd") : ""} onChange={(e) => setDeadline(new Date(e.target.value))} />
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
            <div className="grid gap-2">
              <Label htmlFor="priority">Phân loại</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn phân loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Phân loại</SelectLabel>
                    <SelectItem value="Phối hợp">Phối hợp</SelectItem>
                    <SelectItem value="Ưu tiên">Ưu tiên</SelectItem>
                    <SelectItem value="Quan trọng">Quan trọng</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    showSearch
                    filterOption={(input, option) => {
                      const opt = option as { label: string; value: string };
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
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    showSearch
                    filterOption={(input, option) => {
                      const opt = option as { label: string; value: string };
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
                  const opt = option as { label: string; value: string };
                  if (!opt || !opt.label) return false;
                  return opt.label.toLowerCase().includes(input.toLowerCase());
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Thêm mới</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
