import { useData } from 'vitepress'
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { isActive } from './outline'
import type { SidebarLink } from '../config'

export function useSidebarControl(item: ComputedRef<SidebarLink>) {
  const { page, site } = useData()

  const isActiveLink = computed(() => {
    return isActive(
      site.value.base.replace('/', '') + page.value.relativePath,
      item.value.link
    )
  })

  return {
    isActiveLink,
  }
}
