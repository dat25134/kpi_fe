"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEvaluationForm } from "@/hooks/useEvaluationForm"
import EvaluationFilterBar from "@/components/evaluation/EvaluationFilterBar"
import EvaluationTable from "@/components/evaluation/EvaluationTable"
import EvaluationSidebar from "@/components/evaluation/EvaluationSidebar"
import EvaluationActions from "@/components/evaluation/EvaluationActions"
import EvaluationPagination from "@/components/evaluation/EvaluationPagination"
import EvaluationModals from "@/components/evaluation/EvaluationModals"
import EvaluationTabContent from "@/components/evaluation/EvaluationTabContent"

export default function EvaluationForm() {
  const {
    // State
    formState,
    filterState,
    evaluations,
    loading,
    error,
    pagination,
    visibleTabs,
    currentUser,
    
    // Handlers
    handleViewEvaluation,
    handleCreateEvaluation,
    handleConfirmCreateEvaluation,
    handleDeleteEvaluation,
    handleApplyFilter,
    handleClearFilter,
    handleRefresh,
    handlePageChange,
    handleTabChange,
    handleCloseEvaluationDetail,
    handleCloseCreateModal,
    
    // Filter setters
    setFilterNameInput,
    setFilterStatusInput,
    setFilterRatingInput,
    setFilterPeriodInput
  } = useEvaluationForm()

  // Filter props
  const filterProps = {
    filterNameInput: filterState.filterNameInput,
    setFilterNameInput,
    filterStatusInput: filterState.filterStatusInput,
    setFilterStatusInput,
    filterRatingInput: filterState.filterRatingInput,
    setFilterRatingInput,
    filterPeriodInput: filterState.filterPeriodInput,
    setFilterPeriodInput,
    onApply: handleApplyFilter,
    onClear: handleClearFilter
  }

  // Table props
  const tableProps = {
    evaluations,
    loading,
    error,
    onView: handleViewEvaluation,
    onDelete: handleDeleteEvaluation
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
          activeTab={formState.activeTab}
          onTabChange={handleTabChange}
        />

        {/* Main Content */}
        <div className="flex-1 border overflow-x-auto">
          <Tabs defaultValue="personal" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 overflow-x-auto">
              {visibleTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4",
                    formState.activeTab === tab.value ? "text-blue-600" : "",
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Personal Tab */}
            <EvaluationTabContent
              tabValue="personal"
              filterProps={filterProps}
              tableProps={tableProps}
              pagination={pagination}
              onPageChange={handlePageChange}
              onCreateEvaluation={handleCreateEvaluation}
              onRefresh={handleRefresh}
              showCreateButton={true}
            />

            {/* Other Tabs */}
            {visibleTabs.slice(1).map((tab) => (
              <EvaluationTabContent
                key={tab.value}
                tabValue={tab.value}
                filterProps={filterProps}
                tableProps={tableProps}
                pagination={pagination}
                onPageChange={handlePageChange}
                onCreateEvaluation={handleCreateEvaluation}
                onRefresh={handleRefresh}
                showCreateButton={false}
              />
            ))}
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <EvaluationModals
        showEvaluationDetail={formState.showEvaluationDetail}
        setShowEvaluationDetail={handleCloseEvaluationDetail}
        selectedEvaluation={formState.selectedEvaluation}
        showCreateEvaluationModal={formState.showCreateEvaluationModal}
        setShowCreateEvaluationModal={handleCloseCreateModal}
        currentUser={currentUser}
        onConfirmCreateEvaluation={handleConfirmCreateEvaluation}
      />
    </div>
  )
}
