<script setup lang="ts">
type SearchButtonProps = {
  placeholder?: string
}

withDefaults(defineProps<SearchButtonProps>(), {
  placeholder: 'Search',
})
</script>

<template>
  <div class="bg-white dark:bg-gray-900 relative pointer-events-auto">
    <button
      class="hidden w-full lg:flex items-center text-sm leading-6 text-gray-400 rounded-md ring-1 ring-gray-900/10 shadow-sm py-1.5 pl-2 pr-3 hover:ring-gray-300 dark:hover:ring-gray-800/10 dark:bg-gray-800 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:hover:bg-gray-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 mr-3 text-gray-400 flex-none"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <span>{{ placeholder }}</span>
      <kbd class="ml-auto pl-3 flex-none font-sans text-xs font-semibold"
        >⌘K</kbd
      >
    </button>
  </div>
</template>
