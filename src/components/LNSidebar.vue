<script setup lang="ts">
import LNSidebarItem from './LNSidebarItem.vue'
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { theme } = useData()

const sidebarItems = theme.value.sidebar.map(item => ({
  text: item.text,
  items: item.items.map(i => ({
    ...i,
    link: withBase(i.link),
  })),
}))
</script>

<template>
  <nav class="flex flex-col gap-6">
    <div v-for="{ text, items } in sidebarItems">
      <span class="text-gray-700 dark:text-gray-400 font-bold text-sm">
        {{ text }}
      </span>

      <div v-if="items?.length" class="mt-2">
        <LNSidebarItem v-for="subItem in items" :item="subItem" />
      </div>
    </div>
  </nav>
</template>
