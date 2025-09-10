import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { companyService } from '@/services/api/companyService'
import ApperIcon from '@/components/ApperIcon'
import FormField from '@/components/molecules/FormField'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'

const CompanyModal = ({ company, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: 'Small',
    employees: '',
    phone: '',
    email: '',
    website: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Education',
    'Real Estate',
    'Retail',
    'Energy',
    'Consulting',
    'Media',
    'Legal',
    'Agriculture',
    'Biotechnology',
    'Marketing',
    'Logistics',
    'Other'
  ]

  const companySizes = [
    'Small',
    'Medium',
    'Large'
  ]

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        size: company.size || 'Small',
        employees: company.employees?.toString() || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        address: company.address || ''
      })
    } else {
      setFormData({
        name: '',
        industry: '',
        size: 'Small',
        employees: '',
        phone: '',
        email: '',
        website: '',
        address: ''
      })
    }
    setErrors({})
  }, [company, isOpen])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required'
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required'
    }

    if (formData.employees && (isNaN(formData.employees) || parseInt(formData.employees) < 0)) {
      newErrors.employees = 'Employee count must be a positive number'
    }

    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid website URL (including http:// or https://)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      let result
      if (company) {
        result = await companyService.update(company.Id, formData)
      } else {
        result = await companyService.create(formData)
      }
      
      onSave(result)
    } catch (error) {
      console.error('Error saving company:', error)
      toast.error(company ? 'Failed to update company' : 'Failed to create company')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              {company ? 'Edit Company' : 'Add Company'}
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField
                  label="Company Name *"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  error={errors.name}
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry *
                </label>
                <Select
                  value={formData.industry}
                  onChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                  error={errors.industry}
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Size
                </label>
                <Select
                  value={formData.size}
                  onChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
                >
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </Select>
              </div>

              <div>
                <FormField
                  label="Number of Employees"
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData(prev => ({ ...prev, employees: e.target.value }))}
                  error={errors.employees}
                  placeholder="Enter employee count"
                  min="0"
                />
              </div>

              <div>
                <FormField
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <FormField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  error={errors.email}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <FormField
                  label="Website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  error={errors.website}
                  placeholder="https://company.com"
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter company address"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    {company ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <ApperIcon name={company ? "Save" : "Plus"} className="h-4 w-4" />
                    {company ? 'Update Company' : 'Create Company'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CompanyModal