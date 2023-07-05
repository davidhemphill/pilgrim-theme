<script setup lang="ts">
import { NavLink } from '../config'

defineProps<{
  item: NavLink
}>()
</script>

<template>
  <a :href="item.link" class="text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-primary-500">
    {{ item.text }}
  </a>
</template>
