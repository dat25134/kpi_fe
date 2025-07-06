"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Home, RefreshCw, Settings, User, FileText, Plus, Trash2, Calculator, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { cn, getQualityRatingFromGrade, getRoleLabel, getStatusLabel, getStatusType } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import React from "react"
import { 
  EvaluationTargetType, 
  QualityRating,
  type EvaluationForm,
} from "@/types/evaluation"
import { useEvaluation } from "@/hooks/useEvaluation"
import { useUser } from "@/hooks/useUser"
import EvaluationDetailModal from "./evaluation-detail-modal"
import WorkDescriptionForm from "./work-description-form"
import LoadingSpinner from "@/components/ui/loading-spinner"
import EvaluationTable from "./EvaluationTable"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { vi } from "date-fns/locale"


export default function EvaluationForm() {
  const [activeTab, setActiveTab] = useState("personal")
  const [filterNameInput, setFilterNameInput] = useState("");
  const [filterStatusInput, setFilterStatusInput] = useState("all");
  const [filterRatingInput, setFilterRatingInput] = useState("all");
  const [filterPeriodInput, setFilterPeriodInput] = useState<Date | null>(null);

  // Các filter thực tế dùng để gọi API
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null)
  const [showWorkDescription, setShowWorkDescription] = useState(false)
  const [showEvaluationDetail, setShowEvaluationDetail] = useState(false)
  const [showWorkDescriptionForm, setShowWorkDescriptionForm] = useState(false)
  const [showCreateEvaluation, setShowCreateEvaluation] = useState(false)

  // Get current user
  const { user } = useUser()
  const currentUser = user || null
  const currentUserRole = currentUser?.role || "nhanvien"
  // Get evaluations data
  const getTabTypeParam = (tab: string) => {
    switch (tab) {
      case "personal": return "personal";
      case "employee": return "nhanvien";
      case "specialist": return "chuyenvien";
      case "department": return "phophong";
      case "manager": return "truongphong";
      default: return "personal";
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  const { 
    evaluations, 
    loading, 
    error, 
    pagination, 
    refetch,
    deleteEvaluation 
  } = useEvaluation({
    page: currentPage,
    limit: 10,
    type: getTabTypeParam(activeTab),
    status: filterStatus !== "all" ? filterStatus : undefined,
    final_grade: filterRating !== "all" ? filterRating : undefined,
    month: filterPeriod !== "all" ? parseInt(filterPeriod.split('/')[0]) : undefined,
    year: filterPeriod !== "all" ? parseInt(filterPeriod.split('/')[1]) : undefined,
    name: filterName || undefined,
  })

  // Handle errors from hook
  useEffect(() => {
    if (error) {
      console.error('Evaluation error:', error)
      // Có thể hiển thị toast notification ở đây
    }
  }, [error])

  // Determine which tabs to show based on user role
  const getVisibleTabs = () => {
    const tabs = []
    
    // Personal tab - always visible
    tabs.push({ value: "personal", label: "Cá nhân" })
    
    // Role-based tabs
    if (currentUserRole === "chutich" || currentUserRole === "phochutich") {
      // Chủ tịch/Phó chủ tịch can see all tabs
      tabs.push(
        { value: "employee", label: "Nhân viên" },
        { value: "specialist", label: "Chuyên viên" },
        { value: "department", label: "Phó phòng" },
        { value: "manager", label: "Trưởng phòng" }
      )
    } else if (currentUserRole === "truongphong" || currentUserRole === "phophong") {
      // Trưởng phòng/Phó phòng can see employee and specialist tabs
      tabs.push(
        { value: "employee", label: "Nhân viên" },
        { value: "specialist", label: "Chuyên viên" }
      )
    }
    // Nhân viên/Chuyên viên can only see personal tab (already added)
    
    return tabs
  }

  const visibleTabs = getVisibleTabs()

  const handleViewEvaluation = (evaluationId: string) => {
    setSelectedEvaluation(evaluationId)
    setShowEvaluationDetail(true)
  }

  const handleViewWorkDescription = () => {
    setShowWorkDescriptionForm(true)
  }

  const handleCreateEvaluation = () => {
    setSelectedEvaluation(null)
    setShowCreateEvaluation(true)
  }

  // Handle delete evaluation
  const handleDeleteEvaluation = async (evaluationId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa phiếu đánh giá này?")) {
      try {
        await deleteEvaluation(evaluationId);
      } catch (error) {
        console.error("Error deleting evaluation:", error);
        // Có thể hiển thị toast notification ở đây
      }
    }
  }

  // Khi nhấn Tìm kiếm
  const handleApplyFilter = () => {
    setCurrentPage(1);
    setFilterName(filterNameInput);
    setFilterStatus(filterStatusInput);
    setFilterRating(filterRatingInput);
    if (filterPeriodInput) {
      setFilterPeriod(`${filterPeriodInput.getMonth() + 1}/${filterPeriodInput.getFullYear()}`);
    } else {
      setFilterPeriod("all");
    }
  };
  // Khi nhấn Xóa lọc
  const handleClearFilter = () => {
    setCurrentPage(1);
    setFilterNameInput("");
    setFilterStatusInput("all");
    setFilterRatingInput("all");
    setFilterPeriodInput(null);
    setFilterName("");
    setFilterStatus("all");
    setFilterRating("all");
    setFilterPeriod("all");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
        </Button>
        <h2 className="text-lg font-medium">Đơn vị hiện tại</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Cá nhân</h3>
            <Button variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50 hover:bg-blue-100">
              <User className="h-4 w-4 mr-2" />
              Phiếu đánh giá cá nhân
            </Button>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Đơn vị phụ trách</h3>
            <Button variant="ghost" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              <span className="truncate" title="Phòng Quản trị nền tảng số và VTTT">
                Phòng Quản trị nền tảng số và VTTT
              </span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 border overflow-x-auto">
          <Tabs defaultValue="personal" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 overflow-x-auto">
              {visibleTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4",
                    activeTab === tab.value ? "text-blue-600" : "",
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              {/* Header Actions */}
              <div className="flex justify-between items-center p-2 border-b">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleCreateEvaluation}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tạo phiếu đánh giá
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleViewWorkDescription}
                  >
                    <Calculator className="h-4 w-4 mr-1" />
                    Bảng mô tả công việc
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={async () => {
                      try {
                        await refetch();
                      } catch (error) {
                        console.error("Error refetching evaluations:", error);
                        // Có thể hiển thị toast notification ở đây
                      }
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Bộ lọc filter */}
              <div className="flex flex-wrap gap-2 items-center p-2 border-b bg-gray-50">
                <Input
                  placeholder="Tìm theo tên..."
                  value={filterNameInput}
                  onChange={e => setFilterNameInput(e.target.value)}
                  className="w-40"
                />
                <Select value={filterStatusInput} onValueChange={setFilterStatusInput}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="waiting">Chờ tự đánh giá</SelectItem>
                    <SelectItem value="review1">Chờ đánh giá cấp 1</SelectItem>
                    <SelectItem value="review2">Chờ đánh giá cấp 2</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRatingInput} onValueChange={setFilterRatingInput}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Lọc theo xếp loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả xếp loại</SelectItem>
                    <SelectItem value="A">Hoàn thành xuất sắc (A)</SelectItem>
                    <SelectItem value="B">Hoàn thành tốt (B)</SelectItem>
                    <SelectItem value="C">Hoàn thành nhiệm vụ (C)</SelectItem>
                    <SelectItem value="D">Không hoàn thành (D)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <DatePicker
                    selected={filterPeriodInput}
                    onChange={date => setFilterPeriodInput(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText="Chọn tháng/năm"
                    className="w-full border rounded px-8 py-1 text-sm"
                    locale={vi}
                  />
                  <span className="left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none absolute">
                    <Calendar className="h-4 w-4" />
                  </span>
                </div>
                <Button className="bg-blue-600 text-white" size="sm" variant="outline" onClick={handleApplyFilter}>Tìm kiếm</Button>
                <Button size="sm" variant="outline" onClick={handleClearFilter}>Xóa lọc</Button>
              </div>

              {/* Evaluation Table */}
              <div className="overflow-x-auto">
                <EvaluationTable
                  evaluations={evaluations}
                  loading={loading}
                  error={error}
                  onView={handleViewEvaluation}
                  onDelete={handleDeleteEvaluation}
                />
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
                    onClick={() => setCurrentPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            {visibleTabs.slice(1).map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <div className="p-8 text-center text-gray-500">
                  Không có phiếu đánh giá {tab.label.toLowerCase()}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Evaluation Detail Modal */}
      <EvaluationDetailModal
        open={showEvaluationDetail}
        onOpenChange={setShowEvaluationDetail}
        evaluation={undefined}
      />

      {/* Work Description Form Modal */}
      <WorkDescriptionForm
        open={showWorkDescriptionForm}
        onOpenChange={setShowWorkDescriptionForm}
        employeeName={currentUser?.name}
        department={currentUser?.department}
      />

      {/* Evaluation Detail Modal (Tạo mới) */}
      <EvaluationDetailModal
        open={showCreateEvaluation}
        onOpenChange={setShowCreateEvaluation}
        evaluation={undefined}
      />
    </div>
  )
}
