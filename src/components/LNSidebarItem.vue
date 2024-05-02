<script setup lang="ts">
import { useSidebarControl } from '../composables/sidebar'
import { computed } from 'vue'
import type { SidebarLink } from '../types'

const props = defineProps<{
  item: SidebarLink
}>()

const { isActiveLink } = useSidebarControl(computed(() => props.item))
</script>

<template>
  <a :href="item.link"
    class="text-sm text-gray-500 hover:text-gray-600 border-l border-gray-300/50 dark:border-gray-800 flex items-start pl-4 py-1 hover:border-primary-500 dark:hover:border-gray-700"
    :class="{
      '!text-primary-500 !border-primary-500': isActiveLink,
    }">
    {{ item.text }}
  </a>
</template>
