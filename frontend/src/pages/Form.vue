<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/app'

// Initialize Pinia store
const store = useAppStore()

// Form reactive variables 
const title = ref('')
const description = ref('')

// Pagination state
const page = ref(1)
const itemsPerPage = ref(5)

// Data state
const serverItems = ref([])
const loading = ref(false)
const totalItems = ref(0)

// Table headers configuration
    // Table headers configuration
    const headers = ref([
      { title: 'S.No', key: 'id' },
      { title: 'Title', key: 'title' },
      { title: 'Description', key: 'description' },
      { title: 'Status', key: 'is_active' },
      { title: 'Actions', key: 'actions' },
    ])

    const getStatusColor = (isActive) => {
      return isActive ? 'green' : 'red'
    }

    /**
     * Adds a new user by calling the store action.
     * Refreshes the local list on success.
     */
    const addUser = async () => {
      try {
        if (!title.value || !description.value) {
          alert('Please fill in all fields')
          return
        }

        await store.addUser({
          title: title.value,
          description: description.value,
        })

        // Clear form inputs
        title.value = ''
        description.value = ''

        // Update list from store state
        serverItems.value = store.users
        totalItems.value = store.users.length
      } catch (error) {
        console.error(error)
        alert('Failed to add user')
      }
    }

    /**
     * Deletes a user after confirmation.
     * Handles pagination updates if the last item on a page is deleted.
     * @param {number} id - The ID of the user to delete
     */
    const deleteUser = async (user) => {
      if (!user.is_active) return 
      
      if (!confirm('Deactivate this user?')) return

      try {
        await store.deleteUser(user.id)

        // Update local state after deletion
        // We need to re-fetch or manually update the item in the list to trigger reactivity if the store doesn't automatically do it for deep properties in this specific way
        // But store.deleteUser filters it out. Wait, we want to Keep it but mark as disabled?
        // The backend soft deletes it. 
        // If we want to show it as disabled, we should re-fetch the list to get the updated status from backend, 
        // OR manually find it and set is_active = false.
        // The current store.deleteUser removes it from the list: `this.users = this.users.filter(user => user.id !== id)`
        // We should probably change the store logic if we want to keep it in the list!
        // For now, let's re-fetch to be safe and consistent with "Show frontend Active, disable"
        await store.getUsers()
        serverItems.value = store.users
        totalItems.value = store.users.length

        // Pagination safety check: Move to previous page if current page becomes empty
        if (paginatedItems.value.length === 0 && page.value > 1) {
          page.value--
        }
      } catch (error) {
        console.error(error)
        alert('Delete failed')
      }
    }

    /**
     * Computed property for client-side pagination.
     * Slices the full dataset based on current page and items per page.
     */
    const paginatedItems = computed(() => {
      const start = (page.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return serverItems.value.slice(start, end)
    })

    /**
     * Fetches initial data when component mounts.
     */
    onMounted(async () => {
      try {
        loading.value = true
        await store.getUsers()
        serverItems.value = store.users
        totalItems.value = store.users.length
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    })
    </script>


    <template>
      <v-container>
        <!-- Add User Form Card -->
        <v-card class="pa-10 w-100 d-flex flex-column align-center">
          <TextInput v-model="title" name="Enter Title" />
          <TextInput v-model="description" name="Enter Description" />
          <Button @click="addUser()" width="100" name="Add" />
        </v-card>

        <!-- Users Data Table -->
        <v-data-table
          :headers="headers"
          :items="paginatedItems"
          :items-per-page="itemsPerPage"
          :page="page"
          :server-items-length="totalItems"
          :loading="loading"
          @update:page="page = $event"
          @update:items-per-page="itemsPerPage = $event"
        >
          <template #item.is_active="{ item }">
            <v-chip
              :color="getStatusColor(item.is_active)"
              class="text-capitalize"
            >
              {{ item.is_active ? 'Active' : 'Disabled' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              icon
              :color="item.is_active ? 'red' : 'grey'"
              variant="text"
              @click="deleteUser(item)"
              :disabled="!item.is_active"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-container>
    </template>
