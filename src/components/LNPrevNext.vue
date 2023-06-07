<script setup lang="ts">
import LNPrevNextLink from './LNPrevNextLink.vue'

import { usePrevNext } from '../composables/prev-next'
import { computed } from 'vue'
import { withBase } from 'vitepress'

const control = usePrevNext()
</script>

<template>
  <div
    v-if="control.prev?.link || control.next?.link"
    class="gap-6 flex justify-between"
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
      class="md:ml-auto"
    >
      <template #postLabel>→</template>
      {{ control.next.text }}
    </LNPrevNextLink>
  </div>
</template>
