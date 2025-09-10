import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { dealService } from "@/services/api/dealService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import DealCard from "@/components/molecules/DealCard";
import Button from "@/components/atoms/Button";
import DealModal from "@/components/organisms/DealModal";

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    setLoading(true)
    setError("")
    
    try {
      const data = await dealService.getAll()
      setDeals(data)
    } catch (err) {
      setError("Failed to load deals")
    } finally {
      setLoading(false)
    }
  }

const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage_c === stage)
  }

const getStageMetrics = (stage) => {
    const stageDeals = getDealsByStage(stage)
    const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0)
    return {
      count: stageDeals.length,
      value: totalValue
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

  const getStageColor = (stage) => {
    switch (stage) {
      case "Lead": return "bg-blue-500"
      case "Qualified": return "bg-purple-500"
      case "Proposal": return "bg-orange-500"
      case "Negotiation": return "bg-yellow-500"
      case "Closed Won": return "bg-success-500"
      case "Closed Lost": return "bg-error-500"
      default: return "bg-slate-500"
    }
  }

  const handleEdit = (deal) => {
    setSelectedDeal(deal)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedDeal(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return

    try {
      await dealService.delete(dealId)
      setDeals(prev => prev.filter(deal => deal.Id !== dealId))
      toast.success("Deal deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete deal")
    }
  }

  const handleStageChange = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.Id === dealId)
      if (!deal) return

      let probability = 25
      switch (newStage) {
        case "Lead": probability = 25; break;
        case "Qualified": probability = 50; break;
        case "Proposal": probability = 75; break;
        case "Negotiation": probability = 90; break;
        case "Closed Won": probability = 100; break;
        case "Closed Lost": probability = 0; break;
      }

const updatedDeal = await dealService.update(dealId, {
        ...deal,
        stage_c: newStage,
        probability_c: probability,
        last_updated_c: new Date().toISOString()
      })

      setDeals(prev => prev.map(d => d.Id === dealId ? updatedDeal : d))
      toast.success(`Deal moved to ${newStage}`)
    } catch (error) {
      toast.error("Failed to update deal stage")
    }
  }

  const handleSave = (savedDeal) => {
    if (selectedDeal) {
      setDeals(prev => prev.map(deal => 
        deal.Id === savedDeal.Id ? savedDeal : deal
      ))
    } else {
      setDeals(prev => [...prev, savedDeal])
    }
  }

  if (loading) return <Loading type="pipeline" />
  if (error) return <Error message={error} onRetry={loadDeals} />

const totalPipelineValue = deals
    .filter(deal => !["Closed Won", "Closed Lost"].includes(deal.stage_c))
    .reduce((sum, deal) => sum + (deal.value_c || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Sales Pipeline</h1>
          <p className="text-slate-600 mt-1">
            Total Pipeline Value: <span className="font-bold text-slate-900">{formatCurrency(totalPipelineValue)}</span>
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          <ApperIcon name="Plus" className="h-4 w-4" />
          New Deal
        </Button>
      </div>

      {/* Pipeline Board */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-slate-200/50">
        {deals.length === 0 ? (
          <div className="py-12">
            <Empty
              title="No deals in pipeline"
              description="Start tracking your sales opportunities by creating your first deal."
              icon="Target"
              actionLabel="Create Deal"
              onAction={handleCreate}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 min-h-[600px]">
            {stages.map((stage) => {
              const stageDeals = getDealsByStage(stage)
              const metrics = getStageMetrics(stage)

              return (
                <div key={stage} className="space-y-4">
                  {/* Stage Header */}
                  <div className="sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getStageColor(stage)}`} />
                      <h3 className="font-semibold text-slate-900">{stage}</h3>
                    </div>
                    <div className="text-xs text-slate-600 mb-4">
                      {metrics.count} deals • {formatCurrency(metrics.value)}
                    </div>
                  </div>

                  {/* Stage Deals */}
                  <div className="space-y-3">
                    {stageDeals.length === 0 ? (
                      <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                        <ApperIcon name="Plus" className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No deals in this stage</p>
                      </div>
                    ) : (
                      stageDeals.map((deal, index) => (
                        <motion.div
                          key={deal.Id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <DealCard
                            deal={deal}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onStageChange={handleStageChange}
                          />
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <DealModal
        deal={selectedDeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

export default Deals