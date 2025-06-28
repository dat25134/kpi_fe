"use client";

import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { useLoading } from '@/context/loading-context';
import { initializeLoading } from '@/services/apiClient';

export default function Home() {
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    initializeLoading(showLoading, hideLoading);
    router.replace("/login");
  }, [showLoading, hideLoading, router]);

  return null;
}
