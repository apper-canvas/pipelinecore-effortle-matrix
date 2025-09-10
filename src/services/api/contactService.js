class ContactService {
  constructor() {
    this.tableName = 'contact_c'
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll() {
    if (!this.apperClient) this.initializeClient()
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
{"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "linkedinprofile_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_activity_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Failed to fetch contacts:", response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error)
      return []
    }
  }

  async getById(id) {
    if (!this.apperClient) this.initializeClient()
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
{"field": {"Name": "company_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "linkedinprofile_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_activity_c"}}
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(`Failed to fetch contact ${id}:`, response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async create(contactData) {
    if (!this.apperClient) this.initializeClient()
    
    try {
      const params = {
        records: [{
          Name: `${contactData.first_name_c || ''} ${contactData.last_name_c || ''}`.trim(),
          first_name_c: contactData.first_name_c || '',
          last_name_c: contactData.last_name_c || '',
email_c: contactData.email_c || '',
          phone_c: contactData.phone_c || '',
          company_c: contactData.company_c || '',
          position_c: contactData.position_c || '',
          linkedinprofile_c: contactData.linkedinprofile_c || '',
          address_c: contactData.address_c || '',
          status_c: contactData.status_c || 'New',
          tags_c: Array.isArray(contactData.tags_c) ? contactData.tags_c.join(',') : contactData.tags_c || '',
          created_at_c: new Date().toISOString(),
          last_activity_c: new Date().toISOString()
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Failed to create contact:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error)
      throw error
    }
  }

  async update(id, contactData) {
    if (!this.apperClient) this.initializeClient()
    
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${contactData.first_name_c || ''} ${contactData.last_name_c || ''}`.trim(),
          first_name_c: contactData.first_name_c || '',
          last_name_c: contactData.last_name_c || '',
          email_c: contactData.email_c || '',
phone_c: contactData.phone_c || '',
          company_c: contactData.company_c || '',
          position_c: contactData.position_c || '',
          linkedinprofile_c: contactData.linkedinprofile_c || '',
          address_c: contactData.address_c || '',
          status_c: contactData.status_c || 'New',
          tags_c: Array.isArray(contactData.tags_c) ? contactData.tags_c.join(',') : contactData.tags_c || '',
          last_activity_c: new Date().toISOString()
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Failed to update contact:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error)
      throw error
    }
  }

  async delete(id) {
    if (!this.apperClient) this.initializeClient()
    
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Failed to delete contact:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        
        return successful.length > 0
      }
      
      return false
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export const contactService = new ContactService()