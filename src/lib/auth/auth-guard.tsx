"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { ROUTES } from "@/config/routes";

interface AuthGuardProps {
  children: React.ReactNode;
  requireSuperuser?: boolean;
}

export default function AuthGuard({ children, requireSuperuser = false }: AuthGuardProps) {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (requireSuperuser && !user.is_superuser) {
      router.replace(ROUTES.HOME);
    }
  }, [user, isInitialized, requireSuperuser, router]);

  if (!isInitialized) {
    return (
      <div className="fc-page-wrap flex items-center justify-center py-32">
        <div className="fc-spinner" />
      </div>
    );
  }

  if (!user) return null;
  if (requireSuperuser && !user.is_superuser) return null;

  return <>{children}</>;
}
