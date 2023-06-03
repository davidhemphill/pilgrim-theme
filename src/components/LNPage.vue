<script setup lang="ts">
import LNAsideOutline from './LNAsideOutline.vue'
import { useData } from 'vitepress'
import { computed } from 'vue'
const { page } = useData()

const shouldShowOutline = computed(() => {
  return page.value.frontmatter.hasOwnProperty('outline')
    ? page.value.frontmatter.outline
    : true
})
</script>

<template>
  <div class="antialiased max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0 xl:mr-[15.5rem] xl:pr-16 pb-24">
    <!-- Content -->
    <div
      class="PilgrimDoc max-w-none content prose dark:prose-invert prose-headings:font-normal prose-h1:text-3xl prose-h2:mb-3 prose-ul:list-none prose-ul:px-0 prose-li:pl-6 prose-img:rounded-lg prose-img:shadow prose-pre:bg-inherit prose-pre:p-6 prose-a:font-bold prose-a:no-underline prose-a:border-b prose-a:hover:border-b-2 prose-a:border-blue-500/50">
      <Content />
    </div>

    <!-- TOC -->
    <div
      class="fixed z-20 top-[3.3rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 overflow-y-auto hidden xl:block">
      <div v-if="shouldShowOutline" class="px-8">
        <h2 class="aside-header font-bold text-sm text-gray-600 dark:text-gray-400">
          On this page
        </h2>
        <LNAsideOutline />
      </div>
    </div>
  </div>
</template>
