class ActivityService {
  constructor() {
    this.tableName = 'activity_c'
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Failed to fetch activities:", response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error)
      return []
    }
  }

  async getById(id) {
    if (!this.apperClient) this.initializeClient()
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(`Failed to fetch activity ${id}:`, response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async create(activityData) {
    if (!this.apperClient) this.initializeClient()
    
    try {
      const params = {
        records: [{
          Name: activityData.subject_c || activityData.Name || '',
          type_c: activityData.type_c || 'Call',
          subject_c: activityData.subject_c || '',
          notes_c: activityData.notes_c || '',
          date_c: activityData.date_c || new Date().toISOString(),
          duration_c: parseInt(activityData.duration_c) || 0,
          contact_id_c: activityData.contact_id_c ? parseInt(activityData.contact_id_c) : null,
          deal_id_c: activityData.deal_id_c ? parseInt(activityData.deal_id_c) : null
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Failed to create activity:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error)
      throw error
    }
  }

  async update(id, activityData) {
    if (!this.apperClient) this.initializeClient()
    
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: activityData.subject_c || activityData.Name || '',
          type_c: activityData.type_c || 'Call',
          subject_c: activityData.subject_c || '',
          notes_c: activityData.notes_c || '',
          date_c: activityData.date_c || new Date().toISOString(),
          duration_c: parseInt(activityData.duration_c) || 0,
          contact_id_c: activityData.contact_id_c ? parseInt(activityData.contact_id_c) : null,
          deal_id_c: activityData.deal_id_c ? parseInt(activityData.deal_id_c) : null
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Failed to update activity:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activities:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error)
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
        console.error("Failed to delete activity:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        
        return successful.length > 0
      }
      
      return false
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export const activityService = new ActivityService()