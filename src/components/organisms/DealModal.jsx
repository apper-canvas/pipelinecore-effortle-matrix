import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { dealService } from "@/services/api/dealService"
import { contactService } from "@/services/api/contactService"

const DealModal = ({ deal, isOpen, onClose, onSave }) => {
const [formData, setFormData] = useState({
    title_c: "",
    contact_id_c: "",
    company_c: "",
    value_c: "",
    stage_c: "Lead",
    probability_c: 25,
    expected_close_date_c: ""
  })
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingContacts, setLoadingContacts] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadContacts()
    }
  }, [isOpen])

  useEffect(() => {
    if (deal) {
      setFormData({
title_c: deal.title_c || "",
        contact_id_c: deal.contact_id_c?.toString() || "",
        company_c: deal.company_c || "",
        value_c: deal.value_c?.toString() || "",
        stage_c: deal.stage_c || "Lead",
        probability_c: deal.probability_c || 25,
        expected_close_date_c: deal.expected_close_date_c ? deal.expected_close_date_c.split("T")[0] : ""
      })
    } else {
      setFormData({
        title: "",
        contactId: "",
        company: "",
        value: "",
        stage: "Lead",
        probability: 25,
        expectedCloseDate: ""
      })
    }
  }, [deal, isOpen])

  const loadContacts = async () => {
    setLoadingContacts(true)
    try {
      const data = await contactService.getAll()
      setContacts(data)
    } catch (error) {
      toast.error("Failed to load contacts")
    } finally {
      setLoadingContacts(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
const dealData = {
        ...formData,
        value_c: parseFloat(formData.value_c) || 0,
        expected_close_date_c: formData.expected_close_date_c ? new Date(formData.expected_close_date_c).toISOString() : new Date().toISOString()
      }

      let result
if (deal) {
        result = await dealService.update(deal.Id, {
          ...dealData,
          last_updated_c: new Date().toISOString()
        })
      } else {
        result = await dealService.create({
          ...dealData,
          created_at_c: new Date().toISOString(),
          last_updated_c: new Date().toISOString()
        })
      }

      onSave(result)
      toast.success(deal ? "Deal updated successfully!" : "Deal created successfully!")
      onClose()
    } catch (error) {
      toast.error("Failed to save deal")
    } finally {
      setLoading(false)
    }
  }

  const handleContactChange = (e) => {
    const contactId = e.target.value
    const selectedContact = contacts.find(c => c.Id.toString() === contactId)
    
setFormData(prev => ({
      ...prev,
      contact_id_c: contactId,
      company_c: selectedContact?.company_c || prev.company_c
    }))
  }

  const handleStageChange = (e) => {
    const stage = e.target.value
    let probability = 25
    
    switch (stage) {
      case "Lead": probability = 25; break;
      case "Qualified": probability = 50; break;
      case "Proposal": probability = 75; break;
      case "Negotiation": probability = 90; break;
      case "Closed Won": probability = 100; break;
      case "Closed Lost": probability = 0; break;
    }
    
setFormData(prev => ({ ...prev, stage_c: stage, probability_c: probability }))
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
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-success-50 to-success-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-success-600 to-success-700 p-2 rounded-lg">
              <ApperIcon name="Target" className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {deal ? "Edit Deal" : "New Deal"}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
<FormField
            label="Deal Title"
            value={formData.title_c}
            onChange={(e) => setFormData(prev => ({ ...prev, title_c: e.target.value }))}
            placeholder="Enter deal title..."
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
              label="Contact"
              type="select"
              value={formData.contact_id_c}
              onChange={handleContactChange}
            >
              <option value="">Select contact...</option>
              {loadingContacts ? (
                <option disabled>Loading contacts...</option>
              ) : (
                contacts.map(contact => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.first_name_c} {contact.last_name_c} - {contact.company_c}
                  </option>
                ))
              )}
            </FormField>
            
<FormField
              label="Company"
              value={formData.company_c}
              onChange={(e) => setFormData(prev => ({ ...prev, company_c: e.target.value }))}
              placeholder="Company name..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
              label="Deal Value ($)"
              type="number"
              value={formData.value_c}
              onChange={(e) => setFormData(prev => ({ ...prev, value_c: e.target.value }))}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            
<FormField
              label="Expected Close Date"
              type="date"
              value={formData.expected_close_date_c}
              onChange={(e) => setFormData(prev => ({ ...prev, expected_close_date_c: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
              label="Stage"
              type="select"
              value={formData.stage_c}
              onChange={handleStageChange}
            >
              <option value="Lead">Lead</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </FormField>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Probability ({formData.probability_c}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.probability_c}
                onChange={(e) => setFormData(prev => ({ ...prev, probability_c: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

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
              {deal ? "Update Deal" : "Create Deal"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default DealModal