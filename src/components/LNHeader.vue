<script setup lang="ts">
import LNLogo from './LNLogo.vue'
import LNVersionPicker from './LNVersionPicker.vue'
import LNThemeSwitcher from './LNThemeSwitcher.vue'
import LNSidebar from './LNSidebar.vue'
import {
  Bars3Icon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import {
  breakpointsTailwind,
  useBreakpoints,
  useEventListener,
} from '@vueuse/core'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { onContentUpdated, useData } from 'vitepress'
import { computed, ref } from 'vue'

const { site, theme } = useData()

onContentUpdated(() => {
  setIsOpen(false)
})
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanSm = breakpoints.greater('md')

useEventListener('resize', () => {
  if (largerThanSm.value) {
    setIsOpen(false)
  }
})

function openSearch() {
  window.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'k', metaKey: true })
  )
}

const githubUrl = computed(() => theme.value.githubUrl)

const navItems = computed(() => site.value.themeConfig.nav)
const shouldShowVersionPicker = computed(
  () => theme.value.showVersionPicker && theme.value.versions.length > 1
)

const isOpen = ref(false)

function setIsOpen(value: boolean) {
  isOpen.value = value
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full h-[3.3rem] flex-none">
    <div class="max-w-[90rem] px-4 sm:px-6 md:px-8 mx-auto h-[3.3rem]">
      <div class="flex items-center h-[3.3rem] gap-4">
        <button
          type="button"
          @click="setIsOpen(true)"
          class="md:hidden text-gray-600 dark:text-gray-400"
        >
          <span class="sr-only">Navigation</span>
          <Bars3Icon class="flex-shrink-0 w-6" />
        </button>

        <Dialog :open="isOpen" @close="setIsOpen" class="relative z-50">
          <div
            class="fixed inset-0 bg-white/25 dark:bg-gray-800/30 backdrop-blur"
            aria-hidden="true"
          />

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full">
              <DialogPanel
                class="bg-white dark:bg-gray-900 shadow p-6 w-[230px]"
              >
                <LNSidebar />
              </DialogPanel>
            </div>
          </div>
        </Dialog>

        <slot name="logo">
          <LNLogo
            class="flex-shrink-0 h-[24px] text-gray-500 dark:text-white"
            :alt="site.title"
          />
        </slot>

        <LNVersionPicker v-if="shouldShowVersionPicker" />

        <div
          class="ml-auto md:flex items-center md:divide-x md:divide-gray-200 md:dark:divide-gray-700"
        >
          <div class="hidden md:flex items-center gap-12 px-6">
            <a
              v-for="{ text, link } in navItems"
              :href="link"
              class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500"
            >
              {{ text }}
            </a>
          </div>

          <div class="hidden md:flex md:items-center gap-6 pl-6">
            <LNThemeSwitcher />

            <a
              v-if="githubUrl"
              :href="githubUrl"
              class="text-gray-500 dark:text-gray-400"
            >
              <svg
                class="w-5 fill-current"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>
            </a>
          </div>

          <div class="flex items-center gap-3 pl-6">
            <button
              type="button"
              @click="openSearch"
              class="md:hidden flex-shrink-0 text-gray-600 dark:text-gray-400"
            >
              <span class="sr-only">Search</span>
              <MagnifyingGlassIcon class="w-6" />
            </button>

            <button
              type="button"
              class="md:hidden flex-shrink-0 text-gray-600 dark:text-gray-400"
            >
              <span class="sr-only">More</span>
              <EllipsisVerticalIcon class="w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
