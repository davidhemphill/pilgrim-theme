<script setup lang="ts">
import { useThemeSwitching } from '../support/theme'

const { modes, currentMode, currentModeLabel, handleChange } =
  useThemeSwitching()
</script>

<template>
  <div class="flex items-center gap-6">
    <div class="flex-shrink-0 text-gray-600 dark:text-gray-400">
      Choose Theme
    </div>
    <div
      class="relative flex items-center ring-1 ring-slate-900/10 rounded-lg shadow-sm p-1.5 px-3 text-slate-700 font-semibold dark:bg-slate-600 dark:ring-0 dark:highlight-white/5 dark:text-slate-200">
      <component v-for="{ value, icon } in modes" :is="icon" class="w-5 h-5 text-gray-500 mr-2" :class="{
        hidden: value !== currentMode,
        '!text-primary-500': currentMode === 'light',
      }" />
      <span>
        {{ currentModeLabel }}
      </span>
      <svg class="w-6 h-6 ml-2 text-slate-400" fill="none">
        <path d="m15 11-3 3-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        </path>
      </svg><select @change="event => handleChange(event.target.value)" :value="currentMode" id="theme"
        class="absolute appearance-none inset-0 w-full h-full opacity-0">
        <option v-for="{ text, value } in modes" :value="value">
          {{ text }}
        </option>
      </select>
    </div>
  </div>
</template>
