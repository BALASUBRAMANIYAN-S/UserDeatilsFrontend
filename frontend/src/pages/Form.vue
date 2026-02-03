<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import Button from '@/components/Button.vue';
import TextInput from '@/components/TextInput.vue';

const store = useAppStore()

const title = ref('') 
const description = ref('')

// submit handler
const addUser = async () => {
  try {
    await store.addUser({
      title: title.value,
      description: description.value
    })

    // clear inputs after success
    title.value = ''
    description.value = ''

  } catch (err) {
    alert('Failed to add user')
  }
}

</script>

<template>
    <v-container class="">
        <v-card class="pa-10 w-100 d-flex flex-column align-center justify-center">
            <TextInput v-model="title" name="Enter Your Name" />
            <TextInput v-model="description" name="Enter Your Age" />
            <Button @click="addUser()" width="100" name="Add" />
        </v-card>
    </v-container>
</template>