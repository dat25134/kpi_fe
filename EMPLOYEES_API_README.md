# Hướng dẫn sử dụng API Employees

## Tổng quan

Đã tạo 2 API chính cho màn hình Employees:

1. **API Summary** - Lấy thống kê tổng quan
2. **API List** - Lấy danh sách nhân viên với phân trang và lọc

## Cấu trúc đã tạo

### 1. API Endpoints (`src/config/api.ts`)
```typescript
EMPLOYEES: {
  LIST: `${API_URL}/employees`,
  SUMMARY: `${API_URL}/employees/summary`,
  CREATE: `${API_URL}/employees`,
  UPDATE: (id: number) => `${API_URL}/employees/${id}`,
  DELETE: (id: number) => `${API_URL}/employees/${id}`,
  DETAIL: (id: number) => `${API_URL}/employees/${id}`,
}
```

### 2. Service Layer (`src/services/employee.ts`)
- Định nghĩa types cho Employee, EmployeeSummary, EmployeeListResponse
- Các function API: `fetchEmployeeSummary`, `fetchEmployees`, `createEmployee`, etc.
- Xử lý query parameters cho filtering và pagination

### 3. Custom Hook (`src/hooks/useEmployees.ts`)
- Quản lý state cho employees, summary, loading, pagination
- Các function để thao tác CRUD
- Xử lý filters và pagination
- Error handling với toast notifications

### 4. Component (`src/components/employee-management.tsx`)
- Sử dụng `useEmployees` hook
- Hiển thị summary cards từ API
- Bảng danh sách với phân trang
- Filters với debounce search
- Loading states

## Cách sử dụng

### 1. Trong Component
```typescript
import { useEmployees } from "@/hooks/useEmployees"

export default function MyComponent() {
  const {
    employees,
    summary,
    loading,
    pagination,
    addEmployee,
    applyFilters,
    changePage
  } = useEmployees()

  // Sử dụng các state và functions
}
```

### 2. API Calls
```typescript
import { fetchEmployeeSummary, fetchEmployees } from "@/services/employee"

// Lấy summary
const summary = await fetchEmployeeSummary()

// Lấy danh sách với filters
const response = await fetchEmployees({
  search: "vinh",
  departmentId: 1,
  position: "Trưởng phòng",
  status: "active",
  page: 1,
  limit: 10
})
```

## Format API Response

### Summary API Response
```json
{
  "success": true,
  "message": "Lấy thống kê nhân viên thành công",
  "data": {
    "totalEmployees": 150,
    "activeEmployees": 142,
    "inactiveEmployees": 8,
    "averageSalary": 18500000,
    "departmentStats": [...],
    "positionStats": [...]
  }
}
```

### List API Response
```json
{
  "success": true,
  "message": "Lấy danh sách nhân viên thành công",
  "data": {
    "employees": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 15,
      "totalItems": 150,
      "itemsPerPage": 10
    }
  }
}
```

## Features đã implement

### ✅ Đã hoàn thành
- [x] API endpoints configuration
- [x] Service layer với TypeScript types
- [x] Custom hook với state management
- [x] Component integration
- [x] Loading states
- [x] Error handling với toast
- [x] Pagination
- [x] Search với debounce
- [x] Filters (department, position, status)
- [x] Summary cards từ API
- [x] CRUD operations

### 🔄 Cần backend implement
- [ ] API endpoints theo specification
- [ ] Database schema cho employees
- [ ] Authentication middleware
- [ ] Validation rules
- [ ] Error handling

## Backend Requirements

### Database Schema
```sql
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  position VARCHAR(100) NOT NULL,
  department_id INT NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  join_date DATE NOT NULL,
  salary DECIMAL(12,2) NOT NULL,
  address TEXT,
  birth_date DATE,
  gender ENUM('Nam', 'Nữ'),
  education TEXT,
  experience VARCHAR(100),
  skills JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

### API Implementation Checklist
- [ ] GET /api/employees/summary
- [ ] GET /api/employees (với query parameters)
- [ ] POST /api/employees
- [ ] PUT /api/employees/{id}
- [ ] DELETE /api/employees/{id}
- [ ] GET /api/employees/{id}

## Testing

### Test API endpoints
```bash
# Test summary API
curl -X GET "http://localhost:90/api/employees/summary" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test list API với filters
curl -X GET "http://localhost:90/api/employees?search=vinh&department_id=1&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Frontend
1. Chạy development server: `npm run dev`
2. Truy cập `/employees`
3. Kiểm tra loading states
4. Test filters và pagination
5. Test CRUD operations

## Troubleshooting

### Common Issues
1. **API không response**: Kiểm tra backend server và authentication
2. **Loading không hiển thị**: Kiểm tra LoadingSpinner component
3. **Filters không work**: Kiểm tra query parameters format
4. **Pagination lỗi**: Kiểm tra pagination object structure

### Debug Tips
- Mở DevTools để xem network requests
- Kiểm tra console logs cho errors
- Verify API response format matches TypeScript types
- Test API endpoints với Postman/Insomnia 