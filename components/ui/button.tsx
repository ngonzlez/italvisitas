"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   "bg-[var(--brand-700)] text-white hover:bg-[var(--brand-800)] shadow-[var(--shadow-sm)]",
  secondary: "bg-[var(--ink-white)] border border-[var(--ink-200)] text-[var(--ink-800)] hover:bg-[var(--ink-50)] hover:border-[var(--ink-300)]",
  ghost:     "text-[var(--ink-600)] hover:bg-[var(--ink-100)] hover:text-[var(--ink-900)]",
  danger:    "bg-[var(--danger-600)] text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-2 text-xs font-semibold rounded-[var(--r-sm)]",
  md: "px-4 py-2.5 text-sm font-semibold rounded-[var(--r-md)]",
  lg: "px-5 py-3 text-base font-semibold rounded-[var(--r-md)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-[inherit] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
