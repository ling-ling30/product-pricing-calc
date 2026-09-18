import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "accent" | "success" | "warning";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium select-none transition-colors",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        variant === "outline" && "border border-border text-foreground",
        variant === "accent" && "bg-accent/15 text-accent border border-accent/30",
        variant === "success" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30",
        variant === "warning" && "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30",
        className
      )}
      {...props}
    />
  );
}
