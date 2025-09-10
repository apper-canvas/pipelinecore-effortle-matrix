import dealsData from "../mockData/deals.json"

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class DealService {
  constructor() {
    this.deals = [...dealsData]
  }

  async getAll() {
    await delay(300)
    return [...this.deals]
  }

  async getById(id) {
    await delay(200)
    const deal = this.deals.find(d => d.Id === parseInt(id))
    if (!deal) {
      throw new Error("Deal not found")
    }
    return { ...deal }
  }

  async create(dealData) {
    await delay(400)
    const newId = Math.max(...this.deals.map(d => d.Id)) + 1
    const newDeal = {
      ...dealData,
      Id: newId,
      createdAt: dealData.createdAt || new Date().toISOString(),
      lastUpdated: dealData.lastUpdated || new Date().toISOString()
    }
    this.deals.push(newDeal)
    return { ...newDeal }
  }

  async update(id, dealData) {
    await delay(350)
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    
    const updatedDeal = {
      ...this.deals[index],
      ...dealData,
      Id: parseInt(id),
      lastUpdated: new Date().toISOString()
    }
    this.deals[index] = updatedDeal
    return { ...updatedDeal }
  }

  async delete(id) {
    await delay(250)
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    
    this.deals.splice(index, 1)
    return { success: true }
  }
}

export const dealService = new DealService()