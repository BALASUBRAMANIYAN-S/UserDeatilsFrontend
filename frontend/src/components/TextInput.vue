<script lang="ts" setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  name: String,
  type: {
    type: String,
    default: 'text'
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <v-text-field
  width="300"
    :label="name"
    :type="type"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>
