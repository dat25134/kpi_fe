export function handleApiError(error: any) {
  if (error.response) {
    return {
      message: error.response.data?.message || "Server error",
      code: error.response.status,
      data: error.response.data,
    };
  }
  return {
    message: error.message || "Unknown error",
    code: 0,
    data: null,
  };
}

// Hàm dùng chung để lấy message phù hợp từ error object
export function getErrorMessage(error: any, fallbackMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.") {
  // Nếu là axios error có response
  if (error?.response) {
    const status = error.response.status
    const data = error.response.data
    // Nếu là lỗi validate 422, luôn trả về message mặc định
    if (status === 422) return fallbackMessage

    // Xử lý theo status code nếu muốn custom
    if (status === 401) return "Bạn không có quyền thực hiện thao tác này."
    if (status === 404) return "Không tìm thấy dữ liệu."
    if (status === 500) return "Lỗi máy chủ. Vui lòng thử lại sau."
    if (status === 403) return "Bạn không có quyền thực hiện thao tác này."

    // Ưu tiên lấy message từ response
    if (data?.message) return data.message
    
    return fallbackMessage
  }
  // Nếu là object trả về từ handleApiError
  if (error?.message) return error.message
  // Nếu là string
  if (typeof error === "string") return error
  // Nếu là Error instance
  if (error instanceof Error) return error.message
  return fallbackMessage
}

// Hàm lấy errors validate dạng object cho form
export function getValidationErrors(error: any): Record<string, string[]> | null {
  if (error?.response && error.response.status === 422 && error.response.data?.errors) {
    return error.response.data.errors
  }
  if (error?.errors) return error.errors
  return null
} 