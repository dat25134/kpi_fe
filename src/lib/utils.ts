import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { POSITIONS } from "@/constants/options"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPositionValue(key: string) {
  const position = POSITIONS.find((p) => p.key === key)
  return position ? position.value : key
}

export function getPositionVariant(key: string) {
  const position = POSITIONS.find((p) => p.key === key)
  return position ? position.variant : "default"
}

export function getPositionColor(key: string) {
  const position = POSITIONS.find((p) => p.key === key)
  return position ? position.className : "bg-gray-100 text-gray-800 hover:bg-gray-100"
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
