import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-600)]">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full px-3.5 py-2.5 text-sm rounded-[var(--r-md)] border border-[var(--ink-200)] bg-[var(--ink-white)] text-[var(--ink-900)] placeholder:text-[var(--ink-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition",
          error && "border-[var(--danger-600)] focus:ring-[var(--danger-600)]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--danger-600)]">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-600)]">{label}</label>}
      <textarea
        ref={ref}
        rows={3}
        className={cn(
          "w-full px-3.5 py-2.5 text-sm rounded-[var(--r-md)] border border-[var(--ink-200)] bg-[var(--ink-white)] text-[var(--ink-900)] placeholder:text-[var(--ink-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition resize-none",
          error && "border-[var(--danger-600)] focus:ring-[var(--danger-600)]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--danger-600)]">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";
