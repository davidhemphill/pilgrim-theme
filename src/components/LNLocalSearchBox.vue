<script lang="ts" setup>
import localSearchIndex from '@localSearchIndex'
import {
  computedAsync,
  debouncedWatch,
  onKeyStroke,
  useEventListener,
  useScrollLock,
  useSessionStorage,
} from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import Mark from 'mark.js/src/vanilla.js'
import MiniSearch, { type SearchResult } from 'minisearch'
import { useRouter } from 'vitepress'
import {
  computed,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type Ref,
} from 'vue'
import type { ModalTranslations } from 'vitepress/types/local-search'
import { useData } from 'vitepress'
import { createTranslate } from 'vitepress/dist/client/theme-default/support/translation'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const el = shallowRef<HTMLElement>()
const resultsEl = shallowRef<HTMLElement>()
const body = shallowRef<HTMLElement>()

/* Search */

const searchIndexData = shallowRef(localSearchIndex)

// hmr
if (import.meta.hot) {
  import.meta.hot.accept('/@localSearchIndex', m => {
    if (m) {
      searchIndexData.value = m.default
    }
  })
}

interface Result {
  title: string
  titles: string[]
  text?: string
}

const vitePressData = useData()
const { activate } = useFocusTrap(el, {
  immediate: true,
  allowOutsideClick: true,
  clickOutsideDeactivates: true,
  escapeDeactivates: true,
})
const { localeIndex, theme } = vitePressData
const searchIndex = computedAsync(async () =>
  markRaw(
    MiniSearch.loadJSON<Result>(
      (await searchIndexData.value[localeIndex.value]?.())?.default,
      {
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles'],
        searchOptions: {
          fuzzy: 0.2,
          prefix: true,
          boost: { title: 4, text: 2, titles: 1 },
        },
      }
    )
  )
)

const disableQueryPersistence = computed(() => {
  return (
    theme.value.search?.provider === 'local' &&
    theme.value.search.options?.disableQueryPersistence === true
  )
})

const filterText = disableQueryPersistence.value
  ? ref('')
  : useSessionStorage('vitepress:local-search-filter', '')

const results: Ref<(SearchResult & Result)[]> = shallowRef([])

const enableNoResults = ref(false)

watch(filterText, () => {
  enableNoResults.value = false
})

const mark = computedAsync(async () => {
  if (!resultsEl.value) return
  return markRaw(new Mark(resultsEl.value))
}, null)

debouncedWatch(
  () => [searchIndex.value, filterText.value] as const,
  async ([index, filterTextValue], old, onCleanup) => {
    let canceled = false
    onCleanup(() => {
      canceled = true
    })

    if (!index) return

    // Search
    results.value = index
      .search(filterTextValue)
      .slice(0, 16) as (SearchResult & Result)[]
    enableNoResults.value = true

    // Highlighting
    const mods = []
    if (canceled) return
    const c = new Map<string, Map<string, string>>()

    const terms = new Set<string>()

    results.value = results.value.map(r => {
      const [id, anchor] = r.id.split('#')
      const map = c.get(id)
      const text = map?.get(anchor) ?? ''
      for (const term in r.match) {
        terms.add(term)
      }
      return { ...r, text }
    })

    await nextTick()
    if (canceled) return

    await new Promise(r => {
      mark.value?.unmark({
        done: () => {
          mark.value?.markRegExp(formMarkRegex(terms), { done: r })
        },
      })
    })

    const excerpts = el.value?.querySelectorAll('.result .excerpt') ?? []
    for (const excerpt of excerpts) {
      excerpt
        .querySelector('mark[data-markjs="true"]')
        ?.scrollIntoView({ block: 'center' })
    }
    // FIXME: without this whole page scrolls to the bottom
    resultsEl.value?.firstElementChild?.scrollIntoView({ block: 'start' })
  },
  { debounce: 200, immediate: true }
)

/* Search input focus */

const searchInput = ref<HTMLInputElement>()

function focusSearchInput() {
  searchInput.value?.focus()
  searchInput.value?.select()
}

onMounted(() => {
  focusSearchInput()
})

function onSearchBarClick(event: PointerEvent) {
  if (event.pointerType === 'mouse') {
    focusSearchInput()
  }
}

/* Search keyboard selection */

const selectedIndex = ref(0)
const disableMouseOver = ref(false)

watch(results, () => {
  selectedIndex.value = 0
  scrollToSelectedResult()
})

function scrollToSelectedResult() {
  nextTick(() => {
    const selectedEl = document.querySelector('.result.selected')
    if (selectedEl) {
      selectedEl.scrollIntoView({
        block: 'nearest',
      })
    }
  })
}

onKeyStroke('ArrowUp', event => {
  event.preventDefault()
  selectedIndex.value--
  if (selectedIndex.value < 0) {
    selectedIndex.value = results.value.length - 1
  }
  disableMouseOver.value = true
  scrollToSelectedResult()
})

onKeyStroke('ArrowDown', event => {
  event.preventDefault()
  selectedIndex.value++
  if (selectedIndex.value >= results.value.length) {
    selectedIndex.value = 0
  }
  disableMouseOver.value = true
  scrollToSelectedResult()
})

const router = useRouter()

onKeyStroke('Enter', () => {
  const selectedPackage = results.value[selectedIndex.value]
  if (selectedPackage) {
    router.go(selectedPackage.id)
    emit('close')
  }
})

onKeyStroke('Escape', () => {
  emit('close')
})

// Translations
const defaultTranslations: { modal: ModalTranslations } = {
  modal: {
    resetButtonTitle: 'Reset search',
    backButtonTitle: 'Close search',
    noResultsText: 'No results for',
    footer: {
      selectText: 'to select',
      selectKeyAriaLabel: 'enter',
      navigateText: 'to navigate',
      navigateUpKeyAriaLabel: 'up arrow',
      navigateDownKeyAriaLabel: 'down arrow',
      closeText: 'to close',
      closeKeyAriaLabel: 'escape',
    },
  },
}

const $t = createTranslate(theme.value.search?.options, defaultTranslations)

// Back

onMounted(() => {
  // Prevents going to previous site
  window.history.pushState(null, '', null)
})

useEventListener('popstate', event => {
  event.preventDefault()
  emit('close')
})

/** Lock body */
const isLocked = useScrollLock(body)

onMounted(() => {
  body.value = document.body
  nextTick(() => {
    isLocked.value = true
    nextTick().then(() => activate())
  })
})

onBeforeUnmount(() => {
  isLocked.value = false
})

function formMarkRegex(terms: Set<string>) {
  return new RegExp(
    [...terms]
      .sort((a, b) => b.length - a.length)
      .map(term => {
        return `(${term
          .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
          .replace(/-/g, '\\x2d')})`
      })
      .join('|'),
    'gi'
  )
}
</script>

<template>
  <Teleport to="body">
    <div ref="el" class="fixed flex z-[100] inset-0" aria-modal="true">
      <!-- Backdrop -->
      <div class="fixed inset-0 backdrop-blur" @click="$emit('close')" />

      <!-- Shell -->
      <div
        class="relative flex flex-col my-20 mx-auto p-4 bg-white dark:bg-gray-950 shadow-lg rounded-lg w-[min(100vw-60px,900px)] max-h-[min(100vh-128px,900px)] gap-3"
      >
        <div
          class="rounded-lg flex gap-2 items-center px-2 border border-gray-300 dark:border-gray-700 cursor-text"
          @pointerup="onSearchBarClick($event)"
        >
          <svg
            class="w-6 h-6 text-gray-500 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
              clip-rule="evenodd"
            />
          </svg>

          <!-- Back Button -->
          <button
            class="md:hidden w-6 h-6 text-gray-500 hover:text-primary-500 dark:text-gray-300"
            :title="$t('modal.backButtonTitle')"
            @click="$emit('close')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Search Input -->
          <input
            ref="searchInput"
            v-model="filterText"
            :placeholder="theme.search.options.placeholder"
            class="search-input w-full text-inherit py-2 focus:outline-none dark:bg-gray-950 dark:text-gray-300"
          />

          <!-- Clear Button -->
          <button
            class="w-5 h-5 text-gray-500 hover:text-primary-500 dark:text-gray-300 mr-2"
            :title="$t('modal.resetButtonTitle')"
            @click="filterText = ''"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M7.22 3.22A.75.75 0 017.75 3h9A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17h-9a.75.75 0 01-.53-.22L.97 10.53a.75.75 0 010-1.06l6.25-6.25zm3.06 4a.75.75 0 10-1.06 1.06L10.94 10l-1.72 1.72a.75.75 0 101.06 1.06L12 11.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L12 8.94l-1.72-1.72z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div
          ref="resultsEl"
          class="flex flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain"
          @mousemove="disableMouseOver = false"
        >
          <!-- Results -->
          <a
            v-for="(p, index) in results"
            :key="p.id"
            :href="p.id"
            class="result flex items-center gap-4 rounded-lg leading-tight border border-transparent focus:outline-none"
            :class="{
              'bg-primary-500 !text-white': selectedIndex === index,
            }"
            :aria-label="[...p.titles, p.title].join(' > ')"
            @mouseenter="!disableMouseOver && (selectedIndex = index)"
            @focusin="selectedIndex = index"
            @click="$emit('close')"
          >
            <div class="m-2 w-full overflow-hidden">
              <div
                class="titles relative flex flex-wrap items-center gap-1 py-1 z-[1001] text-gray-600 [&_mark]:text-black [&_mark]:font-bold [&_mark]:bg-transparent dark:[&_mark]:text-white"
                :class="{
                  '!text-white [&_mark]:text-white': selectedIndex === index,
                }"
              >
                <span
                  v-for="(t, index) in p.titles"
                  :key="index"
                  class="flex items-center gap-1"
                >
                  <span class="text" v-html="t" />
                  <svg
                    v-if="index !== p.titles.length - 1"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m9 18l6-6l-6-6"
                    />
                  </svg>
                </span>
                <span
                  class="title main text-gray-500"
                  :class="{
                    '!text-white': selectedIndex === index,
                  }"
                >
                  <span class="text" v-html="p.title" />
                </span>
              </div>
            </div>
          </a>

          <!-- No Results -->
          <div
            v-if="filterText && !results.length && enableNoResults"
            class="no-results text-center text-gray-600 py-12"
          >
            {{ $t('modal.noResultsText') }} "<strong>{{ filterText }}</strong
            >"
          </div>
        </div>

        <div
          class="sm:hidden md:flex text-sm md:items-center gap-4 leading-tight dark:text-white"
        >
          <span class="flex items-center gap-2">
            <kbd
              class="bg-gray-100 dark:bg-gray-800 rounded inline-flex items-center justify-center h-6 px-2"
              :aria-label="$t('modal.footer.navigateUpKeyAriaLabel')"
            >
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19V5m-7 7l7-7l7 7"
                />
              </svg>
            </kbd>
            <kbd
              class="bg-gray-100 dark:bg-gray-800 rounded inline-flex items-center justify-center h-6 px-2"
              :aria-label="$t('modal.footer.navigateDownKeyAriaLabel')"
            >
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v14m7-7l-7 7l-7-7"
                />
              </svg>
            </kbd>
            {{ $t('modal.footer.navigateText') }}
          </span>
          <span class="flex items-center gap-2">
            <kbd
              class="bg-gray-100 dark:bg-gray-800 rounded inline-flex items-center justify-center h-6 px-2"
              :aria-label="$t('modal.footer.selectKeyAriaLabel')"
            >
              <svg width="14" height="14" viewBox="0 0 24 24">
                <g
                  fill="none"
                  stroke="currentcolor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path d="m9 10l-5 5l5 5" />
                  <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                </g>
              </svg>
            </kbd>
            {{ $t('modal.footer.selectText') }}
          </span>
          <span class="flex items-center gap-2">
            <kbd
              class="bg-gray-100 dark:bg-gray-800 rounded inline-flex items-center justify-center h-6 px-2"
              :aria-label="$t('modal.footer.closeKeyAriaLabel')"
              >esc</kbd
            >
            {{ $t('modal.footer.closeText') }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
