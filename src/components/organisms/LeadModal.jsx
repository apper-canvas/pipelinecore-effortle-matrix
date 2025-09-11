import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import contactService from "@/services/api/contactService";
import { toast } from "react-toastify";
import { getAll } from "@/services/api/companyService";
import { createLead, updateLead } from "@/services/api/leadService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
const LeadModal = ({ isOpen, onClose, onSuccess, lead = null }) => {
const [formData, setFormData] = useState({
    firstName_c: "",
    lastName_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    title_c: "",
    contact_c: "",
    status_c: "New",
    source_c: "Web"
  })
  const [contacts, setContacts] = useState([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Contacted", label: "Contacted" },
    { value: "Qualified", label: "Qualified" },
    { value: "Disqualified", label: "Disqualified" }
  ]

  const sourceOptions = [
    { value: "Web", label: "Web" },
    { value: "Referral", label: "Referral" },
    { value: "Trade Show", label: "Trade Show" },
    { value: "Other", label: "Other" }
  ]

  useEffect(() => {
if (lead) {
      setFormData({
        firstName_c: lead.firstName_c || "",
        lastName_c: lead.lastName_c || "",
        email_c: lead.email_c || "",
        phone_c: lead.phone_c || "",
        company_c: lead.company_c || "",
        title_c: lead.title_c || "",
        contact_c: lead.contact_c?.Id || lead.contact_c || "",
        status_c: lead.status_c || "New",
        source_c: lead.source_c || "Web"
      })
    } else {
      setFormData({
        firstName_c: "",
        lastName_c: "",
        email_c: "",
        phone_c: "",
        company_c: "",
        title_c: "",
        contact_c: "",
        status_c: "New",
        source_c: "Web"
      })
    }
    setErrors({})
  }, [lead, isOpen])

  // Load contacts for lookup
  useEffect(() => {
    const loadContacts = async () => {
      if (isOpen && contacts.length === 0) {
        setContactsLoading(true)
        try {
          const contactData = await contactService.getAll()
          setContacts(contactData || [])
        } catch (error) {
          console.error("Error loading contacts:", error)
          toast.error("Failed to load contacts")
        } finally {
          setContactsLoading(false)
        }
      }
    }
    
    loadContacts()
  }, [isOpen, contacts.length])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName_c.trim()) {
      newErrors.firstName_c = "First name is required"
    }

    if (!formData.lastName_c.trim()) {
      newErrors.lastName_c = "Last name is required"
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email address"
    }

if (formData.phone_c && !/^[\d\s\-()+ ]+$/.test(formData.phone_c)) {
      newErrors.phone_c = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

setLoading(true)
    
    try {
      // Prepare form data with contact_c as integer if selected
      const submitData = {
        ...formData,
        contact_c: formData.contact_c ? parseInt(formData.contact_c) : null
      }
      
      let result
      if (lead) {
        result = await updateLead(lead.Id, submitData)
      } else {
        result = await createLead(submitData)
      }

      if (result) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving lead:", error)
      toast.error("Failed to save lead")
    } finally {
      setLoading(false)
    }
}
  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {lead ? "Edit Lead" : "Add New Lead"}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              error={errors.firstName_c}
              required
            >
              <Input
                value={formData.firstName_c}
                onChange={(e) => handleInputChange("firstName_c", e.target.value)}
                placeholder="Enter first name"
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Last Name"
              error={errors.lastName_c}
              required
            >
              <Input
                value={formData.lastName_c}
                onChange={(e) => handleInputChange("lastName_c", e.target.value)}
                placeholder="Enter last name"
                disabled={loading}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Email"
              error={errors.email_c}
              required
            >
              <Input
                type="email"
                value={formData.email_c}
                onChange={(e) => handleInputChange("email_c", e.target.value)}
                placeholder="Enter email address"
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Phone"
              error={errors.phone_c}
            >
              <Input
                type="tel"
                value={formData.phone_c}
                onChange={(e) => handleInputChange("phone_c", e.target.value)}
                placeholder="Enter phone number"
                disabled={loading}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Company"
              error={errors.company_c}
            >
              <Input
                value={formData.company_c}
                onChange={(e) => handleInputChange("company_c", e.target.value)}
                placeholder="Enter company name"
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Title"
              error={errors.title_c}
            >
              <Input
                value={formData.title_c}
                onChange={(e) => handleInputChange("title_c", e.target.value)}
                placeholder="Enter job title"
                disabled={loading}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Contact"
              error={errors.contact_c}
            >
              <Select
                value={formData.contact_c}
                onChange={(e) => handleInputChange("contact_c", e.target.value)}
                disabled={contactsLoading || loading}
              >
                <option value="">
                  {contactsLoading ? "Loading contacts..." : "Select a contact"}
                </option>
                {contacts.map((contact) => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.Name || `${contact.first_name_c || ''} ${contact.last_name_c || ''}`.trim() || contact.email_c}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Status"
              error={errors.status_c}
            >
              <Select
                value={formData.status_c}
                onChange={(e) => handleInputChange("status_c", e.target.value)}
                disabled={loading}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Source"
              error={errors.source_c}
            >
              <Select
                value={formData.source_c}
                onChange={(e) => handleInputChange("source_c", e.target.value)}
                disabled={loading}
              >
                {sourceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </div>
              ) : (
                lead ? "Update Lead" : "Create Lead"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default LeadModal