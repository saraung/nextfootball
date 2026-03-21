import { cn } from "@/lib/utils/helpers";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("fc-page-wrap", className)}>{children}</div>
  );
}
