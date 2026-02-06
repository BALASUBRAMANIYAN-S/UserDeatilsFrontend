<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const login = () => {
    // Basic validation or mock login can go here
    if (username.value && password.value) {
        // Redirect to form page
        router.push('/form')
    } else {
        alert("Please enter username and password")
    }
}
</script>

<template>
    <v-container class="d-flex flex-column align-center justify-center" style="height: 100vh">
        <v-card class="pa-10 w-100" max-width="400">
        <h2 class="text-center mb-6">Login</h2>
        <TextInput v-model="username" name="Username" />
        <TextInput v-model="password" name="Password" type="password" />
        <Button @click="login()" width="100" name="Login" />
        </v-card>
    </v-container>
</template>