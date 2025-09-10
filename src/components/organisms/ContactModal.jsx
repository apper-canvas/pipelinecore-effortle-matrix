import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const ContactModal = ({ contact, isOpen, onClose, onSave }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    position_c: "",
    linkedinprofile_c: "",
    address_c: "",
    status_c: "New",
    tags_c: []
  })
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")

useEffect(() => {
    if (contact) {
      setFormData({
        first_name_c: contact.first_name_c || "",
        last_name_c: contact.last_name_c || "",
        email_c: contact.email_c || "",
        phone_c: contact.phone_c || "",
        company_c: contact.company_c || "",
        position_c: contact.position_c || "",
        linkedinprofile_c: contact.linkedinprofile_c || "",
        address_c: contact.address_c || "",
        status_c: contact.status_c || "New",
        tags_c: Array.isArray(contact.tags_c) ? contact.tags_c : (contact.tags_c ? contact.tags_c.split(',').filter(Boolean) : [])
      })
    } else {
      setFormData({
        first_name_c: "",
        last_name_c: "",
        email_c: "",
        phone_c: "",
        company_c: "",
        position_c: "",
        linkedinprofile_c: "",
        address_c: "",
        status_c: "New",
        tags_c: []
      })
    }
  }, [contact, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

try {
      let result
      if (contact) {
        result = await contactService.update(contact.Id, {
          ...formData,
          last_activity_c: new Date().toISOString()
        })
      } else {
        result = await contactService.create({
          ...formData,
          created_at_c: new Date().toISOString(),
          last_activity_c: new Date().toISOString()
        })
      }

      onSave(result)
      toast.success(contact ? "Contact updated successfully!" : "Contact created successfully!")
      onClose()
    } catch (error) {
      toast.error("Failed to save contact")
    } finally {
      setLoading(false)
    }
  }

const addTag = () => {
    if (tagInput.trim() && !formData.tags_c.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags_c: [...prev.tags_c, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags_c: prev.tags_c.filter(tag => tag !== tagToRemove)
    }))
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
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-lg">
              <ApperIcon name="User" className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {contact ? "Edit Contact" : "New Contact"}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
              label="First Name"
              value={formData.first_name_c}
              onChange={(e) => setFormData(prev => ({ ...prev, first_name_c: e.target.value }))}
              required
            />
            
            <FormField
              label="Last Name"
              value={formData.last_name_c}
              onChange={(e) => setFormData(prev => ({ ...prev, last_name_c: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
              label="Email"
              type="email"
              value={formData.email_c}
              onChange={(e) => setFormData(prev => ({ ...prev, email_c: e.target.value }))}
              required
            />
            
            <FormField
              label="Phone"
              type="tel"
              value={formData.phone_c}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_c: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
              label="Department"
              value={formData.company_c}
              onChange={(e) => setFormData(prev => ({ ...prev, company_c: e.target.value }))}
            />
            
            <FormField
              label="Position"
              value={formData.position_c}
              onChange={(e) => setFormData(prev => ({ ...prev, position_c: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="LinkedIn Profile"
              value={formData.linkedinprofile_c}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedinprofile_c: e.target.value }))}
              placeholder="https://linkedin.com/in/username"
            />
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <Select
                value={formData.status_c}
                onChange={(e) => setFormData(prev => ({ ...prev, status_c: e.target.value }))}
                className="w-full"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </div>
          </div>
          
          <div className="col-span-full">
            <FormField
              label="Address"
              value={formData.address_c}
              onChange={(e) => setFormData(prev => ({ ...prev, address_c: e.target.value }))}
              placeholder="Street address, City, State, ZIP"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Button type="button" onClick={addTag} variant="secondary" size="sm">
                <ApperIcon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
{formData.tags_c.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags_c.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-md text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary-600"
                    >
                      <ApperIcon name="X" className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              {contact ? "Update Contact" : "Create Contact"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ContactModal