"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { LoadingContextType } from '@/types/loading';

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  // Reset loading state on route change
  useEffect(() => {
    hideLoading();
  }, [pathname, searchParams]);

  // Handle click events on links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const linkElement = target.closest('a');
      
      if (linkElement?.href) {
        try {
          const url = new URL(linkElement.href);
          const currentUrl = new URL(window.location.href);
          
          // Don't show loading if clicking the current page
          if (url.pathname === currentUrl.pathname && 
              url.search === currentUrl.search && 
              !linkElement.href.startsWith('#')) {
            e.preventDefault(); // Prevent unnecessary navigation
            return;
          }
          
          // Only show loading for internal links that are not anchors
          if (url.origin === currentUrl.origin && !linkElement.href.startsWith('#')) {
            showLoading();
          }
        } catch (error) {
          // Invalid URL, do nothing
          console.error('Invalid URL:', error);
        }
      }
    };

    const handleBeforeUnload = () => {
      showLoading();
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]); // Add pathname as dependency to access current path

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
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
        </div>
      </div>
    </div>
  );
} 