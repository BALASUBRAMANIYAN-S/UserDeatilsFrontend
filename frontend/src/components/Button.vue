<script setup>
defineProps({
  name: String
})
</script>
<template>
    <v-btn variant="tonal">{{ name }}</v-btn>
</template>