<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import LNPage from './LNPage.vue'
import LNLogo from './LNLogo.vue'
import { computed } from 'vue'
import LNSidebarItem from './LNSidebarItem.vue'
import LNAlgoliaSearchBox from './LNAlgoliaSearchBox.vue'
import LNVersionPicker from './LNVersionPicker.vue'
import LNThemeSwitcher from './LNThemeSwitcher.vue'

const { site, theme, page } = useData()
const githubUrl = computed(() => theme.value.githubUrl)
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

const navItems = computed(() => site.value.themeConfig.nav)
const shouldShowVersionPicker = computed(
  () => theme.value.showVersionPicker && theme.value.versions.length > 1
)
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full backdrop-blur h-[3.3rem] bg-white/80 dark:bg-gray-800 flex-none border-b dark:border-gray-700"
  >
    <div class="max-w-[90rem] px-4 sm:px-6 md:px-8 mx-auto h-[3.3rem]">
      <div class="flex items-center h-[3.3rem]">
        <LNLogo
          class="h-[24px] text-gray-500 dark:text-white"
          :alt="site.title"
        />

        <div v-if="shouldShowVersionPicker" class="ml-6">
          <LNVersionPicker />
        </div>

        <div
          class="ml-auto flex items-center gap-6 divide-x divide-gray-200 dark:divide-gray-700"
        >
          <div class="flex items-center gap-12">
            <a
              v-for="{ text, link } in navItems"
              :href="link"
              class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500"
            >
              {{ text }}
            </a>
          </div>

          <div class="flex items-center gap-6 pl-6">
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
        </div>
      </div>
    </div>
  </header>
  <div>
    <div class="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8">
      <div
        class="hidden lg:block fixed z-20 inset-0 w-[19.5rem] top-[3.3rem] left-[max(0px,calc(50%-45rem))] right-auto px-8 pb-10 overflow-y-auto"
      >
        <div class="sticky top-0 -ml-0.5">
          <div class="h-10 bg-gray-50 dark:bg-gray-900" />
          <LNAlgoliaSearchBox />
          <div class="h-8 bg-gradient-to-b from-gray-50 dark:from-gray-900" />
        </div>

        <div class="sidebar">
          <nav class="flex flex-col gap-6">
            <div v-for="{ text, link, items } in sidebarItems">
              <a
                :href="link"
                class="text-gray-700 dark:text-gray-400 font-bold text-sm"
              >
                {{ text }}
              </a>

              <div v-if="items?.length" class="mt-2">
                <LNSidebarItem v-for="subItem in items" :item="subItem" />
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div class="lg:pl-[19.5rem]">
        <div v-if="page.isNotFound">Custom 404 page!</div>
        <LNPage />
      </div>
    </div>
  </div>
</template>
