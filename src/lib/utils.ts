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
