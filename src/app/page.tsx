import { redirect } from "next/navigation"
import { useEffect } from 'react';
import { useLoading } from '@/context/loading-context';
import { initializeLoading } from '@/services/api';

export default function Home() {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    initializeLoading(showLoading, hideLoading);
  }, [showLoading, hideLoading]);

  redirect("/login")
}
