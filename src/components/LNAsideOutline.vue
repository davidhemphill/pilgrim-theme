<script setup lang="ts">
import { getHeaders, useActiveAnchor } from '../composables/outline'
import { ref, shallowRef } from 'vue'
import LNAsideItem from './LNAsideItem.vue'
import type { HeadingLink } from '../types'
import { onContentUpdated } from 'vitepress'

const headers = shallowRef<HeadingLink[]>([])

onContentUpdated(() => {
  headers.value = getHeaders()
})

const container = ref()

useActiveAnchor(container)
</script>

<template>
  <div>
    <div class="aside" ref="container">
      <nav class="mt-4">
        <ul>
          <LNAsideItem :headers="headers" />
        </ul>
      </nav>
    </div>
  </div>
</template>
