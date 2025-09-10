import contactsData from "../mockData/contacts.json"

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ContactService {
  constructor() {
    this.contacts = [...contactsData]
  }

  async getAll() {
    await delay(300)
    return [...this.contacts]
  }

  async getById(id) {
    await delay(200)
    const contact = this.contacts.find(c => c.Id === parseInt(id))
    if (!contact) {
      throw new Error("Contact not found")
    }
    return { ...contact }
  }

  async create(contactData) {
    await delay(400)
    const newId = Math.max(...this.contacts.map(c => c.Id)) + 1
    const newContact = {
      ...contactData,
      Id: newId,
      createdAt: contactData.createdAt || new Date().toISOString(),
      lastActivity: contactData.lastActivity || new Date().toISOString()
    }
    this.contacts.push(newContact)
    return { ...newContact }
  }

  async update(id, contactData) {
    await delay(350)
    const index = this.contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Contact not found")
    }
    
    const updatedContact = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id)
    }
    this.contacts[index] = updatedContact
    return { ...updatedContact }
  }

  async delete(id) {
    await delay(250)
    const index = this.contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Contact not found")
    }
    
    this.contacts.splice(index, 1)
    return { success: true }
  }
}

export const contactService = new ContactService()