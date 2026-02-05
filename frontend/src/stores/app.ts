// Utilities
import { defineStore } from 'pinia'

interface User {
  title: string
  description: string
}

const API_BASE = 'http://127.0.0.1:8000/library/books/'

export const useAppStore = defineStore('app', {
  state: () => ({
    users: [] as User[],
  }),

  actions: {
    // ✅ POST
    async addUser(newUser: User) {
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

        const savedUser: User = await response.json()
        this.users.push(savedUser)

        return savedUser
      } catch (error) {
        console.error('Add user failed:', error)
        throw error
      }
    },

    // ✅ GET
    async getUsers() {
      try {
        const response = await fetch(API_BASE)

        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }

        const data: User[] = await response.json()
        this.users = data

        return data
      } catch (error) {
        console.error('Get users failed:', error)
        throw error
      }
    },
    async DeleteUser(id:Number){
      const response = await fetch(`${API_BASE}${id}/`,{
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Delete failed')
        this.users = this.users.filter(user => user.id !== id)
    }
  }
})
