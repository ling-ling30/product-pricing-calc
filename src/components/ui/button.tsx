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
          // Base & Emil Kowalski press feedback
          "inline-flex items-center justify-center font-medium select-none cursor-pointer rounded-lg",
          "transition-all duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
          
          // Variants
          variant === "primary" &&
            "bg-primary text-primary-foreground shadow-sm hover:brightness-110",
          variant === "secondary" &&
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === "outline" &&
            "border border-border bg-background hover:bg-muted text-foreground",
          variant === "ghost" &&
            "hover:bg-muted text-foreground",
          variant === "destructive" &&
            "bg-destructive text-destructive-foreground hover:brightness-110",

          // Sizes
          size === "sm" && "h-8 px-3 text-xs gap-1.5",
          size === "md" && "h-10 px-4 text-sm gap-2",
          size === "lg" && "h-12 px-6 text-base gap-2.5",
          size === "icon" && "h-9 w-9 p-0 text-sm",

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
