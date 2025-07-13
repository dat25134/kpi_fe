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
  roleName: string
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
  department: string
}

// New interfaces for component refactoring
export interface EvaluationHeaderInfoProps {
  data : EvaluationDetail
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

// =============================
// API: GET /api/evaluation-criteria?role_id=3
// =============================

export interface EvaluationCriteriaItem {
  id: number;
  name: string;
  description: string | null;
  max_score: string;
  weight: string;
  order: number;
  is_active: boolean;
}

export interface EvaluationCriteriaCategory {
  id: number;
  name: string;
  description: string | null;
  role_id: string;
  role_name: string;
  evaluation_criteria: EvaluationCriteriaItem[];
}

export interface EvaluationCriteriaCategoryResponse {
  data: EvaluationCriteriaCategory[];
}

export interface CategoryCriteriaFilter {
  role_id?: string;
  search?: string;
}

export interface CategoryCriteriaResponse {
  data: EvaluationCriteriaCategory[];
}

export interface CreateCriteriaPayload {
  role_id: number;
  category_criteria_id: number;
  name: string;
  description: string;
  max_score: number;
  is_active: boolean;
}

// Interface cho API Save Evaluation
export interface SaveEvaluationRequest {
  status: 'draft' | 'submitted' | 'level1_approved' | 'level2_approved' | 'completed';
  evaluation_details?: Array<{
    criteria_id: number;
    self_score?: number;
    self_comment?: string;
    level1_score?: number;
    level1_comment?: string;
    level2_score?: number;
    level2_comment?: string;
  }>;
  work_descriptions?: Array<{
    id: number;
    result_level?: number;
    quality_weight?: number;
  }>;
}

export interface SaveEvaluationResponse {
  message: string;
  data: EvaluationDetail;
}

// Interface cho validation errors
export interface SaveEvaluationError {
  message: string;
  errors?: Record<string, string[]>;
}

// New interfaces for refactoring
export interface EvaluationFilterState {
  filterNameInput: string;
  filterStatusInput: string;
  filterRatingInput: string;
  filterPeriodInput: Date | null;
  filterName: string;
  filterStatus: string;
  filterRating: string;
  filterPeriod: string;
}

export interface EvaluationFilterBarProps {
  filterNameInput: string;
  setFilterNameInput: (value: string) => void;
  filterStatusInput: string;
  setFilterStatusInput: (value: string) => void;
  filterRatingInput: string;
  setFilterRatingInput: (value: string) => void;
  filterPeriodInput: Date | null;
  setFilterPeriodInput: (value: Date | null) => void;
  onApply: () => void;
  onClear: () => void;
}

export interface EvaluationTableProps {
  evaluations: Evaluation[];
  loading: boolean;
  error: string | null;
  onView: (id: string) => void;
  onDelete: (id: number) => void;
}

export interface QualityRatingBadgeProps {
  rating: string;
  showLabel?: boolean;
  showShortLabel?: boolean;
}

export interface EvaluationFormState {
  activeTab: string;
  currentPage: number;
  selectedEvaluation: string | null;
  showEvaluationDetail: boolean;
  showCreateEvaluationModal: boolean;
}

export interface EvaluationFormHandlers {
  handleViewEvaluation: (evaluationId: string) => void;
  handleCreateEvaluation: () => void;
  handleConfirmCreateEvaluation: (month: number, year: number) => Promise<void>;
  handleDeleteEvaluation: (evaluationId: number) => Promise<void>;
  handleApplyFilter: () => void;
  handleClearFilter: () => void;
  handleRefresh: () => Promise<void>;
  handlePageChange: (page: number) => void;
}

export interface CriteriaManagementState {
  roleId: string;
  searchInput: string;
  search: string;
  showAddCategory: boolean;
  editCategory: { id: number; name: string } | null;
  showDeleteModal: boolean;
  deleteCategory: { id: number; name: string } | null;
  showCreateCriteria: { categoryId: number } | null;
  categoryList: EvaluationCriteriaCategory[];
  isLoading: boolean;
  isError: boolean;
  editCriteria: any | null;
  deleteCriteria: any | null;
  showDeleteCriteriaModal: boolean;
}

export interface CriteriaManagementHandlers {
  handleSearch: () => void;
  handleRoleChange: (value: string) => void;
  handleDeleteClick: (cat: { id: number; name: string }) => void;
  fetchCategoryList: () => Promise<void>;
}

export interface EvaluationDetailModalState {
  activeTab: string;
  details: EvaluationCriteriaDetail[];
  saving: boolean;
}

export interface EvaluationDetailModalHandlers {
  handleScoreChange: (id: number, field: string, value: string) => void;
  handleCommentChange: (id: number, field: string, value: string) => void;
  handleSaveDraft: () => Promise<void>;
  handleSubmit: () => Promise<void>;
  handleLevel1Approve: () => Promise<void>;
  handleLevel2Approve: () => Promise<void>;
  handleComplete: () => Promise<void>;
  getActionButtons: () => React.ReactNode[];
}

export interface WorkItemFormState {
  item: Partial<WorkDescriptionItem>;
  isEditing: boolean;
}

export interface WorkItemFormHandlers {
  onSave: (item: WorkDescriptionItem) => void;
  onCancel: () => void;
  onFieldChange: (field: keyof WorkDescriptionItem, value: any) => void;
}

export interface EvaluationCriteriaListProps {
  details: EvaluationCriteriaDetail[];
  onScoreChange: (id: number, field: string, value: string) => void;
  onCommentChange: (id: number, field: string, value: string) => void;
  isReadOnly?: boolean;
}

export interface EvaluationCriteriaItemProps {
  item: EvaluationCriteriaDetail;
  isReadOnly?: boolean;
  onScoreChange: (id: number, field: string, value: string) => void;
  onCommentChange: (id: number, field: string, value: string) => void;
}

export interface EvaluationCriteriaCategoryProps {
  category: string;
  criteria: EvaluationCriteriaDetail[];
  isReadOnly?: boolean;
  onScoreChange: (id: number, field: string, value: string) => void;
  onCommentChange: (id: number, field: string, value: string) => void;
}

export interface EvaluationModalProps {
  showEvaluationDetail: boolean;
  setShowEvaluationDetail: (show: boolean) => void;
  selectedEvaluation: string | null;
  showCreateEvaluationModal: boolean;
  setShowCreateEvaluationModal: (show: boolean) => void;
  currentUser: any;
  onConfirmCreateEvaluation: (month: number, year: number) => void;
}

export interface CreateEvaluationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (month: number, year: number) => void;
}

export interface EvaluationTabConfig {
  value: string;
  label: string;
}

export interface EvaluationTabProps {
  tab: EvaluationTabConfig;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export interface EvaluationStats {
  totalCriteria: number;
  totalMaxScore: number;
}

export interface EvaluationCriteriaItemDisplayProps {
  criteria: EvaluationCriteriaItem;
  categoryId: number;
  roleId: string;
  onEdit: (criteria: any) => void;
  onDelete: (criteria: any) => void;
}

export interface EvaluationCriteriaCategoryDisplayProps {
  category: EvaluationCriteriaCategory;
  onEditCategory: (category: { id: number; name: string }) => void;
  onDeleteCategory: (category: { id: number; name: string }) => void;
  onCreateCriteria: (categoryId: number) => void;
  onEditCriteria: (criteria: any) => void;
  onDeleteCriteria: (criteria: any) => void;
}
