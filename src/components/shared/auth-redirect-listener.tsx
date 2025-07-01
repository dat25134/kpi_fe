"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirectListener() {
  const router = useRouter();
  useEffect(() => {
    const handler = () => {
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    };
    window.addEventListener("auth-expired", handler);
    return () => window.removeEventListener("auth-expired", handler);
  }, [router]);
  return null;
} 