"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CircleDot, Home, Plus, RefreshCw, Search, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import AddTaskModal from "./add-task-modal"
import { useCategories } from "@/hooks/userCategories"
import { Category } from "@/types/category"
import { useTasks } from "@/hooks/useTask"
import { Task } from "@/types/task"
import { Tooltip } from "antd"
import LoadingSpinner from "../ui/loading-spinner"
import TableTask from "./table-task"

export default function TaskManagement() {
  const [activeTab, setActiveTab] = useState("ongoing")
  const [startDate, setStartDate] = useState("2024-12-13")
  const [endDate, setEndDate] = useState("2025-06-13")
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { categories, isLoading, error } = useCategories()
  const { tasks, isLoading: tasksLoading, error: tasksError } = useTasks()

  const handleAddTask = (newTask: Task) => {
    console.log(newTask)
  }

  const taskCompleted = tasks?.filter((task: Task) => task.status === "completed")

  return (
    <div className="mx-auto w-full">
      <div className="px-4 md:px-6">
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
          <div className="flex flex-col md:flex-row items-start md:items-center text-sm text-gray-500 gap-y-1 md:gap-y-0 md:gap-x-6">
            <div className="flex items-center gap-x-1">
              <span>KPI hiện tại</span>
              <span>:</span>
              <span className="font-semibold text-gray-700">2.0</span>
            </div>
            <div className="flex items-center gap-x-1">
              <span>Tạm xếp loại</span>
              <span>:</span>
              <span className="font-semibold text-gray-700">2.0 / 4.0</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-4 w-full">
          <div>
            <label className="text-sm font-medium mb-1 block">Nội dung:</label>
            <Input className="w-full" placeholder="Nhập dữ liệu" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Thời gian:</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full block"
              />
              <span className="hidden sm:inline">-</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full block"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Phân loại:</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vui lòng chọn" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-end justify-end">
            <Button variant="outline" className="w-full md:w-auto">Làm lại</Button>
            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row px-4 md:px-6">
        <div className="hidden md:block w-64 bg-gray-50 p-4 rounded-l-lg">
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
        <div className="flex-1 border rounded-r-lg md:rounded-l-none md:rounded-r-lg overflow-x-auto">
          <Tabs defaultValue="ongoing" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 overflow-x-auto">
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

              <div className="overflow-x-auto">
                {tasksLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <TableTask tasks={tasks} />
                )}
              </div>

              <div className="flex justify-between items-center p-4 text-sm">
                <div>
                  1-{tasks?.length} / tổng {tasks?.length} công việc
                </div>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    1
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="overflow-x-auto">
                {tasksLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <TableTask tasks={taskCompleted} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddTaskModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAddTask={handleAddTask} categories={categories} />
    </div>
  )
}
