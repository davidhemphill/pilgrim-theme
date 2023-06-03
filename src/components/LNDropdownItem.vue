<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
</script>

<template>
  <MenuItem v-slot="{ active }">
  <button type="button" :class="[
    'flex items-center gap-3 w-full font-semibold text-gray-700 dark:text-gray-200 text-left px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-900',
  ]">
    <slot />
  </button>
  </MenuItem>
</template>
