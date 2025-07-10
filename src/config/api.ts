export const API_URL = 'http://localhost:90/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/login`,
    LOGOUT: `${API_URL}/logout`,
    REFRESH_TOKEN: `${API_URL}/refresh-token`,
    DEPARTMENT: `${API_URL}/departments`,
    DEPARTMENT_SUMMARY: `${API_URL}/departments/summary`,
    DEPARTMENT_CREATE: `${API_URL}/departments/`,
    DEPARTMENT_LIST_SELECT: `${API_URL}/departments/select`
  },
  USER: {
    USER_INFO: `${API_URL}/user/info`,
    PROFILE: `${API_URL}/user/profile`,
    UPDATE_PROFILE: `${API_URL}/user/profile`,
  },
  EMPLOYEES: {
    LIST: `${API_URL}/employees`,
    SUMMARY: `${API_URL}/employees/summary`,
    CREATE: `${API_URL}/employees`,
    UPDATE: (id: number) => `${API_URL}/employees/${id}`,
    DELETE: (id: number) => `${API_URL}/employees/${id}`,
    DETAIL: (id: number) => `${API_URL}/employees/${id}`,
    MANAGER: `${API_URL}/employees/manager`,
    ALL: `${API_URL}/employees/all-employees`,
  },

  ROLES: {
    LIST: `${API_URL}/roles`,
    SUMMARY: `${API_URL}/roles/summary`,
    CREATE: `${API_URL}/roles`,
    UPDATE: (id: number) => `${API_URL}/roles/${id}`,
    DELETE: (id: number) => `${API_URL}/roles/${id}`,
    DETAIL: (id: number) => `${API_URL}/roles/${id}`,
    REORDER: `${API_URL}/roles/reorder`,
    SELECTION: `${API_URL}/roles/selection`,
  },

  PERMISSIONS: {
    LIST: `${API_URL}/permissions`,
    MODULES: `${API_URL}/permissions/permission-modules`,
    SYNC: `${API_URL}/permissions/sync-permission`,
    SYNC_PERMISSION_BY_EMPLOYEE: `${API_URL}/permissions/sync-permission-by-employee`,
  },

  CATEGORIES: {
    LIST: `${API_URL}/categories`,
  },

  TASKS: {
    LIST: `${API_URL}/tasks`,
    CREATE: `${API_URL}/tasks`,
    UPDATE: (id: number) => `${API_URL}/tasks/${id}`,
    DELETE: (id: number) => `${API_URL}/tasks/${id}`,
    DETAIL: (id: number) => `${API_URL}/tasks/${id}`,
    PROGRESS: (id: number) => `${API_URL}/tasks/${id}/progress`,
    DELETE_FILE: (taskId: number, fileId: number) => `${API_URL}/tasks/${taskId}/files/${fileId}`,
  },

  ACTIVITY_LOG: {
    LIST: `${API_URL}/activity-log`,
  },

  EVALUATIONS: {
    LIST: `${API_URL}/evaluations`,
    CREATE: `${API_URL}/evaluations`,
    UPDATE: (id: number) => `${API_URL}/evaluations/${id}`,
    DELETE: (id: number) => `${API_URL}/evaluations/${id}`,
    DETAIL: (id: number) => `${API_URL}/evaluations/${id}`,
  },

  EVALUATION_CRITERIA: {
    LIST: `${API_URL}/evaluation-criteria`,
  },

  // Thêm các nhóm API khác ở đây
} as const;

// Cấu hình mặc định cho axios
export const API_CONFIG = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
  },
} as const; 