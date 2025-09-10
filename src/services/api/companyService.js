// Mock data storage for companies (no database table available)
const companies = [
  {
    Id: 1,
    name: 'TechVision Corp',
    industry: 'Technology',
    size: 'Large',
    employees: 850,
    phone: '+1-555-0123',
    email: 'info@techvision.com',
    website: 'https://techvision.com',
    address: '123 Innovation Drive, San Francisco, CA 94105',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    Id: 2,
    name: 'Global Manufacturing Inc',
    industry: 'Manufacturing',
    size: 'Large',
    employees: 1200,
    phone: '+1-555-0124',
    email: 'contact@globalmanufacturing.com',
    website: 'https://globalmanufacturing.com',
    address: '456 Industrial Blvd, Detroit, MI 48201',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString()
  },
  {
    Id: 3,
    name: 'HealthFirst Medical',
    industry: 'Healthcare',
    size: 'Medium',
    employees: 320,
    phone: '+1-555-0125',
    email: 'admin@healthfirst.com',
    website: 'https://healthfirst.com',
    address: '789 Medical Center Ave, Boston, MA 02115',
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString()
  },
  {
    Id: 4,
    name: 'EduTech Solutions',
    industry: 'Education',
    size: 'Medium',
    employees: 180,
    phone: '+1-555-0126',
    email: 'hello@edutech.com',
    website: 'https://edutech.com',
    address: '321 Learning Lane, Austin, TX 78701',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString()
  },
  {
    Id: 5,
    name: 'GreenEnergy Partners',
    industry: 'Energy',
    size: 'Medium',
    employees: 275,
    phone: '+1-555-0127',
    email: 'info@greenenergy.com',
    website: 'https://greenenergy.com',
    address: '654 Renewable Way, Seattle, WA 98101',
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString()
  },
  {
    Id: 6,
    name: 'Urban Development LLC',
    industry: 'Real Estate',
    size: 'Large',
    employees: 450,
    phone: '+1-555-0128',
    email: 'contact@urbandevelopment.com',
    website: 'https://urbandevelopment.com',
    address: '987 Construction St, New York, NY 10001',
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString()
  },
  {
    Id: 7,
    name: 'StartupLaunch Accelerator',
    industry: 'Consulting',
    size: 'Small',
    employees: 25,
    phone: '+1-555-0129',
    email: 'team@startupls.com',
    website: 'https://startupls.com',
    address: '147 Entrepreneur Ave, Palo Alto, CA 94301',
    createdAt: new Date('2024-02-12').toISOString(),
    updatedAt: new Date('2024-02-12').toISOString()
  },
  {
    Id: 8,
    name: 'Financial Services Group',
    industry: 'Finance',
    size: 'Large',
    employees: 650,
    phone: '+1-555-0130',
    email: 'info@financialservices.com',
    website: 'https://financialservices.com',
    address: '258 Wall Street, New York, NY 10005',
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-15').toISOString()
  },
  {
    Id: 9,
    name: 'CreativeStudio Agency',
    industry: 'Marketing',
    size: 'Small',
    employees: 45,
    phone: '+1-555-0131',
    email: 'hello@creativestudio.com',
    website: 'https://creativestudio.com',
    address: '369 Design District, Los Angeles, CA 90028',
    createdAt: new Date('2024-02-18').toISOString(),
    updatedAt: new Date('2024-02-18').toISOString()
  },
  {
    Id: 10,
    name: 'LogisticsPro International',
    industry: 'Logistics',
    size: 'Large',
    employees: 890,
    phone: '+1-555-0132',
    email: 'operations@logisticspro.com',
    website: 'https://logisticspro.com',
    address: '741 Transport Hub, Chicago, IL 60601',
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString()
  },
  {
    Id: 11,
    name: 'RetailMax Chain',
    industry: 'Retail',
    size: 'Large',
    employees: 1500,
    phone: '+1-555-0133',
    email: 'corporate@retailmax.com',
    website: 'https://retailmax.com',
    address: '852 Commerce Blvd, Atlanta, GA 30309',
    createdAt: new Date('2024-02-22').toISOString(),
    updatedAt: new Date('2024-02-22').toISOString()
  },
  {
    Id: 12,
    name: 'BioTech Innovations',
    industry: 'Biotechnology',
    size: 'Medium',
    employees: 225,
    phone: '+1-555-0134',
    email: 'research@biotech-inn.com',
    website: 'https://biotech-inn.com',
    address: '963 Science Park, San Diego, CA 92121',
    createdAt: new Date('2024-02-25').toISOString(),
    updatedAt: new Date('2024-02-25').toISOString()
  },
  {
    Id: 13,
    name: 'MediaStream Networks',
    industry: 'Media',
    size: 'Medium',
    employees: 380,
    phone: '+1-555-0135',
    email: 'info@mediastream.com',
    website: 'https://mediastream.com',
    address: '159 Broadcasting Ave, Nashville, TN 37201',
    createdAt: new Date('2024-02-28').toISOString(),
    updatedAt: new Date('2024-02-28').toISOString()
  },
  {
    Id: 14,
    name: 'Legal Associates Firm',
    industry: 'Legal',
    size: 'Medium',
    employees: 95,
    phone: '+1-555-0136',
    email: 'partners@legalassociates.com',
    website: 'https://legalassociates.com',
    address: '753 Justice Square, Washington, DC 20001',
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString()
  },
  {
    Id: 15,
    name: 'AgroTech Farms',
    industry: 'Agriculture',
    size: 'Medium',
    employees: 150,
    phone: '+1-555-0137',
    email: 'info@agrotech.com',
    website: 'https://agrotech.com',
    address: '486 Farmland Road, Des Moines, IA 50309',
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date('2024-03-05').toISOString()
  }
];

// Utility function for realistic API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all companies
export const getAll = async () => {
  await delay(300);
  try {
    return [...companies].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};

// Get company by ID
export const getById = async (id) => {
  await delay(250);
  try {
    const company = companies.find(c => c.Id === parseInt(id));
    return company ? { ...company } : null;
  } catch (error) {
    console.error(`Error fetching company ${id}:`, error);
    return null;
  }
};

// Create new company
export const create = async (companyData) => {
  await delay(400);
  try {
    const newCompany = {
      Id: Math.max(...companies.map(c => c.Id)) + 1,
      name: companyData.name || '',
      industry: companyData.industry || '',
      size: companyData.size || 'Small',
      employees: parseInt(companyData.employees) || 0,
      phone: companyData.phone || '',
      email: companyData.email || '',
      website: companyData.website || '',
      address: companyData.address || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    companies.push(newCompany);
    return { ...newCompany };
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

// Update existing company
export const update = async (id, companyData) => {
  await delay(350);
  try {
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Company not found');
    }

    const updatedCompany = {
      ...companies[index],
      name: companyData.name || companies[index].name,
      industry: companyData.industry || companies[index].industry,
      size: companyData.size || companies[index].size,
      employees: parseInt(companyData.employees) || companies[index].employees,
      phone: companyData.phone || companies[index].phone,
      email: companyData.email || companies[index].email,
      website: companyData.website || companies[index].website,
      address: companyData.address || companies[index].address,
      updatedAt: new Date().toISOString()
    };

    companies[index] = updatedCompany;
    return { ...updatedCompany };
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

// Delete company
export const deleteCompany = async (id) => {
  await delay(300);
  try {
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Company not found');
    }

    companies.splice(index, 1);
    return true;
  } catch (error) {
    console.error("Error deleting company:", error);
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