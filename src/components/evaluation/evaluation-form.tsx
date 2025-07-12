"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEvaluation } from "@/hooks/useEvaluation"
import { useUser } from "@/hooks/useUser"
import EvaluationFilterBar from "./EvaluationFilterBar"
import EvaluationTable from "./EvaluationTable"
import EvaluationSidebar from "./EvaluationSidebar"
import EvaluationActions from "./EvaluationActions"
import EvaluationPagination from "./EvaluationPagination"
import EvaluationModals from "./EvaluationModals"
import { toast } from "sonner"

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
  const [showEvaluationDetail, setShowEvaluationDetail] = useState(false)
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
    }
  }, [error])

  // Determine which tabs to show based on user role
  const getVisibleTabs = () => {
    const tabs = []
    
    // Personal tab - always visible
    tabs.push({ value: "personal", label: "Cá nhân" })
    
    // Role-based tabs
    if (currentUserRole === "chutich" || currentUserRole === "phochutich" || currentUserRole === "admin") {
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
    
    return tabs
  }

  const visibleTabs = getVisibleTabs()

  const handleViewEvaluation = (evaluationId: string) => {
    setSelectedEvaluation(evaluationId)
    setShowEvaluationDetail(true)
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

  const handleDeleteEvaluation = async (evaluationId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa phiếu đánh giá này?")) {
      try {
        await deleteEvaluation(evaluationId);
      } catch (error) {
        console.error("Error deleting evaluation:", error);
      }
    }
  }

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

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refetching evaluations:", error);
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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
        <EvaluationSidebar 
          currentUserDepartment={currentUser?.department?.name || "Phòng ban"}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

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
              {/* Filter Bar */}
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
              <EvaluationActions
                onCreateEvaluation={handleCreateEvaluation}
                onRefresh={handleRefresh}
                showCreateButton={true}
              />

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

              {/* Pagination */}
              {pagination && (
                <EvaluationPagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </TabsContent>

            {visibleTabs.slice(1).map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                {/* Filter Bar */}
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
                <EvaluationActions
                  onCreateEvaluation={handleCreateEvaluation}
                  onRefresh={handleRefresh}
                  showCreateButton={false}
                />

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

                {/* Pagination */}
                {pagination && (
                  <EvaluationPagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <EvaluationModals
        showEvaluationDetail={showEvaluationDetail}
        setShowEvaluationDetail={setShowEvaluationDetail}
        selectedEvaluation={selectedEvaluation}
        showCreateEvaluationModal={showCreateEvaluationModal}
        setShowCreateEvaluationModal={setShowCreateEvaluationModal}
        currentUser={currentUser}
        onConfirmCreateEvaluation={handleConfirmCreateEvaluation}
      />
    </div>
  )
}
