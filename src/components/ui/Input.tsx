import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        <input
          type={type}
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm font-sans placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
            error ? "border-destructive focus-visible:ring-destructive" : "border-input"
          } ${className}`}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-destructive font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
