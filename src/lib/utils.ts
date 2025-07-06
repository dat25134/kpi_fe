import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"
import { EvaluationTargetType, QualityRating } from "@/types/evaluation";

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

export function getQualityRatingFromGrade(grade: string): QualityRating {
  switch (grade) {
    case "A":
      return QualityRating.EXCELLENT
    case "B":
      return QualityRating.GOOD
    case "C":
      return QualityRating.ACHIEVED
    case "D":
      return QualityRating.NOT_ACHIEVED
    default:
      return QualityRating.ACHIEVED
  }
}

export function getTargetTypeFromRole(role: string): EvaluationTargetType {
  switch (role) {
    case "nhanvien":
      return EvaluationTargetType.EMPLOYEE
    case "chuyenvien":
      return EvaluationTargetType.STAFF
    case "phophong":
      return EvaluationTargetType.DEPARTMENT_DEPUTY
    case "truongphong":
      return EvaluationTargetType.DEPARTMENT_HEAD
    default:
      return EvaluationTargetType.STAFF
  }
}

export function getRoleLabel(role: string) {
  switch (role) {
    case "nhanvien":
      return "Nhân viên"
    case "chuyenvien":
      return "Chuyên viên"
    case "phophong":
      return "Phó phòng"
    case "truongphong":
      return "Trưởng phòng"
    case "chutich":
      return "Chủ tịch"
    case "phochutich":
      return "Phó chủ tịch"
    default:
      return "Không xác định"
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
