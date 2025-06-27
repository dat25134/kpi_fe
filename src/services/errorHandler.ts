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