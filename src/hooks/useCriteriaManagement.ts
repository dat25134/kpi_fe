import { useState, useCallback, useEffect } from 'react'
import { useRolesSelection } from './useRole'
import { useDeleteCriteria } from './useCriteria'
import { fetchCategoryWithCriteria } from '@/services/evaluation'
import { EvaluationCriteriaCategory, CriteriaManagementState, CriteriaManagementHandlers } from '@/types/evaluation'
import { calculateEvaluationStats } from '@/lib/utils'
import { toast } from 'sonner'

export const useCriteriaManagement = () => {
  const { data: roleData, isLoading: roleLoading, error: roleError } = useRolesSelection()
  const { trigger: deleteCriteriaTrigger, isMutating: isDeletingCriteria } = useDeleteCriteria()

  // State
  const [state, setState] = useState<CriteriaManagementState>({
    roleId: "",
    searchInput: "",
    search: "",
    showAddCategory: false,
    editCategory: null,
    showDeleteModal: false,
    deleteCategory: null,
    showCreateCriteria: null,
    categoryList: [],
    isLoading: false,
    isError: false,
    editCriteria: null,
    deleteCriteria: null,
    showDeleteCriteriaModal: false
  })

  // Fetch category list
  const fetchCategoryList = useCallback(async () => {
    if (!state.roleId) return

    setState(prev => ({ ...prev, isLoading: true, isError: false }))
    try {
      const res = await fetchCategoryWithCriteria({ role_id: state.roleId, search: state.search })
      setState(prev => ({ ...prev, categoryList: res.data || [] }))
    } catch (e) {
      setState(prev => ({ ...prev, isError: true, categoryList: [] }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.roleId, state.search])

  // Effects
  useEffect(() => {
    if (state.roleId) {
      fetchCategoryList()
    }
  }, [state.roleId, state.search, fetchCategoryList])

  useEffect(() => {
    if (state.isError) {
      toast.error("Lỗi tải dữ liệu tiêu chí. Vui lòng thử lại.")
    }
  }, [state.isError])

  // Calculate stats
  const stats = calculateEvaluationStats(state.categoryList)

  // Handlers
  const handleSearch = useCallback(() => {
    setState(prev => ({ ...prev, search: prev.searchInput }))
  }, [])

  const handleRoleChange = useCallback((value: string) => {
    setState(prev => ({
      ...prev,
      roleId: value,
      searchInput: "",
      search: ""
    }))
  }, [])

  const handleDeleteClick = useCallback((cat: { id: number; name: string }) => {
    setState(prev => ({
      ...prev,
      deleteCategory: cat,
      showDeleteModal: true
    }))
  }, [])

  const handleShowAddCategory = useCallback(() => {
    setState(prev => ({ ...prev, showAddCategory: true }))
  }, [])

  const handleCloseAddCategory = useCallback(() => {
    setState(prev => ({ ...prev, showAddCategory: false }))
  }, [])

  const handleEditCategory = useCallback((category: { id: number; name: string }) => {
    setState(prev => ({ ...prev, editCategory: category }))
  }, [])

  const handleCloseEditCategory = useCallback(() => {
    setState(prev => ({ ...prev, editCategory: null }))
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setState(prev => ({ ...prev, showDeleteModal: false, deleteCategory: null }))
  }, [])

  const handleShowCreateCriteria = useCallback((categoryId: number) => {
    setState(prev => ({ ...prev, showCreateCriteria: { categoryId } }))
  }, [])

  const handleCloseCreateCriteria = useCallback(() => {
    setState(prev => ({ ...prev, showCreateCriteria: null }))
  }, [])

  const handleEditCriteria = useCallback((criteria: any) => {
    setState(prev => ({ ...prev, editCriteria: criteria }))
  }, [])

  const handleCloseEditCriteria = useCallback(() => {
    setState(prev => ({ ...prev, editCriteria: null }))
  }, [])

  const handleDeleteCriteria = useCallback((criteria: any) => {
    setState(prev => ({
      ...prev,
      deleteCriteria: criteria,
      showDeleteCriteriaModal: true
    }))
  }, [])

  const handleCloseDeleteCriteriaModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showDeleteCriteriaModal: false,
      deleteCriteria: null
    }))
  }, [])

  const handleConfirmDeleteCriteria = useCallback(async () => {
    if (state.deleteCriteria?.id) {
      try {
        await deleteCriteriaTrigger({ id: state.deleteCriteria.id })
        toast.success("Xoá tiêu chí thành công!")
        handleCloseDeleteCriteriaModal()
        fetchCategoryList()
      } catch (e: any) {
        toast.error(e?.message || "Xoá thất bại")
      }
    }
  }, [state.deleteCriteria, deleteCriteriaTrigger, fetchCategoryList])

  const handleSuccess = useCallback(() => {
    fetchCategoryList()
  }, [fetchCategoryList])

  // Input handlers
  const setSearchInput = useCallback((value: string) => {
    setState(prev => ({ ...prev, searchInput: value }))
  }, [])

  return {
    // State
    state,
    roleData,
    roleLoading,
    roleError,
    stats,
    isDeletingCriteria,
    
    // Handlers
    handleSearch,
    handleRoleChange,
    handleDeleteClick,
    handleShowAddCategory,
    handleCloseAddCategory,
    handleEditCategory,
    handleCloseEditCategory,
    handleCloseDeleteModal,
    handleShowCreateCriteria,
    handleCloseCreateCriteria,
    handleEditCriteria,
    handleCloseEditCriteria,
    handleDeleteCriteria,
    handleCloseDeleteCriteriaModal,
    handleConfirmDeleteCriteria,
    handleSuccess,
    
    // Input setters
    setSearchInput,
    
    // Actions
    fetchCategoryList
  }
} 