import React from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "info";
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className = "",
  variant = "info",
  title,
  children,
  ...props
}) => {
  const styles = {
    success: "border-success/20 bg-success/5 text-success",
    error: "border-destructive/20 bg-destructive/5 text-destructive",
    info: "border-primary/20 bg-primary/5 text-primary",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 shrink-0" />,
    info: <Info className="h-4 w-4 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 flex gap-3 text-sm font-sans ${styles[variant]} ${className}`}
      {...props}
    >
      {icons[variant]}
      <div className="flex flex-col gap-1">
        {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
        {children && <div className="text-xs leading-relaxed opacity-90">{children}</div>}
      </div>
    </div>
  );
};
export default Alert;
