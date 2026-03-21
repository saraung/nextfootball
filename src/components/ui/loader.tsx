"use client";

import { cn } from "@/lib/utils/helpers";

interface LoaderProps {
  fullPage?: boolean;
  className?: string;
}

export default function Loader({ fullPage = false, className }: LoaderProps) {
  const spinner = <div className={cn("fc-spinner", className)} />;

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">{spinner}</div>
  );
}
