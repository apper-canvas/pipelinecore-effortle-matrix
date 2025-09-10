import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import ActivityModal from "@/components/organisms/ActivityModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { activityService } from "@/services/api/activityService"
import { contactService } from "@/services/api/contactService"
import { format } from "date-fns"

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterActivities()
  }, [activities, searchTerm, filterType, sortBy, sortOrder])

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ])
      setActivities(activitiesData)
      setContacts(contactsData)
    } catch (err) {
      setError("Failed to load activities")
    } finally {
      setLoading(false)
    }
  }

  const filterActivities = () => {
    let filtered = [...activities]

    if (searchTerm) {
filtered = filtered.filter(activity =>
        activity.subject_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.notes_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type_c?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

if (filterType !== "all") {
      filtered = filtered.filter(activity => activity.type_c.toLowerCase() === filterType.toLowerCase())
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

if (sortBy === "date_c") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFilteredActivities(filtered)
  }

const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id.toString() === contactId?.toString())
    return contact ? `${contact.first_name_c} ${contact.last_name_c}` : "Unknown Contact"
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

  const getActivityColor = (type) => {
    switch (type) {
      case "Call": return "bg-blue-100 text-blue-700 border-blue-200"
      case "Email": return "bg-purple-100 text-purple-700 border-purple-200"
      case "Meeting": return "bg-success-100 text-success-700 border-success-200"
      case "Task": return "bg-warning-100 text-warning-700 border-warning-200"
      case "Note": return "bg-slate-100 text-slate-700 border-slate-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const handleEdit = (activity) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedActivity(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return

    try {
      await activityService.delete(activityId)
      setActivities(prev => prev.filter(activity => activity.Id !== activityId))
      toast.success("Activity deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete activity")
    }
  }

  const handleSave = (savedActivity) => {
    if (selectedActivity) {
      setActivities(prev => prev.map(activity => 
        activity.Id === savedActivity.Id ? savedActivity : activity
      ))
    } else {
      setActivities(prev => [...prev, savedActivity])
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Activities</h1>
          <p className="text-slate-600 mt-1">Track all customer interactions and communications</p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Log Activity
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-slate-200/50">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full lg:w-auto">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities by subject, notes, or type..."
              className="w-full"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-slate-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Types</option>
                <option value="call">Calls</option>
                <option value="email">Emails</option>
                <option value="meeting">Meetings</option>
                <option value="task">Tasks</option>
                <option value="note">Notes</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort:</span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-")
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="border border-slate-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="type-asc">Type A-Z</option>
                <option value="subject-asc">Subject A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-xl shadow-soft border border-slate-200/50">
        {filteredActivities.length === 0 ? (
          <div className="p-12">
            {searchTerm || filterType !== "all" ? (
              <Empty
                title="No activities found"
                description="No activities match your current filters. Try adjusting your search or filters."
                icon="Search"
              />
            ) : (
              <Empty
                title="No activities logged"
                description="Start tracking your customer interactions by logging your first activity."
                icon="Activity"
                actionLabel="Log Activity"
                onAction={handleCreate}
              />
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex items-start gap-4">
<div className={`p-3 rounded-xl ${getActivityColor(activity.type_c)}`}>
                    <ApperIcon name={getActivityIcon(activity.type_c)} className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={activity.type_c.toLowerCase()} size="sm">
                            {activity.type_c}
                          </Badge>
                          <h3 className="font-semibold text-slate-900">{activity.subject_c}</h3>
                        </div>
                        
<p className="text-sm text-slate-600 mb-2 line-clamp-2">
                          {activity.notes_c}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
<ApperIcon name="Calendar" className="h-3 w-3" />
                            <span>{format(new Date(activity.date_c), "MMM dd, yyyy 'at' h:mm a")}</span>
                          </div>
                          
                          {activity.contact_id_c && (
                            <div className="flex items-center gap-1">
                              <ApperIcon name="User" className="h-3 w-3" />
                              <span>{getContactName(activity.contact_id_c)}</span>
                            </div>
                          )}
                          
{activity.duration_c > 0 && (
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Clock" className="h-3 w-3" />
                              <span>{activity.duration_c} min</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(activity)}>
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(activity.Id)}>
                          <ApperIcon name="Trash2" className="h-4 w-4 text-error-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {filteredActivities.length > 0 && (
        <div className="text-sm text-slate-600 text-center">
          Showing {filteredActivities.length} of {activities.length} activities
        </div>
      )}

      <ActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

export default Activities