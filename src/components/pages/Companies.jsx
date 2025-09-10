import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import CompanyModal from '@/components/organisms/CompanyModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { companyService } from '@/services/api/companyService'
import { format } from 'date-fns'

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadCompanies()
  }, [])

  useEffect(() => {
    filterCompanies()
  }, [companies, searchTerm, sortBy, sortOrder])

  const loadCompanies = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await companyService.getAll()
      setCompanies(data)
    } catch (err) {
      setError('Failed to load companies. Please try again.')
      console.error('Error loading companies:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterCompanies = () => {
    let filtered = [...companies]

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]

      if (sortBy === 'employees') {
        aVal = parseInt(aVal) || 0
        bVal = parseInt(bVal) || 0
      } else if (sortBy === 'createdAt') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      } else {
        aVal = (aVal || '').toString().toLowerCase()
        bVal = (bVal || '').toString().toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    setFilteredCompanies(filtered)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleEdit = (company) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedCompany(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (companyId) => {
    if (!confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return
    }

    try {
      await companyService.delete(companyId)
      setCompanies(prev => prev.filter(c => c.Id !== companyId))
      toast.success('Company deleted successfully')
    } catch (error) {
      console.error('Error deleting company:', error)
      toast.error('Failed to delete company')
    }
  }

  const handleSave = async (savedCompany) => {
    if (selectedCompany) {
      setCompanies(prev => prev.map(c => c.Id === savedCompany.Id ? savedCompany : c))
      toast.success('Company updated successfully')
    } else {
      setCompanies(prev => [savedCompany, ...prev])
      toast.success('Company created successfully')
    }
    setIsModalOpen(false)
    setSelectedCompany(null)
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown'
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'
  }

  const getSizeVariant = (size) => {
    switch (size) {
      case 'Small': return 'secondary'
      case 'Medium': return 'warning'
      case 'Large': return 'primary'
      default: return 'secondary'
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadCompanies} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
          <p className="text-slate-600">Manage your company database and relationships</p>
        </div>
        <Button onClick={handleCreate} className="shrink-0">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search companies..."
            className="w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-200 overflow-hidden">
        {filteredCompanies.length === 0 ? (
          <Empty
            title="No companies found"
            description="Get started by adding your first company or adjust your search criteria."
            action={
              <Button onClick={handleCreate}>
                <ApperIcon name="Plus" className="h-4 w-4" />
                Add Company
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Company Name
                      <ApperIcon name={getSortIcon('name')} className="h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort('industry')}
                  >
                    <div className="flex items-center gap-2">
                      Industry
                      <ApperIcon name={getSortIcon('industry')} className="h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort('employees')}
                  >
                    <div className="flex items-center gap-2">
                      Employees
                      <ApperIcon name={getSortIcon('employees')} className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Size</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Contact</th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Created
                      <ApperIcon name={getSortIcon('createdAt')} className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCompanies.map((company) => (
                  <motion.tr
                    key={company.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{company.name}</div>
                        <div className="text-sm text-slate-500 truncate max-w-[200px]">{company.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{company.industry}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{company.employees?.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getSizeVariant(company.size)}>
                        {company.size}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-slate-900">{company.email}</div>
                        <div className="text-slate-500">{company.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {company.createdAt ? format(new Date(company.createdAt), 'MMM d, yyyy') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(company)}
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(company.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CompanyModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCompany(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}

export default Companies