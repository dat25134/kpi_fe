export const POSITIONS = [
  { key: "director", value: "Trưởng phòng", variant: "default", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  { key: "manager", value: "Phó phòng", variant: "secondary", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  { key: "specialist", value: "Chuyên viên", variant: "outline", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  { key: "employee", value: "Nhân viên", variant: "outline", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
] as const;

export const GENDERS = [
  { key: "male", value: "Nam" },
  { key: "female", value: "Nữ" },
  { key: "other", value: "Khác" },
] as const;

export const EMPLOYEE_STATUSES = [
  { key: "active", value: "Đang làm việc" },
  { key: "inactive", value: "Tạm nghỉ" },
] as const; 