import activitiesData from "../mockData/activities.json"

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ActivityService {
  constructor() {
    this.activities = [...activitiesData]
  }

  async getAll() {
    await delay(300)
    return [...this.activities]
  }

  async getById(id) {
    await delay(200)
    const activity = this.activities.find(a => a.Id === parseInt(id))
    if (!activity) {
      throw new Error("Activity not found")
    }
    return { ...activity }
  }

  async create(activityData) {
    await delay(400)
    const newId = Math.max(...this.activities.map(a => a.Id)) + 1
    const newActivity = {
      ...activityData,
      Id: newId,
      date: activityData.date || new Date().toISOString()
    }
    this.activities.push(newActivity)
    return { ...newActivity }
  }

  async update(id, activityData) {
    await delay(350)
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Activity not found")
    }
    
    const updatedActivity = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id)
    }
    this.activities[index] = updatedActivity
    return { ...updatedActivity }
  }

  async delete(id) {
    await delay(250)
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Activity not found")
    }
    
    this.activities.splice(index, 1)
    return { success: true }
  }
}

export const activityService = new ActivityService()