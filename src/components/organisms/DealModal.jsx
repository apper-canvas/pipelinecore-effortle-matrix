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
    title: "",
    contactId: "",
    company: "",
    value: "",
    stage: "Lead",
    probability: 25,
    expectedCloseDate: ""
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
        title: deal.title || "",
        contactId: deal.contactId || "",
        company: deal.company || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "Lead",
        probability: deal.probability || 25,
        expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split("T")[0] : ""
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
        value: parseFloat(formData.value) || 0,
        expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate).toISOString() : new Date().toISOString()
      }

      let result
      if (deal) {
        result = await dealService.update(deal.Id, {
          ...dealData,
          lastUpdated: new Date().toISOString()
        })
      } else {
        result = await dealService.create({
          ...dealData,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
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
      contactId,
      company: selectedContact?.company || prev.company
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
    
    setFormData(prev => ({ ...prev, stage, probability }))
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
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter deal title..."
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Contact"
              type="select"
              value={formData.contactId}
              onChange={handleContactChange}
            >
              <option value="">Select contact...</option>
              {loadingContacts ? (
                <option disabled>Loading contacts...</option>
              ) : (
                contacts.map(contact => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.firstName} {contact.lastName} - {contact.company}
                  </option>
                ))
              )}
            </FormField>
            
            <FormField
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Company name..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Deal Value ($)"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            
            <FormField
              label="Expected Close Date"
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Stage"
              type="select"
              value={formData.stage}
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
                Probability ({formData.probability}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) }))}
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