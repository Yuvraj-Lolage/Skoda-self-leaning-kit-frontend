import React from "react";
import { cn } from "./utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
    outline:
      "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes: Record<string, string> = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3",
    lg: "h-10 rounded-md px-6",
    icon: "size-9 rounded-md p-0",
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 ring-ring/50";

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
