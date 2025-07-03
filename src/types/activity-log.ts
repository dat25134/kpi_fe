export interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  subject_id: number;
  causer_type: string | null;
  causer_id: number | null;
  properties: {
    attributes: any;
  };
  created_at: string;
  updated_at: string;
}

export interface ActivityLogPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  create_count: number;
  update_count: number;
  delete_count: number;
}

export interface ActivityLogResponse {
  logs: ActivityLog[];
  pagination: ActivityLogPagination;
}

export interface ActivityLogFilters {
  search?: string;
  subject_type?: string;
  description?: string;
  log_name?: string;
  causer_id?: string;
  date_from?: string;
  date_to?: string;
  event?: string;
  page?: number;
  per_page?: number;
} 

export interface ApiResponse {
  success: boolean
  message: string
  data: {
    logs: ActivityLog[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
    }
  }
}

export interface Filters {
  search: string
  subject_type: string
  description: string
  log_name: string
  causer_id: string
  date_from: Date | undefined
  date_to: Date | undefined
  event: string
}

export interface ActivityLogTableProps {
  logs: ActivityLog[];
  loading: boolean;
  getActionIcon: (description: string) => React.ReactNode;
  getActionColor: (description: string) => string;
  getActionText: (description: string) => string;
  getModelName: (subjectType: string) => string;
  getLogContent: (log: ActivityLog) => string;
  getUserName: (userId: number | null) => string;
  formatDate: (dateString: string) => string;
  pagination: ActivityLogPagination;
} 