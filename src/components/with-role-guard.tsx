"use client";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface WithRoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function WithRoleGuard({ allowedRoles, children }: WithRoleGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !allowedRoles.includes(user.role))) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading || !user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
} 