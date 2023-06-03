<script setup lang="ts">
import docsearch from '@docsearch/js'
import '@docsearch/css'
import { computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const { theme, page } = useData()
const { algolia } = theme.value
const path = computed(() => decodeURI(page.value.relativePath).split('/')[0])

onMounted(() => {
  docsearch({
    container: '#docsearch',
    appId: algolia.appId,
    apiKey: algolia.apiKey,
    indexName: algolia.indexName,
    placeholder: algolia.placeholder,
    searchParameters: {
      facetFilters: [`version:${path.value}.0`],
    },
  })
})
</script>

<template>
  <div class="LNSearch">
    <div id="docsearch" />
  </div>
</template>
