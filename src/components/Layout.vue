<script setup lang="ts">
import { useData } from 'vitepress'
import LNPage from './LNPage.vue'
import LNSidebar from './LNSidebar.vue'
import LNHeader from './LNHeader.vue'
import LNSearch from './LNSearch.vue'

const { page } = useData()
</script>

<template>
  <LNHeader>
    <template #logo>
      <slot name="logo" />
    </template>
  </LNHeader>
  <div class="relative">
    <slot name="background" />
    <div class="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8">
      <div
        class="hidden lg:block fixed z-20 inset-0 w-[19.5rem] top-[3.3rem] left-[max(0px,calc(50%-45rem))] right-auto px-8 pb-10 overflow-y-auto"
      >
        <!-- Search -->
        <LNSearch />

        <!-- Desktop Sidebar -->
        <div class="sidebar">
          <LNSidebar />
        </div>
      </div>
      <div class="lg:pl-[19.5rem]">
        <div
          class="antialiased max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0 xl:mr-[15.5rem] xl:pr-16 pb-24"
        >
          <div v-if="page.isNotFound">404</div>
          <LNPage v-else />
        </div>
      </div>
    </div>
  </div>
</template>
