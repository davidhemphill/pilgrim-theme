<script setup lang="ts">
import LNSidebarItem from './LNSidebarItem.vue'
import { useSidebar } from 'vitepress/theme'

const { sidebarGroups } = useSidebar()
</script>

<template>
  <nav class="flex flex-col gap-6">
    <div v-for="{ text, items } in sidebarGroups">
      <span class="text-gray-700 dark:text-gray-400 font-bold text-sm">
        {{ text }}
      </span>

      <div v-if="items?.length" class="mt-2">
        <LNSidebarItem v-for="subItem in items" :item="subItem" />
      </div>
    </div>
  </nav>
</template>
