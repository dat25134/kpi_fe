export type DepartmentFilters = {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  };
  
  export type DepartmentListResponse = {
    data: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };