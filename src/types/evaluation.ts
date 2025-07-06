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

// Tiêu chí đánh giá theo quy định mới
export const EVALUATION_CRITERIA: EvaluationCriteria[] = [
  {
    id: "political",
    name: "Chính trị tư tưởng",
    maxPoints: 5,
    description: "Chấp hành chủ trương, đường lối, quy định của Đảng, chính sách, pháp luật của Nhà nước và các nguyên tắc tổ chức, kỷ luật của Đảng"
  },
  {
    id: "ethics",
    name: "Đạo đức, lối sống",
    maxPoints: 5,
    subCriteria: [
      {
        id: "ethics_1",
        name: "Không tham ô, tham nhũng, tiêu cực, lãng phí, quan liêu, cơ hội, vụ lợi, hách dịch, cửa quyền",
        maxPoints: 2
      },
      {
        id: "ethics_2", 
        name: "Có lối sống trung thực, khiêm tốn, chân thành, trong sáng, giản dị",
        maxPoints: 1
      },
      {
        id: "ethics_3",
        name: "Có tinh thần đoàn kết, xây dựng cơ quan, đơn vị trong sạch, vững mạnh",
        maxPoints: 1
      },
      {
        id: "ethics_4",
        name: "Không để người thân, người quen lợi dụng vị trí công tác để trục lợi",
        maxPoints: 1
      }
    ]
  },
  {
    id: "workStyle",
    name: "Tác phong, lề lối làm việc",
    maxPoints: 5,
    subCriteria: [
      {
        id: "workStyle_1",
        name: "Có trách nhiệm với công việc; năng động, sáng tạo, dám nghĩ, dám làm, linh hoạt",
        maxPoints: 2
      },
      {
        id: "workStyle_2",
        name: "Phương pháp làm việc khoa học, dân chủ, đúng nguyên tắc",
        maxPoints: 1
      },
      {
        id: "workStyle_3",
        name: "Có tinh thần trách nhiệm và phối hợp trong thực hiện nhiệm vụ",
        maxPoints: 1
      },
      {
        id: "workStyle_4",
        name: "Có thái độ đúng mực và phong cách ứng xử, lề lối làm việc chuẩn mực",
        maxPoints: 1
      }
    ]
  },
  {
    id: "discipline",
    name: "Ý thức tổ chức kỷ luật",
    maxPoints: 5,
    subCriteria: [
      {
        id: "discipline_1",
        name: "Chấp hành sự phân công của tổ chức",
        maxPoints: 1.5
      },
      {
        id: "discipline_2",
        name: "Thực hiện các quy định, quy chế, nội quy của cơ quan, đơn vị",
        maxPoints: 1.5
      },
      {
        id: "discipline_3",
        name: "Thực hiện việc kê khai và công khai tài sản, thu nhập theo quy định",
        maxPoints: 1
      },
      {
        id: "discipline_4",
        name: "Báo cáo đầy đủ, trung thực, cung cấp thông tin chính xác, khách quan",
        maxPoints: 1
      }
    ]
  },
  {
    id: "digitalTransformation",
    name: "Thực hiện chuyển đổi số và cải cách hành chính",
    maxPoints: 10,
    subCriteria: [
      {
        id: "digitalTransformation_1",
        name: "Sử dụng đầy đủ, đúng quy định các phần mềm, nền tảng số triển khai trong cơ quan",
        maxPoints: 3
      },
      {
        id: "digitalTransformation_2",
        name: "Có sáng kiến, giải pháp mới trong việc thực hiện cải cách hành chính",
        maxPoints: 2
      },
      {
        id: "digitalTransformation_3",
        name: "Tham gia đầy đủ và đạt kết quả tốt các lớp tập huấn được phân công",
        maxPoints: 2
      },
      {
        id: "digitalTransformation_4",
        name: "Không có phản ánh về tinh thần, thái độ phục vụ Nhân dân",
        maxPoints: 3
      }
    ]
  },
  {
    id: "leadership",
    name: "Năng lực lãnh đạo, quản lý",
    maxPoints: 10,
    description: "Áp dụng cho công chức, viên chức giữ chức vụ lãnh đạo, quản lý",
    subCriteria: [
      {
        id: "leadership_1",
        name: "Chủ động nghiên cứu, cập nhật kịp thời các quy định của pháp luật, của ngành",
        maxPoints: 1
      },
      {
        id: "leadership_2",
        name: "Xây dựng kế hoạch công tác của phòng/bộ phận/đơn vị theo lĩnh vực được phân công",
        maxPoints: 1
      },
      {
        id: "leadership_3",
        name: "Tham mưu chỉ đạo, hướng dẫn chuyên môn, nghiệp vụ đối với cơ quan, đơn vị",
        maxPoints: 1
      },
      {
        id: "leadership_4",
        name: "Chủ động tham mưu, đề xuất nhiệm vụ, công việc có liên quan đến lĩnh vực được giao phụ trách",
        maxPoints: 1
      },
      {
        id: "leadership_5",
        name: "Phối hợp với các phòng/bộ phận/đơn vị khác trong cơ quan khi thực hiện nhiệm vụ",
        maxPoints: 1
      },
      {
        id: "leadership_6",
        name: "Lãnh đạo phòng/bộ phận/đơn vị phụ trách làm việc hiệu quả; thực hiện cải cách hành chính",
        maxPoints: 1
      },
      {
        id: "leadership_7",
        name: "Các văn bản do phòng/bộ phận/đơn vị tham mưu phải bảo đảm đúng thể thức, quy trình",
        maxPoints: 1
      },
      {
        id: "leadership_8",
        name: "Có năng lực tập hợp công chức, viên chức trong phòng/bộ phận/đơn vị đoàn kết, thống nhất",
        maxPoints: 1
      }
    ]
  },
  {
    id: "taskPerformance",
    name: "Kết quả thực hiện chức trách, nhiệm vụ được giao",
    maxPoints: 70,
    description: "Điểm chính dựa trên kết quả thực hiện nhiệm vụ"
  }
];

// Loại đối tượng đánh giá
export enum EvaluationTargetType {
  EMPLOYEE = "employee",           // Nhân viên (cán sự, văn thư, kế toán...)
  DEPARTMENT = "department",      // Phòng/bộ phận/đơn vị
  DEPARTMENT_HEAD = "head",       // Trưởng phòng
  DEPARTMENT_DEPUTY = "deputy",   // Phó phòng
  STAFF = "staff"                 // Công chức, viên chức thường
}

// Mức độ hoàn thành
export enum CompletionLevel {
  NOT_ACHIEVED = "not_achieved",           // Chưa đạt (1 điểm)
  ACHIEVED_WITH_LIMITATIONS = "limited",   // Đạt, còn hạn chế (2 điểm)
  ACHIEVED = "achieved",                   // Đạt (3 điểm)
  EXCEEDED = "exceeded"                    // Đạt vượt mức (4 điểm)
}

// Xếp loại chất lượng
export enum QualityRating {
  EXCELLENT = "A",     // Hoàn thành xuất sắc (90+ điểm)
  GOOD = "B",               // Hoàn thành tốt (70-89 điểm)
  ACHIEVED = "C",       // Hoàn thành (50-69 điểm)
  NOT_ACHIEVED = "D" // Không hoàn thành (<50 điểm)
}

// Trọng số phức tạp
export enum ComplexityWeight {
  LEVEL_1 = 1,  // Đơn giản
  LEVEL_2 = 2,  // Trung bình
  LEVEL_3 = 3,  // Phức tạp
  LEVEL_4 = 4   // Rất phức tạp
}

// Trọng số chất lượng
export enum QualityWeight {
  LEVEL_1 = 1,  // Thấp
  LEVEL_2 = 2,  // Trung bình thấp
  LEVEL_3 = 3,  // Trung bình
  LEVEL_4 = 4,  // Trung bình cao
  LEVEL_5 = 5   // Cao
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
  targetType: EvaluationTargetType;
  
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
  qualityRating: QualityRating;
  
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
  qualityLevel: CompletionLevel;
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

// Mapping category names to Vietnamese
export const CATEGORY_LABELS: Record<string, string> = {
  chinh_tri: "Chính trị, tư tưởng",
  dao_duc: "Đạo đức, lối sống", 
  tac_phong: "Tác phong, lề lối làm việc",
  y_thuc: "Ý thức tổ chức kỷ luật",
  chuyen_doi_so: "Chuyển đổi số và cải cách hành chính",
  ket_qua: "Kết quả thực hiện nhiệm vụ"
}