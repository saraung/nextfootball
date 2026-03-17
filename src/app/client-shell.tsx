"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useAuthInit } from "@/hooks/useAuth";
import { useUIStore } from "@/store/ui-store";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const isInitialized = useAuthInit();
  const theme = useUIStore((s) => s.theme);
  const [mounted, setMounted] = useState(false);

  // Apply theme on mount and prevent hydration mismatch
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setMounted(true);
  }, [theme]);

  // Prevent flash of unstyled content during hydration
  if (!mounted) {
    return (
      <div className="fc-shell flex flex-col" style={{ visibility: "hidden" }}>
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="fc-shell flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
