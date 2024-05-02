<script setup lang="ts">
import '@docsearch/css'
import { onKeyStroke } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import { defineAsyncComponent } from 'vue'
import LNSearchButton from './LNSearchButton.vue'
import type { AlgoliaSearchOptions } from '../types'

const LNLocalSearchBox = __VP_LOCAL_SEARCH__
  ? defineAsyncComponent(() => import('./LNLocalSearchBox.vue'))
  : () => null

const LNAlgoliaSearchBox = __ALGOLIA__
  ? defineAsyncComponent(() => import('./LNAlgoliaSearchBox.vue'))
  : () => null

const { theme, localeIndex } = useData()

// to avoid loading the docsearch js upfront (which is more than 1/3 of the
// payload), we delay initializing it until the user has actually clicked or
// hit the hotkey to invoke it.
const loaded = ref(false)
const actuallyLoaded = ref(false)

const buttonText = computed(() => {
  const options = theme.value.search?.options

  return options.placeholder || 'Search'
})

const preconnect = () => {
  const id = 'VPAlgoliaPreconnect'
  const rIC = window.requestIdleCallback || setTimeout
  rIC(() => {
    const preconnect = document.createElement('link')
    preconnect.id = id
    preconnect.rel = 'preconnect'
    preconnect.href = `https://${
      ((theme.value.search?.options as AlgoliaSearchOptions) ??
        theme.value.algolia)!.appId
    }-dsn.algolia.net`
    preconnect.crossOrigin = ''
    document.head.appendChild(preconnect)
  })
}

onMounted(() => {
  if (!__ALGOLIA__) {
    return
  }

  preconnect()

  const handleSearchHotKey = (event: KeyboardEvent) => {
    if (
      (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) ||
      (!isEditingContent(event) && event.key === '/')
    ) {
      event.preventDefault()
      load()
      remove()
    }
  }

  const remove = () => {
    window.removeEventListener('keydown', handleSearchHotKey)
  }

  window.addEventListener('keydown', handleSearchHotKey)

  onUnmounted(remove)
})

function load() {
  // if (!loaded.value) {
  loaded.value = true
  setTimeout(poll, 16)
  // }
}

function poll() {
  // programmatically open the search box after initialize
  const e = new Event('keydown') as any

  e.key = 'k'
  e.metaKey = true

  window.dispatchEvent(e)

  setTimeout(() => {
    if (!document.querySelector('.DocSearch-Modal')) {
      poll()
    }
  }, 16)
}

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement
  const tagName = element.tagName

  return (
    element.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA'
  )
}

// Local Search
const showSearch = ref(false)

if (__VP_LOCAL_SEARCH__) {
  onKeyStroke('k', event => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault()
      showSearch.value = true
    }
  })

  onKeyStroke('/', event => {
    if (!isEditingContent(event)) {
      event.preventDefault()
      showSearch.value = true
    }
  })
}

const metaKey = ref(`'Meta'`)

onMounted(() => {
  // meta key detect (same logic as in @docsearch/js)
  metaKey.value = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
    ? `'⌘'`
    : `'Ctrl'`
})

const provider = __ALGOLIA__ ? 'algolia' : __VP_LOCAL_SEARCH__ ? 'local' : ''
</script>

<template>
  <div class="sticky top-0 -ml-0.5">
    <div class="h-10 bg-gray-50 dark:bg-gray-900" />
    Hello {{ __ALGOLIA__ }} {{ __VP_LOCAL_SEARXH__ }}
    {{ provider }}
    <template v-if="provider === 'local'">
      <LNLocalSearchBox v-if="showSearch" @close="showSearch = false" />

      <div id="local-search">
        <LNSearchButton @click="showSearch = true" :placeholder="buttonText" />
      </div>
    </template>

    <template v-else-if="provider === 'algolia'">
      <div class="LNSearch">
        <LNAlgoliaSearchBox
          v-if="loaded"
          :algolia="theme.search?.options"
          @vue:beforeMount="actuallyLoaded = true"
        />
      </div>

      <!--      <div v-if="!actuallyLoaded" id="docsearch">-->
      <LNSearchButton @click="load" :placeholder="buttonText" />
      <!--      </div>-->
    </template>

    <div class="h-8 bg-gradient-to-b from-gray-50 dark:from-gray-900" />
  </div>
</template>
