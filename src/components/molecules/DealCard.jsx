import React from "react"
import { cn } from "@/utils/cn"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const DealCard = ({ 
  deal, 
  onEdit, 
  onDelete,
  onStageChange,
  className 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStageVariant = (stage) => {
    switch (stage.toLowerCase()) {
      case "lead": return "lead"
      case "qualified": return "qualified"
      case "proposal": return "proposal"
      case "negotiation": return "negotiation"
      case "closed won": return "closed-won"
      case "closed lost": return "closed-lost"
      default: return "default"
    }
  }

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return "text-success-600"
    if (probability >= 50) return "text-warning-600"
    return "text-error-600"
  }

  return (
    <div className={cn(
      "bg-white rounded-xl p-4 shadow-soft hover:shadow-premium transition-all duration-300 border border-slate-200/50 group cursor-move",
      className
    )}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate mb-1">{deal.title}</h3>
            <p className="text-sm text-slate-600 truncate">{deal.company}</p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button variant="ghost" size="sm" onClick={() => onEdit(deal)}>
              <ApperIcon name="Edit" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(deal.Id)}>
              <ApperIcon name="Trash2" className="h-4 w-4 text-error-500" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Badge variant={getStageVariant(deal.stage)} size="sm">
            {deal.stage}
          </Badge>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(deal.value)}
            </span>
            <span className={cn("text-sm font-medium", getProbabilityColor(deal.probability))}>
              {deal.probability}%
            </span>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" className="h-3 w-3" />
              <span>Close: {format(new Date(deal.expectedCloseDate), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" className="h-3 w-3" />
              <span>Updated: {format(new Date(deal.lastUpdated), "MMM dd")}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <select 
            value={deal.stage}
            onChange={(e) => onStageChange(deal.Id, e.target.value)}
            className="w-full text-xs border-0 bg-transparent text-slate-600 focus:outline-none focus:ring-0 cursor-pointer"
          >
            <option value="Lead">Lead</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default DealCard