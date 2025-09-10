import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { activityService } from "@/services/api/activityService"
import { contactService } from "@/services/api/contactService"
import { dealService } from "@/services/api/dealService"

const ActivityModal = ({ activity, isOpen, onClose, onSave }) => {
const [formData, setFormData] = useState({
    type_c: "Call",
    subject_c: "",
    notes_c: "",
    contact_id_c: "",
    deal_id_c: "",
    date_c: "",
    duration_c: ""
  })
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  useEffect(() => {
    if (activity) {
      setFormData({
type_c: activity.type_c || "Call",
        subject_c: activity.subject_c || "",
        notes_c: activity.notes_c || "",
        contact_id_c: activity.contact_id_c?.toString() || "",
        deal_id_c: activity.deal_id_c?.toString() || "",
        date_c: activity.date_c ? activity.date_c.split("T")[0] : new Date().toISOString().split("T")[0],
        duration_c: activity.duration_c?.toString() || ""
      })
    } else {
      setFormData({
        type: "Call",
        subject: "",
        notes: "",
        contactId: "",
        dealId: "",
        date: new Date().toISOString().split("T")[0],
        duration: ""
      })
    }
  }, [activity, isOpen])

  const loadData = async () => {
    setLoadingData(true)
    try {
      const [contactsData, dealsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ])
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
const activityData = {
        ...formData,
        duration_c: parseInt(formData.duration_c) || 0,
        date_c: new Date(formData.date_c).toISOString()
      }

      let result
      if (activity) {
        result = await activityService.update(activity.Id, activityData)
      } else {
        result = await activityService.create(activityData)
      }

      onSave(result)
      toast.success(activity ? "Activity updated successfully!" : "Activity created successfully!")
      onClose()
    } catch (error) {
      toast.error("Failed to save activity")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-warning-50 to-warning-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-warning-600 to-warning-700 p-2 rounded-lg">
              <ApperIcon name="Activity" className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {activity ? "Edit Activity" : "New Activity"}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Activity Type"
              type="select"
value={formData.type_c}
              onChange={(e) => setFormData(prev => ({ ...prev, type_c: e.target.value }))}
            >
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Meeting">Meeting</option>
              <option value="Task">Task</option>
              <option value="Note">Note</option>
            </FormField>
            
            <FormField
              label="Date"
              type="date"
              value={formData.date_c}
              onChange={(e) => setFormData(prev => ({ ...prev, date_c: e.target.value }))}
              required
            />
          </div>

<FormField
            label="Subject"
            value={formData.subject_c}
            onChange={(e) => setFormData(prev => ({ ...prev, subject_c: e.target.value }))}
            placeholder="Activity subject..."
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
              label="Contact"
              type="select"
              value={formData.contact_id_c}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_id_c: e.target.value }))}
            >
              <option value="">Select contact...</option>
              {loadingData ? (
                <option disabled>Loading...</option>
              ) : (
                contacts.map(contact => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.first_name_c} {contact.last_name_c}
                  </option>
                ))
              )}
            </FormField>
            
<FormField
              label="Related Deal"
              type="select"
              value={formData.deal_id_c}
              onChange={(e) => setFormData(prev => ({ ...prev, deal_id_c: e.target.value }))}
            >
              <option value="">Select deal...</option>
              {loadingData ? (
                <option disabled>Loading...</option>
              ) : (
                deals.map(deal => (
                  <option key={deal.Id} value={deal.Id}>
                    {deal.title_c}
                  </option>
                ))
              )}
            </FormField>
          </div>

<FormField
            label="Duration (minutes)"
            type="number"
            value={formData.duration_c}
            onChange={(e) => setFormData(prev => ({ ...prev, duration_c: e.target.value }))}
            placeholder="0"
            min="0"
          />

<FormField
            label="Notes"
            type="textarea"
            value={formData.notes_c}
            onChange={(e) => setFormData(prev => ({ ...prev, notes_c: e.target.value }))}
            placeholder="Activity notes..."
            rows={4}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
              ) : (
                <ApperIcon name="Save" className="h-4 w-4" />
              )}
              {activity ? "Update Activity" : "Create Activity"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ActivityModal