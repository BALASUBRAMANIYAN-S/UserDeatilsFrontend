<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const title = ref('')
const description = ref('')

const serverItems = ref([])
const loading = ref(false)
const totalItems = ref(0)

const headers = ref([
    { title: 'Title', key: 'title' },
    { title: 'Description', key: 'description' },
])

const addUser = async () => {
    try {
        await store.addUser({
            title: title.value,
            description: description.value
        })
        title.value = ''
        description.value = ''
        serverItems.value = store.users
        totalItems.value = store.users.length
    } catch {
        alert('Failed to add user')
    }
}

onMounted(async () => {
    loading.value = true
    await store.getUsers()
    serverItems.value = store.users
    totalItems.value = store.users.length
    loading.value = false
})
</script>



<template>
    <v-container class="">
        <v-card class="pa-10 w-100 d-flex flex-column align-center justify-center">
            <TextInput v-model="title" name="Enter Your Name" />
            <TextInput v-model="description" name="Enter Your Age" />
            <Button @click="addUser()" width="100" name="Add" />
        </v-card>
        <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
            :items-length="totalItems" :loading="loading" :search="search" item-value="name"
            @update:options="loadItems"></v-data-table-server>
    </v-container>
</template>