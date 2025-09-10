import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import ContactModal from "@/components/organisms/ContactModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { contactService } from "@/services/api/contactService"
import { format } from "date-fns"

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState("lastActivity")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    filterContacts()
  }, [contacts, searchTerm, sortBy, sortOrder])

  const loadContacts = async () => {
    setLoading(true)
    setError("")
    
    try {
      const data = await contactService.getAll()
      setContacts(data)
    } catch (err) {
      setError("Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }

  const filterContacts = () => {
    let filtered = [...contacts]

    if (searchTerm) {
filtered = filtered.filter(contact =>
        contact.first_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.last_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company_c?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

if (sortBy === "name") {
        aValue = `${a.first_name_c} ${a.last_name_c}`
        bValue = `${b.first_name_c} ${b.last_name_c}`
      }

if (sortBy === "last_activity_c" || sortBy === "created_at_c") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFilteredContacts(filtered)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const handleEdit = (contact) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedContact(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return

    try {
      await contactService.delete(contactId)
      setContacts(prev => prev.filter(contact => contact.Id !== contactId))
      toast.success("Contact deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete contact")
    }
  }

  const handleSave = (savedContact) => {
    if (selectedContact) {
      setContacts(prev => prev.map(contact => 
        contact.Id === savedContact.Id ? savedContact : contact
      ))
    } else {
      setContacts(prev => [...prev, savedContact])
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return "ChevronsUpDown"
    return sortOrder === "asc" ? "ChevronUp" : "ChevronDown"
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadContacts} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Contacts</h1>
          <p className="text-slate-600 mt-1">Manage your customer relationships</p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-slate-200/50">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full sm:w-auto">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contacts by name, email, or company..."
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="name">Name</option>
              <option value="company">Company</option>
              <option value="lastActivity">Last Activity</option>
              <option value="createdAt">Created Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-slate-200/50">
        {filteredContacts.length === 0 ? (
          searchTerm ? (
            <div className="p-12">
              <Empty
                title="No contacts found"
                description={`No contacts match "${searchTerm}". Try adjusting your search.`}
                icon="Search"
              />
            </div>
          ) : (
            <div className="p-12">
              <Empty
                title="No contacts yet"
                description="Start building your customer database by adding your first contact."
                icon="Users"
                actionLabel="Add Contact"
                onAction={handleCreate}
              />
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <ApperIcon name={getSortIcon("name")} className="h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort("company")}
                  >
                    <div className="flex items-center gap-2">
                      Company
                      <ApperIcon name={getSortIcon("company")} className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Contact Info</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tags</th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort("lastActivity")}
                  >
                    <div className="flex items-center gap-2">
                      Last Activity
                      <ApperIcon name={getSortIcon("lastActivity")} className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredContacts.map((contact, index) => (
                  <motion.tr
                    key={contact.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
<div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm">
                          {contact.first_name_c?.[0]}{contact.last_name_c?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {contact.first_name_c} {contact.last_name_c}
                          </div>
                          <div className="text-sm text-slate-500">{contact.position_c}</div>
                        </div>
                      </div>
                    </td>
<td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{contact.company_c}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
<ApperIcon name="Mail" className="h-3 w-3" />
                          {contact.email_c}
                        </div>
                        {contact.phone_c && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <ApperIcon name="Phone" className="h-3 w-3" />
                            {contact.phone_c}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
<div className="flex flex-wrap gap-1">
                        {(Array.isArray(contact.tags_c) ? contact.tags_c : (contact.tags_c ? contact.tags_c.split(',').filter(Boolean) : []))?.map((tag) => (
                          <Badge key={tag} variant="default" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
<td className="px-6 py-4 text-sm text-slate-600">
                      {format(new Date(contact.last_activity_c), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(contact)}>
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(contact.Id)}>
                          <ApperIcon name="Trash2" className="h-4 w-4 text-error-500" />
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

      {/* Results Summary */}
      {filteredContacts.length > 0 && (
        <div className="text-sm text-slate-600 text-center">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </div>
      )}

      <ContactModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

export default Contacts