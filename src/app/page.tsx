"use client";

import { Suspense } from "react";
import { useLoading, LoadingProvider } from '@/context/loading-context';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { initializeLoading } from '@/services/apiClient';

export default function HomeWrapper() {
  return (
    <Suspense fallback={null}>
      <LoadingProvider>
        <Home />
      </LoadingProvider>
    </Suspense>
  );
}

function Home() {
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    initializeLoading(showLoading, hideLoading);
    router.replace("/login");
  }, [showLoading, hideLoading, router]);

  return null;
}
