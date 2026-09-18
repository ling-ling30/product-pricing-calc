import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Apple HIG base & immediate pointer-down feedback
          "inline-flex items-center justify-center font-medium select-none cursor-pointer rounded-xl",
          "transition-all duration-120 ease-out active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100",
          
          // Apple Variants
          variant === "primary" &&
            "bg-primary text-primary-foreground shadow-xs hover:opacity-95 active:opacity-90",
          variant === "secondary" &&
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === "outline" &&
            "border border-border/80 bg-background/90 hover:bg-secondary/60 text-foreground shadow-xs",
          variant === "ghost" &&
            "hover:bg-secondary/60 text-foreground",
          variant === "destructive" &&
            "bg-destructive text-destructive-foreground hover:opacity-95 active:opacity-90 shadow-xs",

          // Sizes
          size === "sm" && "h-8 px-3 text-xs gap-1.5 rounded-lg",
          size === "md" && "h-9.5 px-4 text-sm gap-2",
          size === "lg" && "h-11 px-5 text-base gap-2.5 rounded-2xl",
          size === "icon" && "h-8.5 w-8.5 p-0 text-sm",

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
