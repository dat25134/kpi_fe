"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, CircleDot, Home, Plus, RefreshCw, Search, Settings, User, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import AddTaskModal from "./add-task-modal"
import { useCategories } from "@/hooks/userCategories"
import { Category } from "@/types/category"
import { useTasks } from "@/hooks/useTask"
import { Task } from "@/types/task"
import { Tooltip } from "antd"
import LoadingSpinner from "../ui/loading-spinner"
import TableTask from "./table-task"
import { addMonths, format } from "date-fns"
import { toast } from "sonner"
import { getErrorMessage, getValidationErrors } from "@/services/errorHandler"
import { mutate } from "swr"
import { Dropdown, Menu } from "antd"
import { DatePicker, ConfigProvider } from "antd"
import viVN from "antd/es/locale/vi_VN"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import { useCurrentUserWorkDescriptions } from "@/hooks/useCurrentUserWorkDescriptions"
import { calculateKPIScore, getKPIRatingForKPI, getKPIRatingLabelForKPI } from "@/lib/utils"
import { exportTasksToWord } from '@/services/task';
import { useLoading } from '@/context/loading-context';
dayjs.locale("vi")

export default function TaskManagement() {
  const [activeTab, setActiveTab] = useState("ongoing")
  const today = format(new Date(), "yyyy-MM-dd")
  const twoMonthsAgo = format(addMonths(new Date(), -2), "yyyy-MM-dd")
  const [inputStartDate, setInputStartDate] = useState(twoMonthsAgo)
  const [inputEndDate, setInputEndDate] = useState(today)
  const [inputSearchTerm, setInputSearchTerm] = useState("")
  const [inputCategory, setInputCategory] = useState("")
  const [startDate, setStartDate] = useState(twoMonthsAgo)
  const [endDate, setEndDate] = useState(today)
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const { categories, isLoading, error } = useCategories()
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined)
  const params = {
    page: currentPage,
    search: searchTerm,
    startDate,
    endDate,
    category,
    status: activeTab === "completed" ? "completed" : "ongoing",
    itemsPerPage,
    departmentId,
  };
  const {
    tasks,
    pagination,
    isLoading: tasksLoading,
    error: tasksError,
    departments,
    addTask,
    editTask
  } = useTasks(params)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedOngoingTaskIds, setSelectedOngoingTaskIds] = useState<number[]>([])
  const [selectedCompletedTaskIds, setSelectedCompletedTaskIds] = useState<number[]>([])
  const [parentTask, setParentTask] = useState<{ id: number, name: string } | null>(null)
  const { data: kpiData, loading: kpiLoading, error: kpiError } = useCurrentUserWorkDescriptions();
  const workDescriptions = kpiData?.work_descriptions || [];
  const kpiScore = calculateKPIScore(workDescriptions);
  const kpiRating = getKPIRatingForKPI(kpiScore);
  const kpiRatingLabel = getKPIRatingLabelForKPI(kpiRating);
  const { hideLoading } = useLoading();
  
  const handleSearch = () => {
    setStartDate(inputStartDate)
    setEndDate(inputEndDate)
    setSearchTerm(inputSearchTerm)
    setCategory(inputCategory)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setInputStartDate(twoMonthsAgo)
    setInputEndDate(today)
    setInputSearchTerm("")
    setInputCategory("")
    setStartDate(twoMonthsAgo)
    setEndDate(today)
    setSearchTerm("")
    setCategory("")
    setCurrentPage(1)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const handleAddTask = async (newTask: Task) => {
      await addTask(newTask)
  }

  const handleEditTask = async (id: number, updatedTask: Partial<Task>) => {
      await editTask(id, updatedTask)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const refreshTasks = () => {
    mutate(["tasks", params]);
  }

  const handleChangeItemsPerPage = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  const itemsPerPageMenuItems = [
    {
      key: '10',
      label: 'Ít (10)',
      onClick: () => handleChangeItemsPerPage(10),
    },
    {
      key: '20',
      label: 'Bình thường (20)',
      onClick: () => handleChangeItemsPerPage(20),
    },
    {
      key: '50',
      label: 'Nhiều (50)',
      onClick: () => handleChangeItemsPerPage(50),
    },
  ]

  const handleExportWord = async () => {
    const allSelectedIds = [...selectedOngoingTaskIds, ...selectedCompletedTaskIds]
    const uniqueSelectedIds = Array.from(new Set(allSelectedIds))
    if (uniqueSelectedIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một công việc để export!')
      return
    }
    try {
      const blob = await exportTasksToWord({
        ids: uniqueSelectedIds,
        startDate,
        endDate,
      })
      // Kiểm tra nếu response là JSON lỗi
      if (blob.type === "application/json") {
        const reader = new FileReader()
        reader.onload = function () {
          try {
            const json = JSON.parse(reader.result as string)
            toast.error(json.message || "Xuất file Word thất bại!")
            hideLoading()
          } catch {
            toast.error("Xuất file Word thất bại!")
            hideLoading()
          }
        }
        reader.readAsText(blob)
        return
      }
      // Nếu là file Word thì tải về
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `tasks_export_${startDate}_${endDate}.docx`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      toast.success('Xuất file Word thành công!')
      hideLoading()
    } catch (err) {
      toast.error('Xuất file Word thất bại!')
      hideLoading()
    }
  }

  const handleAddSubTask = (task: Task) => {
    setParentTask({ id: task.id, name: task.content }) // hoặc task.title nếu có
    setEditingTask(null)
    setIsAddModalOpen(true)
  }

  return (
    <div className="mx-auto w-full">
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center gap-2 bg-blue-50 border-blue-200">
              <User className="h-4 w-4 text-blue-500" />
              <span className="text-blue-700">Công việc</span>
            </Button>
            {/* <Button variant="outline" className="flex items-center gap-2">
              <CircleDot className="h-4 w-4" />
              <span>Egov</span>
            </Button> */}
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center text-sm text-gray-500 gap-y-1 md:gap-y-0 md:gap-x-6">
            <div className="flex items-center gap-x-1">
              <span>KPI hiện tại</span>
              <span>:</span>
              <span className="font-semibold text-gray-700">
                {kpiLoading ? '...' : `${kpiScore.toFixed(2)} / 4.0`}
              </span>
            </div>
            <div className="flex items-center gap-x-1">
              <span>Tạm xếp loại</span>
              <span>:</span>
              <span className="font-semibold text-gray-700">
                {kpiLoading ? '...' : kpiRatingLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-4 w-full">
          <div>
            <label className="text-sm font-medium mb-1 block">Nội dung:</label>
            <Input className="w-full" placeholder="Nhập dữ liệu" value={inputSearchTerm} onChange={(e) => setInputSearchTerm(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Thời gian:</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <ConfigProvider locale={viVN}>
                <DatePicker
                  value={inputStartDate ? dayjs(inputStartDate) : null}
                  onChange={(date) => setInputStartDate(date ? date.format("YYYY-MM-DD") : "")}
                  format="DD/MM/YYYY"
                  placeholder="Từ ngày"
                  className="w-full block"
                />
              </ConfigProvider>
              <span className="hidden sm:inline">-</span>
              <ConfigProvider locale={viVN}>
                <DatePicker
                  value={inputEndDate ? dayjs(inputEndDate) : null}
                  onChange={(date) => setInputEndDate(date ? date.format("YYYY-MM-DD") : "")}
                  format="DD/MM/YYYY"
                  placeholder="Đến ngày"
                  className="w-full block"
                />
              </ConfigProvider>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Phân loại:</label>
            <Select value={inputCategory} onValueChange={setInputCategory}>
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
            <Button variant="outline" className="w-full md:w-auto" onClick={handleResetFilters}>Làm lại</Button>
            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700" onClick={handleSearch}>
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
            <Button
              variant={departmentId === undefined ? "default" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => {
                setCurrentPage(1)
                setDepartmentId(undefined)
              }}
            >
              <Home className="h-4 w-4 mr-2" />
              <span className="truncate">Tất cả</span>
            </Button>
            {departments && departments.length > 0 ? (
              departments.map((dept: any) => (
                <Button
                  key={dept.id}
                  variant={departmentId === dept.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentPage(1)
                    setDepartmentId(dept.id)
                  }}
                >
                  <Home className="h-4 w-4 mr-2" />
                  <span className="truncate">{dept.name}</span>
                </Button>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">Chưa có phòng ban</span>
            )}
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
              <div className="flex justify-between p-2 border-b">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  disabled={selectedOngoingTaskIds.length === 0 && selectedCompletedTaskIds.length === 0}
                  onClick={handleExportWord}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export WORD
                </Button>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm mới
                  </Button>
                  <Button size="sm" variant="ghost" onClick={refreshTasks}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Dropdown menu={{ items: itemsPerPageMenuItems }} trigger={["click"]} placement="bottomRight">
                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </Dropdown>
                </div>
              </div>

              <div className="overflow-x-auto">
                {tasksLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <TableTask
                    pagination={pagination}
                    tasks={tasks}
                    selectedTaskIds={selectedOngoingTaskIds}
                    onSelectTaskIds={setSelectedOngoingTaskIds}
                    onRowClick={(task) => { setEditingTask(task); setIsAddModalOpen(true); }}
                    onAddSubTask={handleAddSubTask}
                  />
                )}
              </div>

              {/* Phân trang */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <span className="text-sm text-muted-foreground">
                    Trang {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed">
              <div className="overflow-x-auto">
                {tasksLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <TableTask
                    tasks={tasks?.filter((task: Task) => task.status === "completed")}
                    selectedTaskIds={selectedCompletedTaskIds}
                    onSelectTaskIds={setSelectedCompletedTaskIds}
                    onRowClick={(task) => { setEditingTask(task); setIsAddModalOpen(true); }}
                    onAddSubTask={handleAddSubTask}
                    pagination={pagination}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddTaskModal
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open)
          if (!open) {
            setEditingTask(null)
            setParentTask(null)
          }
        }}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        editingTask={editingTask}
        categories={categories}
        refreshTasks={refreshTasks}
        parentTask={parentTask}
        isCompletedTask={!!(editingTask && editingTask.status === 'completed')}
      />
    </div>
  )
}
