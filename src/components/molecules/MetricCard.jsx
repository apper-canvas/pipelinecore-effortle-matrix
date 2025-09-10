import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = "up",
  className 
}) => {
  const trendColor = trend === "up" ? "text-success-600" : trend === "down" ? "text-error-600" : "text-slate-500"
  const trendIcon = trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"

  return (
    <div className={cn(
      "bg-white rounded-xl p-6 shadow-soft hover:shadow-premium transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/50",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold gradient-text mb-2">{value}</p>
          {change && (
            <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
              <ApperIcon name={trendIcon} className="h-4 w-4" />
              <span>{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-3 rounded-xl">
            <ApperIcon name={icon} className="h-6 w-6 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricCard