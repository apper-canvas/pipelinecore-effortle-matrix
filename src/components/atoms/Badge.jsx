import React from "react"
import { cn } from "@/utils/cn"

const Badge = React.forwardRef(({ className, variant = "default", size = "md", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors duration-200"
  
  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    primary: "bg-primary-100 text-primary-800 border border-primary-200",
    success: "bg-success-100 text-success-800 border border-success-200",
    warning: "bg-warning-100 text-warning-800 border border-warning-200",
    error: "bg-error-100 text-error-800 border border-error-200",
    lead: "bg-blue-100 text-blue-800 border border-blue-200",
    qualified: "bg-purple-100 text-purple-800 border border-purple-200",
    proposal: "bg-orange-100 text-orange-800 border border-orange-200",
    negotiation: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    "closed-won": "bg-success-100 text-success-800 border border-success-200",
    "closed-lost": "bg-error-100 text-error-800 border border-error-200"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2"
  }
  
  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge