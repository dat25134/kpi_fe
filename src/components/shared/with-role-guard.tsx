"use client";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface WithPermissionGuardProps {
  allowedPermissions: string[];
  children: ReactNode;
}

export default function WithPermissionGuard({ allowedPermissions, children }: WithPermissionGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Kiểm tra user có ít nhất 1 quyền trong allowedPermissions
  const hasPermission = user?.permissions?.some((p: string) => allowedPermissions?.includes(p));

  useEffect(() => {
    if (!isLoading && (!user || !hasPermission)) {
      router.replace("/forbidden");
    }
  }, [user, isLoading, allowedPermissions, router, hasPermission]);

  if (isLoading || !user || !hasPermission) return null;

  return <>{children}</>;
} 