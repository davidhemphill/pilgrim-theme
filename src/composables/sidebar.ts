import { useData } from 'vitepress'
import { computed } from 'vue'
import { isActive } from './outline'

export function useSidebarControl(item) {
  const { page, site } = useData()

  const isActiveLink = computed(() => {
    return isActive(site.value.base + page.value.relativePath, item.value.link)
  })

  return {
    isActiveLink,
  }
}
