import { computed } from 'vue'
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress/theme'
import { getFlatSideBarLinks } from '../support/sidebar'
import { isActive } from './outline'
import type { SidebarLink } from '../types'

export function usePrevNext() {
  const { page } = useData()
  const { sidebarGroups } = useSidebar()

  return computed(() => {
    const candidates = getFlatSideBarLinks(sidebarGroups.value)

    const index = candidates.findIndex(function (link: SidebarLink) {
      return isActive(page.value.relativePath, link.link)
    })

    return {
      prev: {
        text: candidates[index - 1]?.text,
        link: candidates[index - 1]?.link,
      },
      next: {
        text: candidates[index + 1]?.text,
        link: candidates[index + 1]?.link,
      },
    } as {
      prev?: { text?: string; link?: string }
      next?: { text?: string; link?: string }
    }
  })
}
