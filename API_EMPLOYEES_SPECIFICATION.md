# API Specification cho Employees

## 1. API Summary Employees

### Endpoint: `GET /api/employees/summary`

**Mục đích:** Lấy thống kê tổng quan về nhân viên để hiển thị trong dashboard.

**Response Format:**
```json
{
  "success": true,
  "message": "Lấy thống kê nhân viên thành công",
  "data": {
    "totalEmployees": 150,
    "activeEmployees": 142,
    "inactiveEmployees": 8,
    "averageSalary": 18500000,
    "departmentStats": [
      {
        "departmentId": 1,
        "departmentName": "Phòng Quản trị nền tảng số và VTTT",
        "departmentCode": "QTNT",
        "employeeCount": 45
      },
      {
        "departmentId": 2,
        "departmentName": "Phòng Tài chính - Kế toán",
        "departmentCode": "TCKT",
        "employeeCount": 32
      },
      {
        "departmentId": 3,
        "departmentName": "Phòng Nhân sự",
        "departmentCode": "NS",
        "employeeCount": 28
      }
    ],
    "positionStats": [
      {
        "position": "Trưởng phòng",
        "count": 15
      },
      {
        "position": "Phó phòng",
        "count": 25
      },
      {
        "position": "Chuyên viên",
        "count": 85
      },
      {
        "position": "Nhân viên",
        "count": 25
      }
    ]
  }
}
```

**Mô tả các trường:**
- `totalEmployees`: Tổng số nhân viên
- `activeEmployees`: Số nhân viên đang làm việc (status = 'active')
- `inactiveEmployees`: Số nhân viên tạm nghỉ (status = 'inactive')
- `averageSalary`: Lương trung bình (VNĐ/tháng)
- `departmentStats`: Thống kê theo phòng ban
- `positionStats`: Thống kê theo chức vụ

---

## 2. API List Employees

### Endpoint: `GET /api/employees`

**Mục đích:** Lấy danh sách nhân viên với phân trang và lọc.

**Query Parameters:**
- `search` (optional): Tìm kiếm theo tên, email, số điện thoại
- `department_id` (optional): Lọc theo phòng ban
- `position` (optional): Lọc theo chức vụ
- `status` (optional): Lọc theo trạng thái ('active' | 'inactive')
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số item trên mỗi trang (default: 10)

**Ví dụ Request:**
```
GET /api/employees?search=vinh&department_id=1&position=Trưởng phòng&status=active&page=1&limit=10
```

**Response Format:**
```json
{
  "success": true,
  "message": "Lấy danh sách nhân viên thành công",
  "data": {
    "employees": [
      {
        "id": 1,
        "name": "Phạm Ngọc Vinh",
        "avatar": "PNV",
        "email": "pham.ngoc.vinh@company.com",
        "phone": "+84 123 456 789",
        "position": "Trưởng phòng",
        "department": {
          "id": 1,
          "name": "Phòng Quản trị nền tảng số và VTTT",
          "code": "QTNT"
        },
        "status": "active",
        "joinDate": "15/01/2020",
        "salary": 25000000,
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "birthDate": "15/05/1985",
        "gender": "Nam",
        "education": "Thạc sĩ Công nghệ thông tin",
        "experience": "8 năm",
        "skills": ["JavaScript", "React", "Node.js", "Python", "SQL"],
        "projects": [
          {
            "name": "Hệ thống KPI",
            "role": "Project Manager",
            "status": "Đang thực hiện"
          },
          {
            "name": "Ứng dụng Tây Ninh Smart",
            "role": "Tech Lead",
            "status": "Hoàn thành"
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 15,
      "totalItems": 150,
      "itemsPerPage": 10
    }
  }
}
```

**Mô tả các trường Employee:**
- `id`: ID duy nhất của nhân viên
- `name`: Họ tên nhân viên
- `avatar`: Chữ cái đầu của tên (để tạo avatar)
- `email`: Email công ty
- `phone`: Số điện thoại
- `position`: Chức vụ
- `department`: Thông tin phòng ban
- `status`: Trạng thái ('active' | 'inactive')
- `joinDate`: Ngày vào làm (format: DD/MM/YYYY)
- `salary`: Lương (VNĐ/tháng)
- `address`: Địa chỉ
- `birthDate`: Ngày sinh (format: DD/MM/YYYY)
- `gender`: Giới tính ('Nam' | 'Nữ')
- `education`: Trình độ học vấn
- `experience`: Kinh nghiệm làm việc
- `skills`: Danh sách kỹ năng
- `projects`: Danh sách dự án đã tham gia

---

## 3. API Create Employee

### Endpoint: `POST /api/employees`

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyen.van.a@company.com",
  "phone": "+84 987 654 321",
  "position": "Chuyên viên",
  "departmentId": 1,
  "salary": 18000000,
  "address": "456 Đường DEF, Quận 3, TP.HCM",
  "birthDate": "20/08/1992",
  "gender": "Nam",
  "education": "Cử nhân Công nghệ thông tin",
  "experience": "4 năm",
  "skills": ["Vue.js", "Laravel", "MySQL"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo nhân viên thành công",
  "data": {
    // Employee object với id và joinDate được tạo tự động
  }
}
```

---

## 4. API Update Employee

### Endpoint: `PUT /api/employees/{id}`

**Request Body:** Tương tự Create nhưng có thể update từng phần

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật nhân viên thành công",
  "data": {
    // Employee object đã được cập nhật
  }
}
```

---

## 5. API Delete Employee

### Endpoint: `DELETE /api/employees/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Xóa nhân viên thành công"
}
```

---

## 6. API Get Employee Detail

### Endpoint: `GET /api/employees/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Lấy thông tin nhân viên thành công",
  "data": {
    // Employee object đầy đủ
  }
}
```

---

## Lưu ý quan trọng:

1. **Authentication:** Tất cả API đều yêu cầu Bearer token trong header Authorization
2. **Error Handling:** Trả về error với format:
   ```json
   {
     "success": false,
     "message": "Mô tả lỗi",
     "errors": {
       "field": ["Lỗi cụ thể"]
     }
   }
   ```
3. **Validation:** Backend cần validate:
   - Email phải unique
   - Phone phải unique
   - Các trường bắt buộc không được null/empty
   - Format ngày tháng đúng chuẩn
4. **Pagination:** Sử dụng offset-based pagination với page và limit
5. **Search:** Tìm kiếm không phân biệt hoa thường, tìm trong name, email, phone
6. **Filtering:** Có thể kết hợp nhiều filter cùng lúc 