import { useState, useEffect, useCallback } from 'react'
import { useEvaluationDetail } from './useEvaluationDetail'
import { useEvaluation } from './useEvaluation'
import { useUser } from './useUser'
import { EvaluationCriteriaDetail, EvaluationDetailModalState, EvaluationDetailModalHandlers } from '@/types/evaluation'
import { formatEvaluationDataForSave, getActionButtonsConfig } from '@/lib/utils'
import { toast } from 'sonner'

export const useEvaluationDetailModal = (evaluationId?: number | string, open?: boolean, onSuccess?: () => void) => {
  const { data, isLoading, error, refetch } = useEvaluationDetail(evaluationId, open)
  const { saveEvaluation } = useEvaluation()
  const { user } = useUser()
  
  // State
  const [state, setState] = useState<EvaluationDetailModalState>({
    activeTab: "criteria",
    details: [],
    saving: false
  })

  // Field errors for form
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  // Modal confirm state
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<null | (() => Promise<void>)>(null)
  const [confirmMessage, setConfirmMessage] = useState<string>("")

  // Update details when data changes
  useEffect(() => {
    if (data?.details) {
      setState(prev => ({ ...prev, details: data.details }))
    }
  }, [data?.details])

  // Handler to show confirm modal
  const showConfirm = useCallback((action: () => Promise<void>, message: string) => {
    setConfirmAction(() => action)
    setConfirmMessage(message)
    setShowConfirmModal(true)
  }, [])

  // Handler to actually execute the confirmed action
  const handleConfirm = useCallback(async () => {
    setShowConfirmModal(false)
    if (confirmAction) {
      await confirmAction()
    }
  }, [confirmAction])

  // Handlers
  const handleScoreChange = useCallback((id: number, field: string, value: string) => {
    setState(prev => ({
      ...prev,
      details: prev.details.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
    // Xóa lỗi khi user sửa lại trường đó
    setFieldErrors({})
  }, [])
  
  const handleCommentChange = useCallback((id: number, field: string, value: string) => {
    setState(prev => ({
      ...prev,
      details: prev.details.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }, [])

  // Gửi nháp không cần confirm
  const handleSaveDraft = useCallback(async () => {
    if (!data || !evaluationId) return
    try {
      setState(prev => ({ ...prev, saving: true }))
      setFieldErrors({})
      const requestData = formatEvaluationDataForSave(state.details, 'draft')
      await saveEvaluation(Number(evaluationId), requestData)
      toast.success("Đã lưu nháp thành công!")
      await refetch()
    } catch (error: any) {
      setFieldErrors(error?.response?.data?.errors || {})
      toast.error(error?.response?.data?.message || "Không thể lưu nháp. Vui lòng thử lại!")
    } finally {
      setState(prev => ({ ...prev, saving: false }))
    }
  }, [data, evaluationId, state.details, saveEvaluation, refetch])

  // Gửi submitted cần confirm
  const doSubmit = useCallback(async () => {
    if (!data || !evaluationId) return
    try {
      setState(prev => ({ ...prev, saving: true }))
      setFieldErrors({})
      const requestData = formatEvaluationDataForSave(state.details, 'submitted')
      await saveEvaluation(Number(evaluationId), requestData)
      toast.success("Đã gửi đánh giá thành công!")
      await refetch()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      setFieldErrors(error?.response?.data?.errors || {})
      toast.error(error?.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại!")
    } finally {
      setState(prev => ({ ...prev, saving: false }))
    }
  }, [data, evaluationId, state.details, saveEvaluation, refetch, onSuccess])

  const handleSubmit = useCallback(() => {
    showConfirm(
      doSubmit,
      "Sau khi gửi, các dữ liệu đánh giá này sẽ không thể chỉnh sửa. Bạn có chắc chắn muốn gửi đánh giá?"
    )
  }, [doSubmit, showConfirm])

  // Gửi level1_approved cần confirm
  const doLevel1Approve = useCallback(async () => {
    if (!data || !evaluationId) return
    try {
      setState(prev => ({ ...prev, saving: true }))
      setFieldErrors({})
      const requestData = formatEvaluationDataForSave(state.details, 'level1_approved')
      await saveEvaluation(Number(evaluationId), requestData)
      toast.success("Đã đánh giá cấp 1 thành công!")
      await refetch()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      setFieldErrors(error?.response?.data?.errors || {})
      toast.error(error?.response?.data?.message || "Không thể đánh giá cấp 1. Vui lòng thử lại!")
    } finally {
      setState(prev => ({ ...prev, saving: false }))
    }
  }, [data, evaluationId, state.details, saveEvaluation, refetch, onSuccess])

  const handleLevel1Approve = useCallback(() => {
    showConfirm(
      doLevel1Approve,
      "Sau khi gửi, các dữ liệu đánh giá này sẽ không thể chỉnh sửa. Bạn có chắc chắn muốn gửi đánh giá?"
    )
  }, [doLevel1Approve, showConfirm])

  // Gửi level2_approved cần confirm
  const doLevel2Approve = useCallback(async () => {
    if (!data || !evaluationId) return
    try {
      setState(prev => ({ ...prev, saving: true }))
      setFieldErrors({})
      const requestData = formatEvaluationDataForSave(state.details, 'level2_approved')
      await saveEvaluation(Number(evaluationId), requestData)
      toast.success("Đã đánh giá cấp 2 thành công!")
      await refetch()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      setFieldErrors(error?.response?.data?.errors || {})
      toast.error(error?.response?.data?.message || "Không thể đánh giá cấp 2. Vui lòng thử lại!")
    } finally {
      setState(prev => ({ ...prev, saving: false }))
    }
  }, [data, evaluationId, state.details, saveEvaluation, refetch, onSuccess])

  const handleLevel2Approve = useCallback(() => {
    showConfirm(
      doLevel2Approve,
      "Sau khi gửi, các dữ liệu đánh giá này sẽ không thể chỉnh sửa. Bạn có chắc chắn muốn gửi đánh giá?"
    )
  }, [doLevel2Approve, showConfirm])

  // Gửi completed không cần confirm (nếu muốn có thì thêm tương tự)
  const handleComplete = useCallback(async () => {
    if (!data || !evaluationId) return
    try {
      setState(prev => ({ ...prev, saving: true }))
      setFieldErrors({})
      const requestData = formatEvaluationDataForSave(state.details, 'completed')
      await saveEvaluation(Number(evaluationId), requestData)
      toast.success("Đã hoàn thành đánh giá!")
      await refetch()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      setFieldErrors(error?.response?.data?.errors || {})
      toast.error(error?.response?.data?.message || "Không thể hoàn thành đánh giá. Vui lòng thử lại!")
    } finally {
      setState(prev => ({ ...prev, saving: false }))
    }
  }, [data, evaluationId, state.details, saveEvaluation, refetch, onSuccess])

  // Tab change handler
  const handleTabChange = useCallback((tab: string) => {
    setState(prev => ({ ...prev, activeTab: tab }))
  }, [])

  // Computed values
  const canEdit = data && user ? getActionButtonsConfig(data.status, user.role) : null
  
  const actionButtonsConfig = data && user ? getActionButtonsConfig(data.status, user.role) : {
    canSaveDraft: false,
    canSubmit: false,
    canLevel1Approve: false,
    canLevel2Approve: false,
    canComplete: false,
    canUpdateLevel1: false,
    canUpdateLevel2: false
  }

  return {
    // State
    state,
    data,
    isLoading,
    error,
    user,
    canEdit,
    actionButtonsConfig,
    showConfirmModal,
    confirmMessage,
    setShowConfirmModal,
    handleConfirm,
    fieldErrors,
    
    // Handlers
    handleScoreChange,
    handleCommentChange,
    handleSaveDraft,
    handleSubmit,
    handleLevel1Approve,
    handleLevel2Approve,
    handleComplete,
    handleTabChange,
    
    // Actions
    refetch
  }
} 