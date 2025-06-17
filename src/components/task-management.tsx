"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CircleDot, Home, Plus, RefreshCw, Search, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import AddTaskModal from "./add-task-modal"

// Dữ liệu mẫu
const initialTasks = [
  {
    id: 1,
    content: "Chuẩn bị gian hàng triển lãm",
    status: "ongoing",
    priority: "Phối hợp",
    assignees: ["V", "K", "T"],
    count: 4,
    deadline: "02/05/2025",
    createdAt: "28/04/2025",
  },
  {
    id: 2,
    content:
      "Cập nhật ứng dụng Tây Ninh Smart mới hoàn toàn, loại bỏ các chức năng không dùng, bổ sung các tính năng mới",
    status: "ongoing",
    priority: "",
    assignees: [],
    count: 4,
    deadline: "30/06/2025",
    createdAt: "18/03/2025",
  },
  {
    id: 3,
    content:
      "Nâng cấp hệ thống giám sát chất lượng công việc KPI cho Sở KHCN theo hướng đồng bộ, thống nhất với hệ thống quản lý nhiệm vụ của Văn phòng Trung ương đảng",
    status: "ongoing",
    priority: "Phối hợp",
    assignees: ["V", "P"],
    count: 4,
    deadline: "30/04/2025",
    createdAt: "18/03/2025",
  },
]

export default function TaskManagement() {
  const [activeTab, setActiveTab] = useState("ongoing")
  const [startDate, setStartDate] = useState("2024-12-13")
  const [endDate, setEndDate] = useState("2025-06-13")
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [tasks, setTasks] = useState(initialTasks)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddTask = (newTask: any) => {
    setTasks([...tasks, newTask])
  }

  return (
    <div className="mx-auto p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center gap-2 bg-blue-50 border-blue-200">
            <User className="h-4 w-4 text-blue-500" />
            <span className="text-blue-700">Công việc</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <CircleDot className="h-4 w-4" />
            <span>Egov</span>
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">KPI hiện tại</div>
          <div className="text-sm text-gray-500">/</div>
          <div className="text-sm text-gray-500">Tạm xếp loại</div> 
          <div className="text-sm text-gray-500">:</div>
          <div className="text-sm text-gray-500">- / 4.0</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="col-span-1 md:col-span-1">
          <label className="text-sm font-medium">Nội dung:</label>
          <Input placeholder="Nhập dữ liệu" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="col-span-1 md:col-span-1">
          <label className="text-sm font-medium">Thời gian:</label>
          <div className="flex items-center space-x-2">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span>-</span>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="text-sm font-medium">Phân loại:</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Vui lòng chọn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="personal">Cá nhân</SelectItem>
              <SelectItem value="department">Phòng ban</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1 md:col-span-1 flex items-end space-x-2">
          <Button variant="outline" className="flex-1">
            Làm lại
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </div>

      <div className="flex">
        <div className="w-64 bg-gray-50 p-4 rounded-l-lg">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Cá nhân</h3>
            <Button variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50 hover:bg-blue-100">
              <User className="h-4 w-4 mr-2" />
              Công việc của tôi
            </Button>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Phòng ban phụ trách</h3>
            <Button variant="ghost" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              <span className="truncate">Phòng Quản trị nền tảng số và VTTT</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 border rounded-r-lg">
          <Tabs defaultValue="ongoing" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start rounded-none h-auto p-0">
              <TabsTrigger
                value="ongoing"
                className={cn(
                  "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4",
                  activeTab === "ongoing" ? "text-blue-600" : "",
                )}
              >
                Đang thực hiện
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4"
              >
                Đã hoàn thành
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ongoing" className="p-0 m-0">
              <div className="flex justify-end p-2 border-b">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm mới
                </Button>
                <Button size="sm" variant="ghost" className="ml-2">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead className="w-24 text-center">Trọng số</TableHead>
                    <TableHead className="w-28">Hạn xử lý</TableHead>
                    <TableHead className="w-28">Ngày tạo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell>{task.id}</TableCell>
                      <TableCell>
                        <div>
                          {task.priority && (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mr-2">
                              {task.priority}
                            </span>
                          )}
                          {task.content}
                        </div>
                        {task.assignees.length > 0 && (
                          <div className="mt-1">
                            <span className="text-sm text-gray-500">Phối hợp: </span>
                            {task.assignees.map((assignee, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs mr-1"
                              >
                                {assignee}
                              </span>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{task.count}</TableCell>
                      <TableCell className="text-red-500">{task.deadline}</TableCell>
                      <TableCell>{task.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center p-4 text-sm">
                <div>
                  1-{tasks.length} / tổng {tasks.length} công việc
                </div>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    1
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="p-8 text-center text-gray-500">Không có công việc đã hoàn thành</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Công ty cổ phần Thăng Long</p>
      </div>

      <AddTaskModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAddTask={handleAddTask} />
    </div>
  )
}
