<script setup lang="ts">
import LNPrevNextLink from './LNPrevNextLink.vue'
import { usePrevNext } from '../composables/prev-next'
import { withBase, useData } from 'vitepress'
import { useEditLink } from '../composables/edit-link'
import { computed } from 'vue'
const { theme } = useData()

const editLink = useEditLink()
const control = usePrevNext()

const hasEditLink = computed(() => {
  return theme.value.editLink !== false
})
</script>

<template>
  <footer class="divide-y divide-gray-200 dark:divide-gray-700">
    <!-- Prev/Next Links -->
    <div
      v-if="control.prev?.link || control.next?.link"
      class="gap-6 flex justify-between py-6"
    >
      <LNPrevNextLink
        v-if="control.prev?.link"
        :href="withBase(control.prev?.link ?? '')"
      >
        <template #preLabel>←</template>
        {{ control.prev.text }}
      </LNPrevNextLink>

      <LNPrevNextLink
        v-if="control.next?.link"
        :href="withBase(control.next?.link ?? '')"
        class="ml-auto"
      >
        <template #postLabel>→</template>
        {{ control.next.text }}
      </LNPrevNextLink>
    </div>

    <!-- Edit on GitHub Link -->
    <p class="text-center pt-6" v-if="hasEditLink">
      <a
        :href="editLink.url"
        class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
      >
        {{ editLink.text }}
      </a>
    </p>
  </footer>
</template>
