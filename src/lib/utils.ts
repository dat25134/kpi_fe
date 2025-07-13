import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatVietnamesePhoneNumber(input: string): string {
  // Xóa ký tự không phải số
  const digits = input.replace(/\D/g, '');
  // Format: 4-3-3 hoặc 3-3-4 tùy đầu số
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return digits.slice(0, 4) + ' ' + digits.slice(4);
  return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 11);
}

export function formatVND(input: string): string {
  // Xóa ký tự không phải số
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';
  // Thêm dấu chấm phân tách hàng nghìn
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join(" ");
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<any, any>;
    return extractTextFromReactNode(element.props.children);
  }
  return "";
}

export function getAvatarFromName(name: string): string {
  const nameParts = name.split(" ")
  return nameParts.length >= 2
    ? nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    : name.substring(0, 2).toUpperCase()
}

export function formatDate(date: string, format: string = "DD/MM/YYYY"): string {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const minute = String(dateObj.getMinutes()).padStart(2, '0');
  return format.replace("DD", day).replace("MM", month).replace("YYYY", year.toString()).replace("HH", hour).replace("mm", minute);
}


// Helper functions
export function getStatusLabel(status: string) {
  switch (status) {
    case "draft":
      return "CHỜ TỰ ĐÁNH GIÁ"
    case "submitted":
      return "CHỜ ĐÁNH GIÁ CẤP 1"
    case "level1_approved":
      return "CHỜ ĐÁNH GIÁ CẤP 2"
    case "level2_approved":
      return "CHỜ PHÊ DUYỆT"
    case "completed":
      return "ĐÃ PHÊ DUYỆT"
    default:
      return "KHÔNG XÁC ĐỊNH"
  }
}

export function getStatusType(status: string) {
  switch (status) {
    case "draft":
      return "waiting"
    case "submitted":
      return "review1"
    case "level1_approved":
      return "review2"
    case "level2_approved":
      return "approved"
    case "completed":
      return "approved"
    default:
      return "unknown"
  }
}

export function getStatusBadgeVariant(statusType: string) {
  switch (statusType) {
    case "waiting":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100"
    case "review1":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    case "review2":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export function getResultLevelName(resultLevel: string) {
  switch (resultLevel) {
    case "1":
      return "Chưa đạt (1 điểm)"
    case "2":
      return "Đạt, còn hạn chế (2 điểm)"
    case "3":
      return "Đạt (3 điểm)"
    case "4":
      return "Đạt vượt mức (4 điểm)"
    default:
      return "Không xác định"
  }
}

// Evaluation utility functions
export function getQualityRating(points: number): string {
  if (points >= 90) return "A"
  if (points >= 70) return "B"
  if (points >= 50) return "C"
  return "D"
}

export function getQualityRatingLabel(rating: string): string {
  switch (rating) {
    case "A":
      return "Hoàn thành xuất sắc nhiệm vụ"
    case "B":
      return "Hoàn thành tốt nhiệm vụ"
    case "C":
      return "Hoàn thành nhiệm vụ"
    case "D":
      return "Không hoàn thành nhiệm vụ"
    default:
      return "Không xác định"
  }
}

export function getQualityRatingBadgeVariant(rating: string): string {
  switch (rating) {
    case "A":
      return "bg-green-100 text-green-800"
    case "B":
      return "bg-blue-100 text-blue-800"
    case "C":
      return "bg-yellow-100 text-yellow-800"
    case "D":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function calculateTotalScore(details: any[]): number {
  return 100;
}

export function calculateKPIScore(workDescriptions: any[]): number {
  if (!workDescriptions || workDescriptions.length === 0) return 0
  const totalScore = workDescriptions.reduce((sum, item) => sum + parseFloat(item?.final_score || "0"), 0)
  const totalWeight = workDescriptions.reduce((sum, item) => sum + parseFloat(item?.task_weight?.toString() || "0"), 0)
  return totalWeight > 0 ? totalScore / totalWeight : 0
}

export function getScoreColor(score: string | null, maxScore: string): string {
  if (!score) return "text-gray-500"
  const percentage = (parseFloat(score) / parseFloat(maxScore)) * 100
  if (percentage >= 90) return "text-green-600"
  if (percentage >= 70) return "text-blue-600"
  if (percentage >= 50) return "text-yellow-600"
  return "text-red-600"
}

export function calculatePoints(resultLevel: number): number {
  switch (resultLevel) {
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
    case 4:
      return 4
    default:
      return 3
  }
}

export function calculateWeightedQualityPoints(points: number, qualityWeight: number): number {
  return (points * qualityWeight) / 5
}

export function calculateFinalPoints(weightedQualityPoints: number, complexityWeight: number): number {
  return weightedQualityPoints * complexityWeight
}

// Utility functions cho evaluation
export const getEvaluationStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: 'Nháp',
    submitted: 'Đã gửi',
    level1_approved: 'Đã đánh giá cấp 1',
    level2_approved: 'Đã đánh giá cấp 2',
    completed: 'Hoàn thành'
  }
  return statusMap[status] || status
}

export const getEvaluationStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    level1_approved: 'bg-yellow-100 text-yellow-800',
    level2_approved: 'bg-green-100 text-green-800',
    completed: 'bg-purple-100 text-purple-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

export const canEditEvaluation = (currentStatus: string, userRole: string, targetStatus: string): boolean => {
  // Quy tắc chuyển đổi status
  const statusFlow = {
    draft: ['draft', 'submitted'],
    submitted: ['submitted', 'level1_approved'],
    level1_approved: ['level1_approved', 'level2_approved'],
    level2_approved: ['level2_approved', 'completed'],
    completed: ['completed']
  }

  const allowedTransitions = statusFlow[currentStatus as keyof typeof statusFlow] || []
  return allowedTransitions.includes(targetStatus)
}

export const canEditByRole = (status: string, userRole: string): boolean => {
  // Nhân viên chỉ có thể edit khi status là draft
  if (userRole === 'nhanvien' || userRole === 'chuyenvien') {
    return status === 'draft'
  }
  
  // Trưởng phòng có thể đánh giá cấp 1
  if (userRole === 'truongphong') {
    return status === 'submitted' || status === 'level1_approved'
  }
  
  // Phó phòng có thể đánh giá cấp 1
  if (userRole === 'phophong') {
    return status === 'submitted' || status === 'level1_approved'
  }
  
  // Admin/Chủ tịch/Phó chủ tịch có thể đánh giá tất cả
  if (userRole === 'admin' || userRole === 'chutich' || userRole === 'phochutich') {
    return true
  }
  
  return false
}

export const formatEvaluationDataForSave = (
  details: any[],
  status: string,
  workDescriptions?: any[]
) => {
  const requestData: any = {
    status
  }

  // Gửi evaluation_details cho các trạng thái cần thiết
  if (
    status === 'draft' ||
    status === 'submitted' || // Thêm dòng này để gửi evaluation_details khi submitted
    status === 'level1_approved' ||
    status === 'level2_approved'
  ) {
    requestData.evaluation_details = details.map(detail => {
      const item: any = {
        criteria_id: detail.criteria.id
      }

      if (status === 'draft') {
        if (detail.self_score) item.self_score = parseFloat(detail.self_score)
        if (detail.self_comment) item.self_comment = detail.self_comment
      } else if (status === 'submitted') {
        if (detail.self_score) item.self_score = parseFloat(detail.self_score)
        if (detail.self_comment) item.self_comment = detail.self_comment
      } else if (status === 'level1_approved') {
        if (detail.level1_score) item.level1_score = parseFloat(detail.level1_score)
        if (detail.level1_comment) item.level1_comment = detail.level1_comment
      } else if (status === 'level2_approved') {
        if (detail.level2_score) item.level2_score = parseFloat(detail.level2_score)
        if (detail.level2_comment) item.level2_comment = detail.level2_comment
      }

      return item
    }).filter(item => {
      // Chỉ gửi những item có dữ liệu
      return Object.keys(item).length > 1 // Có ít nhất 1 field ngoài criteria_id
    })
  }

  // Tạm thời bỏ qua work_descriptions theo yêu cầu
  // if (workDescriptions && workDescriptions.length > 0) {
  //   requestData.work_descriptions = workDescriptions.map(wd => ({
  //     id: wd.id,
  //     result_level: wd.result_level,
  //     quality_weight: wd.quality_weight
  //   }))
  // }

  return requestData
}

// Evaluation utility functions for refactoring
export const getTabTypeParam = (tab: string): string => {
  switch (tab) {
    case "personal": return "personal";
    case "nhanvien": return "nhanvien";
    case "chuyenvien": return "chuyenvien";
    case "phophong": return "phophong";
    case "truongphong": return "truongphong";
    default: return "personal";
  }
}

export const getVisibleTabs = (currentUserRole: string) => {
  const tabs = []
  
  // Personal tab - always visible
  tabs.push({ value: "personal", label: "Cá nhân" })
  
  // Role-based tabs
  if (currentUserRole === "chutich" || currentUserRole === "phochutich" || currentUserRole === "admin") {
    // Chủ tịch/Phó chủ tịch can see all tabs
    tabs.push(
      { value: "nhanvien", label: "Nhân viên" },
      { value: "chuyenvien", label: "Chuyên viên" },
      { value: "phophong", label: "Phó phòng" },
      { value: "truongphong", label: "Trưởng phòng" }
    )
  } else if (currentUserRole === "truongphong" || currentUserRole === "phophong") {
    // Trưởng phòng/Phó phòng can see employee and specialist tabs
    tabs.push(
      { value: "nhanvien", label: "Nhân viên" },
      { value: "chuyenvien", label: "Chuyên viên" }
    )
  }
  
  return tabs
}

export const getQualityRatingBadge = (rating: string) => {
  const variants = {
    "A": "bg-green-100 text-green-800",
    "B": "bg-blue-100 text-blue-800", 
    "C": "bg-yellow-100 text-yellow-800",
    "D": "bg-red-100 text-red-800"
  }
  const labels = {
    "A": "Hoàn thành xuất sắc nhiệm vụ (A)",
    "B": "Hoàn thành tốt nhiệm vụ (B)",
    "C": "Hoàn thành nhiệm vụ (C)",
    "D": "Không hoàn thành nhiệm vụ (D)"
  }
  const shortLabels = {
    "A": "A",
    "B": "B",
    "C": "C",
    "D": "D"
  }
  return {
    variant: variants[rating as keyof typeof variants],
    label: labels[rating as keyof typeof labels],
    shortLabel: shortLabels[rating as keyof typeof shortLabels]
  }
}

export const calculateEvaluationStats = (categoryList: any[]) => {
  const totalCriteria = categoryList.reduce(
    (sum: number, cat: any) => sum + cat.evaluation_criteria.length,
    0
  )
  const totalMaxScore = categoryList.reduce(
    (sum: number, cat: any) =>
      sum + cat.evaluation_criteria.reduce((s: number, c: any) => s + parseFloat(c.max_score), 0),
    0
  )
  return { totalCriteria, totalMaxScore }
}

export const getActionButtonsConfig = (currentStatus: string, userRole: string) => {
  const config = {
    canSaveDraft: false,
    canSubmit: false,
    canLevel1Approve: false,
    canLevel2Approve: false,
    canComplete: false,
    canUpdateLevel1: false,
    canUpdateLevel2: false
  }

  // Nhân viên/Chuyên viên
  if (userRole === 'nhanvien' || userRole === 'chuyenvien') {
    if (currentStatus === 'draft') {
      config.canSaveDraft = true
      config.canSubmit = true
    }
  }
  
  // Trưởng phòng/Phó phòng
  if (userRole === 'truongphong' || userRole === 'phophong') {
    if (currentStatus === 'submitted') {
      config.canLevel1Approve = true
    } else if (currentStatus === 'level1_approved') {
      config.canUpdateLevel1 = true
    }
  }
  
  // Admin/Chủ tịch/Phó chủ tịch
  if (userRole === 'admin' || userRole === 'chutich' || userRole === 'phochutich') {
    if (currentStatus === 'submitted') {
      config.canLevel1Approve = true
    } else if (currentStatus === 'level1_approved') {
      config.canUpdateLevel1 = true
      config.canLevel2Approve = true
    } else if (currentStatus === 'level2_approved') {
      config.canUpdateLevel2 = true
      config.canComplete = true
    }
  }

  return config
}

export const formatPeriodFilter = (filterPeriodInput: Date | null): string => {
  if (filterPeriodInput) {
    return `${filterPeriodInput.getMonth() + 1}/${filterPeriodInput.getFullYear()}`
  }
  return "all"
}

export const parsePeriodFilter = (filterPeriod: string): { month?: number; year?: number } => {
  if (filterPeriod !== "all") {
    const [month, year] = filterPeriod.split('/')
    return {
      month: parseInt(month),
      year: parseInt(year)
    }
  }
  return {}
}

export const getEvaluationTableRowKey = (item: any): string => {
  return `${item.id}-${item.user?.id}-${item.month}-${item.year}`
}

export const getEvaluationTableRowData = (item: any, index: number) => {
  return {
    id: item.id,
    index: index + 1,
    name: item.user?.name || '',
    department: item.user?.department || '',
    roleName: item.user?.roleName || '',
    period: `${item.month}/${item.year}`,
    totalScore: item.total_score || '0',
    finalGrade: item.final_grade || '',
    status: item.status || '',
    avatarInitials: item.user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || ''
  }
}

