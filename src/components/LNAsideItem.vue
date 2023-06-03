<script setup lang="ts">
import { MenuItem } from '../types'

const props = defineProps<{
  headers: MenuItem[]
}>()

function onClick({ target: el }: Event) {
  const id = '#' + (el as HTMLAnchorElement).href.split('#')[1]
  const heading = document.querySelector<HTMLAnchorElement>(
    decodeURIComponent(id)
  )
  heading?.focus()
}
</script>

<template>
  <li
    v-for="{ children, link, title } in headers"
    class="text-gray-700 dark:text-gray-500 text-sm"
  >
    <a
      @click="onClick"
      class="outline-link block py-1 dark:hover:text-gray-400"
      :href="link"
    >
      {{ title }}
    </a>

    <template v-if="children?.length">
      <li v-for="subItem in children" class="leading-normal ml-2">
        <a
          class="group py-0.5 flex items-start outline-link text-gray-700 dark:text-gray-500"
          :href="subItem.link"
        >
          <svg
            width="10"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 3 24 24"
            stroke-width="4"
            stroke="currentColor"
            class="mr-2 flex-shrink-0 text-gray-400 dark:text-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>

          <span class="dark:group-hover:text-gray-400">{{
            subItem.title
          }}</span>
        </a>
      </li>
    </template>
  </li>
</template>
