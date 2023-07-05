<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import LNDropdownItem from './LNDropdownItem.vue'
import { useThemeSwitching } from '../support/theme'

const { modes, currentMode, currentModeIcon, handleClick } = useThemeSwitching()
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="flex items-center text-gray-500 dark:text-gray-400">
        <component :is="currentModeIcon" class="w-5 h-5 text-gray-500" :class="{
          '!text-primary-500': currentMode === 'light',
        }" />
      </MenuButton>

      <MenuItems
        class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white dark:bg-gray-950 shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-5 focus:outline-none">
        <div class="py-1">
          <LNDropdownItem v-for="{ text, value, icon } in modes" @click="() => handleClick(value)"
            :class="{ '!text-primary-500': value === currentMode }">
            <component {{value}} :is="icon" class="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-600"
              :class="{ '!text-primary-500': value === currentMode }" />
            {{ text }}
          </LNDropdownItem>
        </div>
      </MenuItems>
    </div>
  </Menu>
</template>
