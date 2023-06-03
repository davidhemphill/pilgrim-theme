<script setup lang="ts">
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/vue/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'
import LNDropdownItem from './LNDropdownItem.vue'

const modes = [
  { text: 'Light', value: 'light', icon: SunIcon },
  { text: 'Dark', value: 'dark', icon: MoonIcon },
  { text: 'System', value: 'auto', icon: ComputerDesktopIcon },
]

const { system, store } = useColorMode()

const myColorMode = computed(() =>
  store.value === 'auto' ? system.value : store.value
)

const currentModeIcon = computed(
  () => modes.filter(m => m.value === myColorMode.value)[0].icon
)

function handleClick(mode) {
  store.value = mode
}
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="flex items-center text-gray-500 dark:text-gray-400">
        <component
          :is="currentModeIcon"
          class="w-5 h-5 text-gray-500"
          :class="{
            '!text-blue-500': store === 'light',
          }"
        />
      </MenuButton>

      <MenuItems
        class="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white dark:bg-gray-950 shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <LNDropdownItem
            v-for="{ text, value, icon } in modes"
            @click="() => handleClick(value)"
          >
            <component :is="icon" class="flex-shrink-0 w-5 h-5" />
            {{ text }}
          </LNDropdownItem>
        </div>
      </MenuItems>
    </div>
  </Menu>
</template>
