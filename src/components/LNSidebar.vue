<script setup lang="ts">
import LNSidebarItem from './LNSidebarItem.vue'
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { theme } = useData()

const sidebarItems = computed(() =>
    theme.value.sidebar.map(item => ({
        text: item.text,
        link: withBase(item.link),
        items: item.items.map(i => ({
            ...i,
            link: withBase(i.link),
        })),
    }))
)
</script>

<template>
    <nav class="flex flex-col gap-6">
        <div v-for="{ text, link, items } in sidebarItems">
            <a :href="link" class="text-gray-700 dark:text-gray-400 font-bold text-sm">
                {{ text }}
            </a>

            <div v-if="items?.length" class="mt-2">
                <LNSidebarItem v-for="subItem in items" :item="subItem" />
            </div>
        </div>
    </nav>
</template>
