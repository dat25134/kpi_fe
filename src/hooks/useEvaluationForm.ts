import { useState, useCallback } from 'react'
import { useEvaluation } from './useEvaluation'
import { useUser } from './useUser'
import { EvaluationFilterState, EvaluationFormState, EvaluationFormHandlers } from '@/types/evaluation'
import { getTabTypeParam, getVisibleTabs, formatPeriodFilter, parsePeriodFilter } from '@/lib/utils'
import { toast } from 'sonner'

export const useEvaluationForm = () => {
  // Form state
  const [formState, setFormState] = useState<EvaluationFormState>({
    activeTab: "personal",
    currentPage: 1,
    selectedEvaluation: null,
    showEvaluationDetail: false,
    showCreateEvaluationModal: false
  })

  // Filter state
  const [filterState, setFilterState] = useState<EvaluationFilterState>({
    filterNameInput: "",
    filterStatusInput: "all",
    filterRatingInput: "all",
    filterPeriodInput: null,
    filterName: "",
    filterStatus: "all",
    filterRating: "all",
    filterPeriod: "all"
  })

  // Get current user
  const { user } = useUser()
  const currentUser = user || null
  const currentUserRole = currentUser?.role || "nhanvien"

  // Get evaluations data
  const { 
    evaluations, 
    loading, 
    error, 
    pagination, 
    refetch,
    createEvaluation,
    deleteEvaluation 
  } = useEvaluation({
    page: formState.currentPage,
    limit: 10,
    type: getTabTypeParam(formState.activeTab),
    status: filterState.filterStatus !== "all" ? filterState.filterStatus : undefined,
    final_grade: filterState.filterRating !== "all" ? filterState.filterRating : undefined,
    month: parsePeriodFilter(filterState.filterPeriod).month,
    year: parsePeriodFilter(filterState.filterPeriod).year,
    name: filterState.filterName || undefined,
  })

  // Get visible tabs based on user role
  const visibleTabs = getVisibleTabs(currentUserRole)

  // Handlers
  const handleViewEvaluation = useCallback((evaluationId: string) => {
    setFormState(prev => ({
      ...prev,
      selectedEvaluation: evaluationId,
      showEvaluationDetail: true
    }))
  }, [])

  const handleCreateEvaluation = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      showCreateEvaluationModal: true
    }))
  }, [])

  const handleConfirmCreateEvaluation = useCallback(async (month: number, year: number) => {
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
      setFormState(prev => ({
        ...prev,
        showCreateEvaluationModal: false
      }))
      
    } catch (error) {
      console.error("Lỗi khi tạo phiếu đánh giá:", error)
      toast.error("Không thể tạo phiếu đánh giá. Vui lòng thử lại!")
      refetch()
    }
  }, [createEvaluation, refetch])

  const handleDeleteEvaluation = useCallback(async (evaluationId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa phiếu đánh giá này?")) {
      try {
        await deleteEvaluation(evaluationId)
      } catch (error) {
        console.error("Error deleting evaluation:", error)
      }
    }
  }, [deleteEvaluation])

  const handleApplyFilter = useCallback(() => {
    setFormState(prev => ({ ...prev, currentPage: 1 }))
    setFilterState(prev => ({
      ...prev,
      filterName: prev.filterNameInput,
      filterStatus: prev.filterStatusInput,
      filterRating: prev.filterRatingInput,
      filterPeriod: formatPeriodFilter(prev.filterPeriodInput)
    }))
  }, [])

  const handleClearFilter = useCallback(() => {
    setFormState(prev => ({ ...prev, currentPage: 1 }))
    setFilterState({
      filterNameInput: "",
      filterStatusInput: "all",
      filterRatingInput: "all",
      filterPeriodInput: null,
      filterName: "",
      filterStatus: "all",
      filterRating: "all",
      filterPeriod: "all"
    })
  }, [])

  const handleRefresh = useCallback(async () => {
    try {
      await refetch()
    } catch (error) {
      console.error("Error refetching evaluations:", error)
    }
  }, [refetch])

  const handlePageChange = useCallback((page: number) => {
    setFormState(prev => ({ ...prev, currentPage: page }))
  }, [])

  const handleTabChange = useCallback((tab: string) => {
    setFormState(prev => ({ ...prev, activeTab: tab, currentPage: 1 }))
  }, [])

  const handleCloseEvaluationDetail = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      showEvaluationDetail: false,
      selectedEvaluation: null
    }))
  }, [])

  const handleCloseCreateModal = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      showCreateEvaluationModal: false
    }))
  }, [])

  // Filter input handlers
  const setFilterNameInput = useCallback((value: string) => {
    setFilterState(prev => ({ ...prev, filterNameInput: value }))
  }, [])

  const setFilterStatusInput = useCallback((value: string) => {
    setFilterState(prev => ({ ...prev, filterStatusInput: value }))
  }, [])

  const setFilterRatingInput = useCallback((value: string) => {
    setFilterState(prev => ({ ...prev, filterRatingInput: value }))
  }, [])

  const setFilterPeriodInput = useCallback((value: Date | null) => {
    setFilterState(prev => ({ ...prev, filterPeriodInput: value }))
  }, [])

  return {
    // State
    formState,
    filterState,
    evaluations,
    loading,
    error,
    pagination,
    visibleTabs,
    currentUser,
    currentUserRole,
    
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
    setFilterPeriodInput,
    
    // Actions
    refetch
  }
} 