import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
  
  const variantClasses = {
    default: "border-transparent bg-slate-800 text-white hover:bg-slate-700",
    secondary: "border-transparent bg-slate-200 text-slate-800 hover:bg-slate-300",
    destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
    outline: "border-slate-600 text-slate-300 hover:bg-slate-800",
  }
  
  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)} 
      {...props} 
    />
  )
}

export { Badge }
