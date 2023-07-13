<script setup lang="ts">
//
</script>

<template>
  <button
    @click="showSearch = true"
    class="w-full bg-white flex items-center justify-between pl-2 pr-4 rounded-lg border h-9"
  >
    <div class="flex items-center gap-2 text-sm text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 text-gray-400"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <span>Search</span>
    </div>
    <kbd class="">⌘K</kbd>
  </button>
</template>
