"use client";

import { cn } from "@/lib/utils/helpers";

type Variant = "primary" | "outline" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "fc-btn-primary",
  outline:
    "border border-[var(--card-border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--bg-accent)]",
  danger:
    "bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-500/25",
  ghost: "bg-transparent text-[var(--muted)] hover:bg-[var(--bg-accent)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "fc-btn inline-flex items-center justify-center gap-2",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="fc-spinner fc-spinner--sm" />}
      {children}
    </button>
  );
}
