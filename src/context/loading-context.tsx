"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { LoadingContextType } from "@/types/loading";
import { toast } from "sonner";

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const loadingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const showLoading = () => {
    setIsLoading(true);
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }, 30000);
  };

  const hideLoading = () => {
    setIsLoading(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  // Reset loading state on route change (nếu muốn)
  useEffect(() => {
    hideLoading();
  }, [pathname]);

  // Handle click events on links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const linkElement = target.closest("a");
      if (linkElement?.href) {
        try {
          const url = new URL(linkElement.href);
          const currentUrl = new URL(window.location.href);
          // Don't show loading if clicking the current page
          if (
            url.pathname === currentUrl.pathname &&
            url.search === currentUrl.search &&
            !linkElement.href.startsWith("#")
          ) {
            e.preventDefault(); // Prevent unnecessary navigation
            return;
          }
          // Chỉ show loading cho link nội bộ, không phải anchor
          if (
            url.origin === currentUrl.origin &&
            !linkElement.href.startsWith("#")
          ) {
            showLoading();
          }
        } catch (error) {
          // Invalid URL, do nothing
        }
      }
    };

    const handleBeforeUnload = () => {
      showLoading();
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && <LoadingOverlay />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
      </div>
    </div>
  );
}
