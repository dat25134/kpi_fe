"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      expand={false}
      closeButton
      duration={3000}
      style={{
        "--normal-bg": "white",
        "--normal-border": "#E5E7EB",
        "--normal-text": "black",
        "--success-bg": "#F0FDF4",
        "--success-border": "#BBF7D0",
        "--success-text": "#166534",
        "--error-bg": "#FEF2F2",
        "--error-border": "#FECACA",
        "--error-text": "#991B1B",
        "--warning-bg": "#FFFBEB",
        "--warning-border": "#FEF3C7",
        "--warning-text": "#92400E",
        "--info-bg": "#EFF6FF",
        "--info-border": "#BFDBFE",
        "--info-text": "#1E40AF",
      } as any}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-[--normal-bg] group-[.toaster]:text-[--normal-text] group-[.toaster]:border-[--normal-border] group-[.toaster]:shadow-lg rounded-lg border p-4 text-sm",
          success: "group-[.toaster]:bg-[--success-bg] group-[.toaster]:text-[--success-text] group-[.toaster]:border-[--success-border]",
          error: "group-[.toaster]:bg-[--error-bg] group-[.toaster]:text-[--error-text] group-[.toaster]:border-[--error-border]",
          warning: "group-[.toaster]:bg-[--warning-bg] group-[.toaster]:text-[--warning-text] group-[.toaster]:border-[--warning-border]",
          info: "group-[.toaster]:bg-[--info-bg] group-[.toaster]:text-[--info-text] group-[.toaster]:border-[--info-border]",
        },
      }}
    />
  )
}