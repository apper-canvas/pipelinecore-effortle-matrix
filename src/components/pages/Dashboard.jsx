import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import MetricCard from "@/components/molecules/MetricCard"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { dealService } from "@/services/api/dealService"
import { contactService } from "@/services/api/contactService"
import { activityService } from "@/services/api/activityService"
import { format } from "date-fns"

const Dashboard = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [dealsData, contactsData, activitiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        activityService.getAll()
      ])
      
      setDeals(dealsData)
      setContacts(contactsData)
      setActivities(activitiesData)
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

const getMetrics = () => {
    const totalDeals = deals.length
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value_c || 0), 0)
    const closedWonDeals = deals.filter(deal => deal.stage_c === "Closed Won")
    const closedWonValue = closedWonDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0)
    const winRate = totalDeals > 0 ? ((closedWonDeals.length / totalDeals) * 100).toFixed(1) : "0"
    return {
      totalValue,
      totalDeals,
      closedWonValue,
      winRate: parseFloat(winRate)
    }
  }

  const getRecentActivities = () => {
return activities
      .sort((a, b) => new Date(b.date_c) - new Date(a.date_c))
      .slice(0, 5)
  }

  const getPipelineDeals = () => {
return deals
      .filter(deal => !["Closed Won", "Closed Lost"].includes(deal.stage_c))
      .sort((a, b) => new Date(b.last_updated_c) - new Date(a.last_updated_c))
      .slice(0, 6)
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "Call": return "Phone"
      case "Email": return "Mail"
      case "Meeting": return "Calendar"
      case "Task": return "CheckSquare"
      case "Note": return "FileText"
      default: return "Activity"
    }
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

  if (loading) return <Loading type="metrics" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const metrics = getMetrics()
  const recentActivities = getRecentActivities()
  const pipelineDeals = getPipelineDeals()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-slate-600 mt-1">Track your sales performance and pipeline health</p>
        </div>
        <div className="text-sm text-slate-500">
          Last updated: {format(new Date(), "MMM dd, yyyy 'at' h:mm a")}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pipeline Value"
          value={formatCurrency(metrics.totalValue)}
          change="+12.5%"
          trend="up"
          icon="DollarSign"
        />
        <MetricCard
          title="Active Deals"
          value={metrics.totalDeals.toString()}
          change="+3"
          trend="up"
          icon="Target"
        />
        <MetricCard
          title="Revenue"
          value={formatCurrency(metrics.closedWonValue)}
          change="+8.2%"
          trend="up"
          icon="TrendingUp"
        />
        <MetricCard
          title="Win Rate"
          value={`${metrics.winRate}%`}
          change={metrics.winRate >= 25 ? "+2.1%" : "-1.3%"}
          trend={metrics.winRate >= 25 ? "up" : "down"}
          icon="Award"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-soft border border-slate-200/50">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Recent Activities</h2>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {recentActivities.length === 0 ? (
                <Empty
                  title="No activities yet"
                  description="Start logging your customer interactions to see them here."
                  icon="Activity"
                />
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                    >
                      <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-2 rounded-lg">
                        <ApperIcon name={getActivityIcon(activity.type)} className="h-4 w-4 text-primary-600" />
                      </div>
<div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">{activity.subject_c}</h4>
                        <p className="text-sm text-slate-600 truncate">{activity.notes_c}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {format(new Date(activity.date_c), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <Badge variant={activity.type_c.toLowerCase()} size="sm">
                        {activity.type_c}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pipeline Deals */}
        <div>
          <div className="bg-white rounded-xl shadow-soft border border-slate-200/50">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Active Pipeline</h2>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="ExternalLink" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {pipelineDeals.length === 0 ? (
                <Empty
                  title="No active deals"
                  description="Create your first deal to start tracking your pipeline."
                  icon="Target"
                />
              ) : (
                <div className="space-y-4">
                  {pipelineDeals.map((deal, index) => (
                    <motion.div
                      key={deal.Id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg border border-slate-200 hover:border-primary-200 transition-all duration-200 hover:shadow-soft"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
<h4 className="font-semibold text-slate-900 truncate">{deal.title_c}</h4>
                            <p className="text-sm text-slate-600 truncate">{deal.company_c}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant={getStageVariant(deal.stage_c)} size="sm">
                            {deal.stage_c}
                          </Badge>
                          <span className="font-bold text-slate-900">
                            {formatCurrency(deal.value_c)}
                          </span>
                        </div>
                        
                        <div className="text-xs text-slate-500">
Close: {format(new Date(deal.expected_close_date_c), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard