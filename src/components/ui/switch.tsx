import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  title?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  className,
  id,
  title,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      title={title}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent",
        "transition-colors duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "bg-primary border-primary"
          : "bg-stone-200 dark:bg-stone-700 border-stone-300 dark:border-stone-600",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)]",
          checked ? "translate-x-4.5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
