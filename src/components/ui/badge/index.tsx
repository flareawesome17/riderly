import React from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: React.ReactNode;
  color?: "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = "info",
  size = "md",
  className,
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full";

  const colors = {
    success: "bg-success-500/10 text-success-500",
    warning: "bg-warning-500/10 text-warning-500",
    error: "bg-error-500/10 text-error-500",
    info: "bg-info-500/10 text-info-500",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={twMerge(
        baseStyles,
        colors[color],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}; 