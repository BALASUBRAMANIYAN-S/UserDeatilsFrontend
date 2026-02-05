<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const title = ref('')
const description = ref('')

const page = ref(1)
const itemsPerPage = ref(5)

const serverItems = ref([])
const loading = ref(false)
const totalItems = ref(0)

const headers = ref([
  { title: 'S.No', key: 'id' },
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions' },
])

// ✅ ADD USER
const addUser = async () => {
  try {
    await store.addUser({
      title: title.value,
      description: description.value,
    })

    title.value = ''
    description.value = ''

    serverItems.value = store.users
    totalItems.value = store.users.length
  } catch {
    alert('Failed to add user')
  }
}

// ✅ SOFT DELETE (DELETE → is_active = false)
const deleteUser = async (id) => {
  if (!confirm('Deactivate this user?')) return

  try {
    await store.deleteUser(id)

    serverItems.value = store.users
    totalItems.value = store.users.length

    // pagination safety
    if (paginatedItems.value.length === 0 && page.value > 1) {
      page.value--
    }
  } catch {
    alert('Delete failed')
  }
}

// ✅ PAGINATION
const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return serverItems.value.slice(start, end)
})

// ✅ LOAD DATA
onMounted(async () => {
  loading.value = true
  await store.getUsers()
  serverItems.value = store.users
  totalItems.value = store.users.length
  loading.value = false
})
</script>


<template>
  <v-container>
    <v-card class="pa-10 w-100 d-flex flex-column align-center">
      <TextInput v-model="title" name="Enter Title" />
      <TextInput v-model="description" name="Enter Description" />
      <Button @click="addUser()" width="100" name="Add" />
    </v-card>

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
      <template #item.actions="{ item }">
        <v-btn
          icon
          color="red"
          variant="text"
          @click="deleteUser(item.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>
