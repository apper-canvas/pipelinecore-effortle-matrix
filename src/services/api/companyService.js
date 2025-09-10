// Company Service - ApperClient integration using contact_c table
// Maps company data to contact_c table structure for database operations

// Initialize ApperClient for database operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Table name for company data (using contact_c table)
const TABLE_NAME = 'contact_c';

// Transform database record to company format for UI
const transformToCompany = (record) => {
  return {
    Id: record.Id,
    name: record.Name || '',
    industry: record.company_c || '',
    size: 'Medium', // Default size since not in database
    employees: 0, // Default employees since not in database
    phone: record.phone_c || '',
    email: record.email_c || '',
    website: '', // Not available in contact_c table
    address: record.address_c || '',
    createdAt: record.CreatedOn || new Date().toISOString(),
    updatedAt: record.ModifiedOn || new Date().toISOString()
  };
};

// Transform company data to database format
const transformToRecord = (companyData) => {
  return {
    Name: companyData.name || '',
    company_c: companyData.industry || '', // Map industry to company_c field
    phone_c: companyData.phone || '',
    email_c: companyData.email || '',
    address_c: companyData.address || ''
    // Only include Updateable fields for create/update operations
  };
};

// Get all companies from database
export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "company_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 50, "offset": 0}
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching companies:", response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data.map(transformToCompany);
  } catch (error) {
    console.error("Error fetching companies:", error.message || error);
    throw error;
  }
};

// Get company by ID from database
export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "company_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success) {
      console.error(`Error fetching company ${id}:`, response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      return null;
    }
    
    return transformToCompany(response.data);
  } catch (error) {
    console.error(`Error fetching company ${id}:`, error.message || error);
    throw error;
  }
};

// Create new company in database
export const create = async (companyData) => {
  try {
    const apperClient = getApperClient();
    
    const recordData = transformToRecord(companyData);
    
    const params = {
      records: [recordData] // ApperClient expects array format
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error creating company:", response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create company:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
          }
          if (record.message) {
            throw new Error(record.message);
          }
        });
      }
      
      if (successful.length > 0) {
        return transformToCompany(successful[0].data);
      }
    }
    
    throw new Error('Failed to create company');
  } catch (error) {
    console.error("Error creating company:", error.message || error);
    throw error;
  }
};

// Update existing company in database
export const update = async (id, companyData) => {
  try {
    const apperClient = getApperClient();
    
    const recordData = {
      Id: parseInt(id),
      ...transformToRecord(companyData)
    };
    
    const params = {
      records: [recordData] // ApperClient expects array format
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error updating company:", response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update company:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
          }
          if (record.message) {
            throw new Error(record.message);
          }
        });
      }
      
      if (successful.length > 0) {
        return transformToCompany(successful[0].data);
      }
    }
    
    throw new Error('Failed to update company');
  } catch (error) {
    console.error("Error updating company:", error.message || error);
    throw error;
  }
};

// Delete company from database
export const deleteCompany = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error deleting company:", response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete company:`, failed);
        failed.forEach(record => {
          if (record.message) {
            throw new Error(record.message);
          }
        });
      }
      
      return successful.length > 0;
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting company:", error.message || error);
    throw error;
  }
};

// Export service object for backward compatibility
export const companyService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteCompany
};
// Default export
export default companyService;