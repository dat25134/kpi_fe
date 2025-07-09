import { useState } from "react"
import { Timeline } from "antd"
import { Label } from "../ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { formatDate } from "@/lib/utils"
import { TaskProgressPanelProps } from "@/types/task"
import { ProgressItem } from "@/types/task"
import { getErrorMessage, getValidationErrors } from "@/services/errorHandler"
import { toast } from "sonner"

export default function TaskProgressPanel({ progressHistory, status, setStatus, onAddProgress, setErrorMsg, errorMsg, isCompletedTask }: TaskProgressPanelProps) {
  const [progressInput, setProgressInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddProgress = async () => {
    try {
      if (!progressInput.trim()) return
      setLoading(true)
      await onAddProgress({ contentProgress: progressInput.trim() } as any)
      setProgressInput("")
      setLoading(false)
      toast.success("Thêm tiến độ thành công!")
    } catch (error: any) {
      const msg = getErrorMessage(error)
      setErrorMsg(getValidationErrors(error) || { general: [msg] })
      toast.error(msg)
      setLoading(false)
    }
    
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
                  <div title={item.contentProgress} style={{ whiteSpace: "pre-line", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                    {item.contentProgress}
                  </div>
                </div>
              ),
            }))}
          />
        </div>
        {!isCompletedTask && <div className="mt-4 flex flex-col gap-2">
          <Textarea
            placeholder="Nhập nội dung tiến độ mới"
            value={progressInput}
            onChange={e => setProgressInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAddProgress() } }}
            disabled={loading}
            className="min-h-[60px] resize-none"
          />
          <Button type="button" onClick={handleAddProgress} disabled={!progressInput.trim() || loading}>
            Cập nhật tiến độ
          </Button>
          {errorMsg?.contentProgress && <span className="text-red-500 text-xs">{errorMsg.contentProgress.join(" ")}</span>}
        </div>}
      </div>
      <div>
        <Label htmlFor="status">Trạng thái công việc</Label>
        <Select value={status} onValueChange={setStatus} disabled={isCompletedTask}>
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