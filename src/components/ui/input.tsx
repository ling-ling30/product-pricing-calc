import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixNode?: React.ReactNode;
  suffixNode?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefixNode, suffixNode, ...props }, ref) => {
    if (prefixNode || suffixNode) {
      return (
        <div className="relative flex items-center w-full">
          {prefixNode && (
            <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground text-sm font-medium">
              {prefixNode}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1.5 text-sm",
              "transition-colors duration-160 ease-[cubic-bezier(0.23,1,0.32,1)]",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              prefixNode && "pl-8",
              suffixNode && "pr-8",
              className
            )}
            {...props}
          />
          {suffixNode && (
            <div className="absolute right-3 flex items-center pointer-events-none text-muted-foreground text-sm font-medium">
              {suffixNode}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1.5 text-sm",
          "transition-colors duration-160 ease-[cubic-bezier(0.23,1,0.32,1)]",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
