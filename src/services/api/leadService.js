import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'lead_c';

// Field definitions for lead_c table with proper visibility compliance
const UPDATEABLE_FIELDS = [
  'Name', 'firstName_c', 'lastName_c', 'email_c', 'phone_c', 
  'status_c', 'source_c', 'company_c', 'title_c'
];

const ALL_FIELDS = [
  'Name', 'firstName_c', 'lastName_c', 'email_c', 'phone_c',
  'status_c', 'source_c', 'company_c', 'title_c', 'Owner',
  'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
];

// Get all leads with filtering and pagination
export const getLeads = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: ALL_FIELDS.map(field => ({ field: { Name: field } })),
      orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
      pagingInfo: { limit: 100, offset: 0 }
    };

    // Add search filter if provided
    if (filters.search) {
      params.where = [
        { FieldName: "firstName_c", Operator: "Contains", Values: [filters.search] },
        { FieldName: "lastName_c", Operator: "Contains", Values: [filters.search] },
        { FieldName: "email_c", Operator: "Contains", Values: [filters.search] },
        { FieldName: "company_c", Operator: "Contains", Values: [filters.search] }
      ];
    }

    // Add status filter if provided
    if (filters.status && filters.status !== 'all') {
      const statusFilter = { FieldName: "status_c", Operator: "ExactMatch", Values: [filters.status] };
      if (params.where) {
        params.whereGroups = [{
          operator: "AND",
          subGroups: [
            {
              conditions: params.where.map(w => ({
                fieldName: w.FieldName,
                operator: w.Operator,
                values: w.Values
              })),
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: statusFilter.FieldName,
                operator: statusFilter.Operator,
                values: statusFilter.Values
              }],
              operator: "AND"
            }
          ]
        }];
        delete params.where;
      } else {
        params.where = [statusFilter];
      }
    }

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching leads:", response.message);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching leads:", error?.response?.data?.message || error.message);
    toast.error("Failed to fetch leads");
    return [];
  }
};

// Get lead by ID
export const getLeadById = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: ALL_FIELDS.map(field => ({ field: { Name: field } }))
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, id, params);
    
    if (!response.success) {
      console.error("Error fetching lead:", response.message);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching lead:", error?.response?.data?.message || error.message);
    toast.error("Failed to fetch lead");
    return null;
  }
};

// Create new lead
export const createLead = async (leadData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (leadData[field] !== undefined && leadData[field] !== null) {
        filteredData[field] = leadData[field];
      }
    });

    // Generate Name field from first and last name
    if (filteredData.firstName_c || filteredData.lastName_c) {
      filteredData.Name = `${filteredData.firstName_c || ''} ${filteredData.lastName_c || ''}`.trim();
    }

    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error creating lead:", response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} leads:`, failed);
        failed.forEach(record => {
          if (record.errors?.length) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success("Lead created successfully");
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error creating lead:", error?.response?.data?.message || error.message);
    toast.error("Failed to create lead");
    return null;
  }
};

// Update lead
export const updateLead = async (id, leadData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields
    const filteredData = { Id: parseInt(id) };
    UPDATEABLE_FIELDS.forEach(field => {
      if (leadData[field] !== undefined) {
        filteredData[field] = leadData[field];
      }
    });

    // Generate Name field from first and last name if either is being updated
    if (filteredData.firstName_c !== undefined || filteredData.lastName_c !== undefined) {
      const firstName = filteredData.firstName_c || leadData.firstName_c || '';
      const lastName = filteredData.lastName_c || leadData.lastName_c || '';
      filteredData.Name = `${firstName} ${lastName}`.trim();
    }

    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error updating lead:", response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} leads:`, failed);
        failed.forEach(record => {
          if (record.errors?.length) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success("Lead updated successfully");
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error updating lead:", error?.response?.data?.message || error.message);
    toast.error("Failed to update lead");
    return null;
  }
};

// Delete lead
export const deleteLead = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error deleting lead:", response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} leads:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success("Lead deleted successfully");
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting lead:", error?.response?.data?.message || error.message);
    toast.error("Failed to delete lead");
    return false;
  }
};

// Get lead statistics
export const getLeadStats = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [{ field: { Name: "Id" } }],
      aggregators: [
        {
          id: "totalLeads",
          fields: [{ field: { Name: "Id" }, Function: "Count" }]
        },
        {
          id: "newLeads",
          fields: [{ field: { Name: "Id" }, Function: "Count" }],
          where: [{ FieldName: "status_c", Operator: "ExactMatch", Values: ["New"] }]
        },
        {
          id: "qualifiedLeads", 
          fields: [{ field: { Name: "Id" }, Function: "Count" }],
          where: [{ FieldName: "status_c", Operator: "ExactMatch", Values: ["Qualified"] }]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching lead stats:", response.message);
      return { total: 0, new: 0, qualified: 0 };
    }
    
    const aggregators = response.aggregators || [];
    return {
      total: aggregators.find(a => a.id === "totalLeads")?.value || 0,
      new: aggregators.find(a => a.id === "newLeads")?.value || 0,
      qualified: aggregators.find(a => a.id === "qualifiedLeads")?.value || 0
    };
  } catch (error) {
    console.error("Error fetching lead stats:", error?.response?.data?.message || error.message);
    return { total: 0, new: 0, qualified: 0 };
  }
};