import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import Badge from "@/components/atoms/Badge"
import Select from "@/components/atoms/Select"
import LeadModal from "@/components/organisms/LeadModal"
import { getLeads, deleteLead } from "@/services/api/leadService"
import { toast } from "react-toastify"
import { format } from "date-fns"

const Leads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [sortField, setSortField] = useState("CreatedOn")
  const [sortDirection, setSortDirection] = useState("desc")

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "New", label: "New" },
    { value: "Contacted", label: "Contacted" },
    { value: "Qualified", label: "Qualified" },
    { value: "Disqualified", label: "Disqualified" }
  ]

  const sourceOptions = ["Web", "Referral", "Trade Show", "Other"]

  const loadLeads = async () => {
    setLoading(true)
    try {
      const filters = {
        search: searchTerm,
        status: statusFilter
      }
      const data = await getLeads(filters)
      setLeads(data)
    } catch (error) {
      console.error("Error loading leads:", error)
      toast.error("Failed to load leads")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [searchTerm, statusFilter])

  const handleCreateLead = () => {
    setSelectedLead(null)
    setIsModalOpen(true)
  }

  const handleEditLead = (lead) => {
    setSelectedLead(lead)
    setIsModalOpen(true)
  }

  const handleDeleteLead = async (lead) => {
    if (!window.confirm(`Are you sure you want to delete ${lead.Name}?`)) {
      return
    }

    try {
      await deleteLead(lead.Id)
      loadLeads()
    } catch (error) {
      console.error("Error deleting lead:", error)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedLead(null)
  }

  const handleModalSuccess = () => {
    loadLeads()
    handleModalClose()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "blue"
      case "Contacted":
        return "yellow"
      case "Qualified":
        return "green"
      case "Disqualified":
        return "red"
      default:
        return "gray"
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedLeads = [...leads].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (sortField === "CreatedOn") {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    } else if (typeof aValue === "string") {
      aValue = aValue?.toLowerCase() || ""
      bValue = bValue?.toLowerCase() || ""
    }
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ApperIcon name="ArrowUpDown" className="h-4 w-4 text-slate-400" />
    }
    return sortDirection === "asc" ? 
      <ApperIcon name="ArrowUp" className="h-4 w-4 text-slate-600" /> :
      <ApperIcon name="ArrowDown" className="h-4 w-4 text-slate-600" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="mt-1 text-slate-600">Manage and track your sales leads</p>
        </div>
        <Button onClick={handleCreateLead} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ApperIcon name="Users" className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Leads</p>
              <p className="text-2xl font-semibold text-slate-900">{leads.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ApperIcon name="UserPlus" className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">New Leads</p>
              <p className="text-2xl font-semibold text-slate-900">
                {leads.filter(lead => lead.status_c === "New").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ApperIcon name="CheckCircle" className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Qualified</p>
              <p className="text-2xl font-semibold text-slate-900">
                {leads.filter(lead => lead.status_c === "Qualified").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ApperIcon name="TrendingUp" className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
              <p className="text-2xl font-semibold text-slate-900">
                {leads.length > 0 ? Math.round((leads.filter(lead => lead.status_c === "Qualified").length / leads.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {sortedLeads.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Users" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No leads found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first lead"
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={handleCreateLead}>Add Lead</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("Name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <SortIcon field="Name" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("email_c")}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      <SortIcon field="email_c" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("company_c")}
                  >
                    <div className="flex items-center gap-2">
                      Company
                      <SortIcon field="company_c" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("status_c")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon field="status_c" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("source_c")}
                  >
                    <div className="flex items-center gap-2">
                      Source
                      <SortIcon field="source_c" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("CreatedOn")}
                  >
                    <div className="flex items-center gap-2">
                      Created
                      <SortIcon field="CreatedOn" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {sortedLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {lead.Name || `${lead.firstName_c || ''} ${lead.lastName_c || ''}`.trim()}
                        </div>
                        <div className="text-sm text-slate-500">{lead.title_c}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {lead.email_c}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {lead.phone_c}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {lead.company_c}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={getStatusColor(lead.status_c)}>
                        {lead.status_c}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {lead.source_c}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {lead.CreatedOn ? format(new Date(lead.CreatedOn), 'MMM d, yyyy') : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditLead(lead)}
                          className="text-primary-600 hover:text-primary-900 transition-colors"
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        lead={selectedLead}
      />
    </div>
  )
}

export default Leads