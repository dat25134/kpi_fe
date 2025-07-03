import { useState } from "react"
import { Timeline } from "antd"
import { Label } from "../ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { formatDate } from "@/lib/utils"
import { TaskProgressPanelProps } from "@/types/task"
import { ProgressItem } from "@/types/task"

export default function TaskProgressPanel({ progressHistory, status, setStatus, onAddProgress }: TaskProgressPanelProps) {
  const [progressInput, setProgressInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddProgress = async () => {
    if (!progressInput.trim()) return
    setLoading(true)
    // Fake user và thời gian
    const now = new Date()
    const item: ProgressItem = {
      user: { id: 0, name: "Người dùng demo" },
      time: now.toLocaleString("vi-VN", { hour12: false }),
      content: progressInput.trim(),
    }
    await onAddProgress(item)
    setProgressInput("")
    setLoading(false)
  }

  return (
    <div className="w-full md:w-96 flex-shrink-0 border rounded-lg p-4 bg-gray-50">
      <div className="mb-6">
        <Label className="mb-6">Tiến độ xử lý</Label>
        <div className="max-h-80 overflow-y-auto pr-2 pt-2">
          <Timeline
            items={progressHistory.map((item, idx) => ({
              color: idx === progressHistory.length - 1 ? "blue" : "gray",
              children: (
                <div>
                  <div className="font-semibold">{typeof item.user === 'object' && item.user !== null ? item.user.name : item.user}</div>
                  <div className="text-xs text-gray-500">{formatDate(item.time, "DD/MM/YYYY HH:mm")}</div>
                  <div>{item.content}</div>
                </div>
              ),
            }))}
          />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Textarea
            placeholder="Nhập nội dung tiến độ mới"
            value={progressInput}
            onChange={e => setProgressInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAddProgress() } }}
            disabled={loading}
            className="min-h-[60px]"
          />
          <Button type="button" onClick={handleAddProgress} disabled={!progressInput.trim() || loading}>
            Cập nhật tiến độ
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="status">Trạng thái công việc</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="in_progress">Đang thực hiện</SelectItem>
            <SelectItem value="completed">Đã hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 