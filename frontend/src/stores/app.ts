// Utilities
import { defineStore } from 'pinia'
interface User {
  title: string
  description: string
}
const API_BASE = 'http://127.0.0.1:8000/library/BookViewAPI/'
export const useAppStore = defineStore('app', {
  state: () => ({
    users: [] as User[]
  }),

  actions: {
    async addUser(newUser : User) {
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(newUser)
        })

        if (!response.ok) {
          throw new Error('Server Error')
        }

        const savedUser = await response.json()

        // ✅ push into defined state
        this.users.push(savedUser as any)

        return savedUser
      } catch (error) {
        console.error('Add user failed:', error)
        throw error
      }
    }
  }
})
