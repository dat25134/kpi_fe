// Types cho hệ thống đánh giá theo bộ tiêu chí mới

export interface EvaluationCriteria {
  id: string;
  name: string;
  maxPoints: number;
  description?: string;
  subCriteria?: EvaluationSubCriteria[];
}

export interface EvaluationSubCriteria {
  id: string;
  name: string;
  maxPoints: number;
  description?: string;
}

// Interface cho bảng mô tả công việc (KPI)
export interface WorkDescriptionItem {
  id: number;
  task_status: string;
  task_start_date: string;
  task_due_date: string;
  task_weight: number;
  task_title: string;
  task_description: string | null;
  unit: string;
  target: string;
  complexity_weight: number;
  quality_weight: number;
  result_level: number;
  result_score: string;
  final_score: string;
  explanation: string;
  order: number;
}

// Interface cho phiếu đánh giá
export interface EvaluationForm {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  evaluationMonth: string;
  evaluationYear: string;
  targetType: any;
  
  // Điểm đánh giá
  politicalPoints: number;
  ethicsPoints: number;
  workStylePoints: number;
  disciplinePoints: number;
  digitalTransformationPoints: number;
  leadershipPoints: number;
  taskPerformancePoints: number;
  
  // Điểm trừ
  deductionPoints: number;
  
  // Tổng điểm
  totalPoints: number;
  
  // Xếp loại
  qualityRating: any;
  
  // Bảng mô tả công việc
  workDescriptionItems: WorkDescriptionItem[];
  
  // Thông tin đánh giá
  selfEvaluationDate: string;
  level1Evaluator: string;
  level1EvaluationDate: string;
  level2Evaluator: string;
  level2EvaluationDate: string;
  
  // Trạng thái
  status: EvaluationStatus;
  
  // Ghi chú
  notes?: string;
}

// Trạng thái đánh giá
export enum EvaluationStatus {
  DRAFT = "draft",                    // Nháp
  SELF_EVALUATED = "self_evaluated",  // Đã tự đánh giá
  LEVEL1_REVIEWED = "level1_reviewed", // Đã đánh giá cấp 1
  LEVEL2_REVIEWED = "level2_reviewed", // Đã đánh giá cấp 2
  APPROVED = "approved",              // Đã phê duyệt
  PUBLISHED = "published"             // Đã công bố
}

// Interface cho kết quả KPI
export interface KPICalculation {
  totalWeightedPoints: number;
  totalComplexityWeight: number;
  kpiScore: number;
  kpiRating: string;
  qualityLevel: any;
}

// Interface cho báo cáo tổng hợp
export interface EvaluationReport {
  id: string;
  month: string;
  year: string;
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  excellentCount: number;
  goodCount: number;
  achievedCount: number;
  notAchievedCount: number;
  averageScore: number;
  evaluations: EvaluationForm[];
} 

export interface EvaluationUser {
  id: number
  name: string
  department: string
  role: string
}

export interface Evaluation {
  id: number
  user: EvaluationUser
  month: number
  year: number
  status: string
  final_grade: string
  total_score: string
}

export interface EvaluationResponse {
  message: string
  data: Evaluation[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

// Interface cho chi tiết đánh giá từ API
export interface EvaluationCriteriaDetail {
  id: number
  criteria: {
    id: number
    name: string
    category: string
    max_score: string
  }
  self_score: string | null
  self_comment: string | null
  level1_score: string | null
  level1_comment: string | null
  level2_score: string | null
  level2_comment: string | null
  final_score: string | null
}

export interface EvaluationDetail {
  id: number
  user: EvaluationUser
  month: number
  year: number
  status: string
  final_grade: string
  total_score: string
  details: EvaluationCriteriaDetail[]
  work_descriptions: WorkDescriptionItem[]
}

// New interfaces for component refactoring
export interface EvaluationHeaderInfoProps {
  user: EvaluationUser
  month: number
  year: number
}

export interface EvaluationTabsContainerProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export interface WorkDescriptionTableProps {
  workDescriptions: WorkDescriptionItem[]
}

export interface EvaluationSummaryProps {
  details: EvaluationCriteriaDetail[]
  totalScore: number
}

export interface QualityRatingDisplayProps {
  score: number
  showLabel?: boolean
  showBadge?: boolean
}

export interface EvaluationSidebarProps {
  currentUserDepartment: string
  activeTab: string
  onTabChange: (tab: string) => void
}

export interface EvaluationActionsProps {
  onCreateEvaluation: () => void
  onRefresh: () => void
  showCreateButton?: boolean
}

export interface EvaluationPaginationProps {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  onPageChange: (page: number) => void
}

export interface WorkItemFormProps {
  item: Partial<WorkDescriptionItem>
  onSave: (item: WorkDescriptionItem) => void
  onCancel: () => void
  isEditing?: boolean
}

export interface WorkItemTableProps {
  items: WorkDescriptionItem[]
  onEdit: (id: number, field?: string, value?: any) => void
  onDelete: (id: number) => void
  isReadOnly?: boolean
}

export interface CriteriaCategoryProps {
  category: string
  criteria: EvaluationCriteriaDetail[]
  isReadOnly?: boolean
  onScoreChange?: (id: number, field: string, value: string) => void
  onCommentChange?: (id: number, field: string, value: string) => void
}

export interface CriteriaItemProps {
  item: EvaluationCriteriaDetail
  index: number
  isReadOnly?: boolean
  onScoreChange?: (id: number, field: string, value: string) => void
  onCommentChange?: (id: number, field: string, value: string) => void
}

export interface ScoreInputProps {
  value: string | null
  maxScore: string
  onChange: (value: string) => void
  readOnly?: boolean
  label: string
  className?: string
}

export interface ScoreBadgeProps {
  score: string | null
  maxScore: string
  className?: string
}

export interface CreateEvaluationFormProps {
  onConfirm: (month: number, year: number) => void
  onCancel: () => void
}

export interface EvaluationModalsProps {
  showEvaluationDetail: boolean
  setShowEvaluationDetail: (show: boolean) => void
  selectedEvaluation: string | null
  showCreateEvaluationModal: boolean
  setShowCreateEvaluationModal: (show: boolean) => void
  currentUser: any
  onConfirmCreateEvaluation: (month: number, year: number) => void
}