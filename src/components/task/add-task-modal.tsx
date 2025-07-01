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
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "../ui/input"

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

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
  }

  const toggleCollaborator = (value: string) => {
    setSelectedCollaborators((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

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
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deadline">Hạn xử lý</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Input type="date" value={deadline ? format(deadline, "yyyy-MM-dd") : ""} onChange={(e) => setDeadline(new Date(e.target.value))} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Trọng số</Label>
                <Select value={weight} onValueChange={setWeight}>
                  <SelectTrigger>
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
                <SelectTrigger>
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
            <div className="grid gap-2">
              <Label>Người phối hợp</Label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={comboboxOpen} className="justify-between">
                    {selectedCollaborators.length > 0
                      ? `${selectedCollaborators.length} người được chọn`
                      : "Chọn người phối hợp"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Tìm người phối hợp..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy người phối hợp.</CommandEmpty>
                      <CommandGroup>
                        {collaborators.map((collaborator) => (
                          <CommandItem
                            key={collaborator.value}
                            value={collaborator.value}
                            onSelect={() => {
                              toggleCollaborator(collaborator.value)
                            }}
                          >
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center mr-2">
                                {collaborator.avatar}
                              </div>
                              <span>{collaborator.label}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedCollaborators.includes(collaborator.value) ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedCollaborators.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCollaborators.map((value) => {
                    const collaborator = collaborators.find((c) => c.value === value)
                    return (
                      <Badge key={value} variant="secondary" className="px-2 py-1">
                        <div className="flex items-center gap-1">
                          <div className="h-5 w-5 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center">
                            {collaborator?.avatar}
                          </div>
                          <span>{collaborator?.label}</span>
                        </div>
                      </Badge>
                    )
                  })}
                </div>
              )}
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
