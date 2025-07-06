"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import EvaluationFilterBar from "./EvaluationFilterBar"
import { toast } from "sonner"

// Component form tạo phiếu đánh giá
function CreateEvaluationForm({ 
  onConfirm, 
  onCancel 
}: { 
  onConfirm: (month: number, year: number) => void
  onCancel: () => void 
}) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const months = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" }
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tháng</Label>
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Năm</Label>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button onClick={() => onConfirm(selectedMonth, selectedYear)}>
          Tạo phiếu đánh giá
        </Button>
      </div>
    </div>
  )
}

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
  const [showCreateEvaluationModal, setShowCreateEvaluationModal] = useState(false)

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
    createEvaluation,
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
    setShowCreateEvaluationModal(true)
  }

  const handleConfirmCreateEvaluation = async (month: number, year: number) => {
    try {
      const evaluationData = {
        month: month,
        year: year,
        status: "draft",
        final_grade: "",
        total_score: "0"
      }
      
      const newEvaluation = await createEvaluation(evaluationData)
      console.log("Đã tạo phiếu đánh giá mới:", newEvaluation)
      toast.success("Đã tạo phiếu đánh giá mới thành công!")
      setShowCreateEvaluationModal(false)
      
    } catch (error) {
      console.error("Lỗi khi tạo phiếu đánh giá:", error)
      toast.error("Không thể tạo phiếu đánh giá. Vui lòng thử lại!")
      refetch()
    }
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
              {/* Filter Bar dùng chung */}
              <EvaluationFilterBar
                filterNameInput={filterNameInput}
                setFilterNameInput={setFilterNameInput}
                filterStatusInput={filterStatusInput}
                setFilterStatusInput={setFilterStatusInput}
                filterRatingInput={filterRatingInput}
                setFilterRatingInput={setFilterRatingInput}
                filterPeriodInput={filterPeriodInput}
                setFilterPeriodInput={setFilterPeriodInput}
                onApply={handleApplyFilter}
                onClear={handleClearFilter}
              />
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
              <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                {/* Filter Bar dùng chung */}
                <EvaluationFilterBar
                  filterNameInput={filterNameInput}
                  setFilterNameInput={setFilterNameInput}
                  filterStatusInput={filterStatusInput}
                  setFilterStatusInput={setFilterStatusInput}
                  filterRatingInput={filterRatingInput}
                  setFilterRatingInput={setFilterRatingInput}
                  filterPeriodInput={filterPeriodInput}
                  setFilterPeriodInput={setFilterPeriodInput}
                  onApply={handleApplyFilter}
                  onClear={handleClearFilter}
                />
                {/* Header Actions */}
                <div className="flex justify-end items-center p-2 border-b">
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={async () => {
                        try {
                          await refetch();
                        } catch (error) {
                          console.error("Error refetching evaluations:", error);
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
            ))}
          </Tabs>
        </div>
      </div>

      {/* Evaluation Detail Modal */}
      <EvaluationDetailModal
        open={showEvaluationDetail}
        onOpenChange={setShowEvaluationDetail}
        evaluationId={selectedEvaluation || undefined}
      />

            {/* Work Description Form Modal */}
      <WorkDescriptionForm
        open={showWorkDescriptionForm}
        onOpenChange={setShowWorkDescriptionForm}
        employeeName={currentUser?.name}
        department={currentUser?.department}
      />

      {/* Create Evaluation Modal */}
      <Dialog open={showCreateEvaluationModal} onOpenChange={setShowCreateEvaluationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo phiếu đánh giá mới</DialogTitle>
            <DialogDescription>
              Chọn tháng và năm để tạo phiếu đánh giá
            </DialogDescription>
          </DialogHeader>
          
          <CreateEvaluationForm 
            onConfirm={handleConfirmCreateEvaluation}
            onCancel={() => setShowCreateEvaluationModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
