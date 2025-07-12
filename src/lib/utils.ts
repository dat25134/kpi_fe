import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatVietnamesePhoneNumber(input: string): string {
  // Xóa ký tự không phải số
  const digits = input.replace(/\D/g, '');
  // Format: 4-3-3 hoặc 3-3-4 tùy đầu số
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return digits.slice(0, 4) + ' ' + digits.slice(4);
  return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 11);
}

export function formatVND(input: string): string {
  // Xóa ký tự không phải số
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';
  // Thêm dấu chấm phân tách hàng nghìn
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join(" ");
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<any, any>;
    return extractTextFromReactNode(element.props.children);
  }
  return "";
}

export function getAvatarFromName(name: string): string {
  const nameParts = name.split(" ")
  return nameParts.length >= 2
    ? nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    : name.substring(0, 2).toUpperCase()
}

export function formatDate(date: string, format: string = "DD/MM/YYYY"): string {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const minute = String(dateObj.getMinutes()).padStart(2, '0');
  return format.replace("DD", day).replace("MM", month).replace("YYYY", year.toString()).replace("HH", hour).replace("mm", minute);
}


// Helper functions
export function getStatusLabel(status: string) {
  switch (status) {
    case "draft":
      return "CHỜ TỰ ĐÁNH GIÁ"
    case "submitted":
      return "CHỜ ĐÁNH GIÁ CẤP 1"
    case "level1_approved":
      return "CHỜ ĐÁNH GIÁ CẤP 2"
    case "level2_approved":
      return "CHỜ PHÊ DUYỆT"
    case "completed":
      return "ĐÃ PHÊ DUYỆT"
    default:
      return "KHÔNG XÁC ĐỊNH"
  }
}

export function getStatusType(status: string) {
  switch (status) {
    case "draft":
      return "waiting"
    case "submitted":
      return "review1"
    case "level1_approved":
      return "review2"
    case "level2_approved":
      return "approved"
    case "completed":
      return "approved"
    default:
      return "unknown"
  }
}

export function getStatusBadgeVariant(statusType: string) {
  switch (statusType) {
    case "waiting":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100"
    case "review1":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    case "review2":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export function getResultLevelName(resultLevel: string) {
  switch (resultLevel) {
    case "1":
      return "Chưa đạt (1 điểm)"
    case "2":
      return "Đạt, còn hạn chế (2 điểm)"
    case "3":
      return "Đạt (3 điểm)"
    case "4":
      return "Đạt vượt mức (4 điểm)"
    default:
      return "Không xác định"
  }
}

// Evaluation utility functions
export function getQualityRating(points: number): string {
  if (points >= 90) return "A"
  if (points >= 70) return "B"
  if (points >= 50) return "C"
  return "D"
}

export function getQualityRatingLabel(rating: string): string {
  switch (rating) {
    case "A":
      return "Hoàn thành xuất sắc nhiệm vụ"
    case "B":
      return "Hoàn thành tốt nhiệm vụ"
    case "C":
      return "Hoàn thành nhiệm vụ"
    case "D":
      return "Không hoàn thành nhiệm vụ"
    default:
      return "Không xác định"
  }
}

export function getQualityRatingBadgeVariant(rating: string): string {
  switch (rating) {
    case "A":
      return "bg-green-100 text-green-800"
    case "B":
      return "bg-blue-100 text-blue-800"
    case "C":
      return "bg-yellow-100 text-yellow-800"
    case "D":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function calculateTotalScore(details: any[]): number {
  return 100;
}

export function calculateKPIScore(workDescriptions: any[]): number {
  if (!workDescriptions || workDescriptions.length === 0) return 0
  const totalScore = workDescriptions.reduce((sum, item) => sum + parseFloat(item?.final_score || "0"), 0)
  const totalWeight = workDescriptions.reduce((sum, item) => sum + parseFloat(item?.task_weight?.toString() || "0"), 0)
  return totalWeight > 0 ? totalScore / totalWeight : 0
}

export function getScoreColor(score: string | null, maxScore: string): string {
  if (!score) return "text-gray-500"
  const percentage = (parseFloat(score) / parseFloat(maxScore)) * 100
  if (percentage >= 90) return "text-green-600"
  if (percentage >= 70) return "text-blue-600"
  if (percentage >= 50) return "text-yellow-600"
  return "text-red-600"
}

export function calculatePoints(resultLevel: number): number {
  switch (resultLevel) {
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
    case 4:
      return 4
    default:
      return 3
  }
}

export function calculateWeightedQualityPoints(points: number, qualityWeight: number): number {
  return (points * qualityWeight) / 5
}

export function calculateFinalPoints(weightedQualityPoints: number, complexityWeight: number): number {
  return weightedQualityPoints * complexityWeight
}

