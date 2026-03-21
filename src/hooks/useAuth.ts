"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store";

/**
 * Call once in the root layout to hydrate auth state from stored token.
 */
export function useAuthInit() {
  const initialize = useAuthStore((s) => s.initialize);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  return isInitialized;
}
