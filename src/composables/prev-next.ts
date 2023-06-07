import { computed } from 'vue'
import { useData } from 'vitepress'
import { getFlatSideBarLinks } from '../support/sidebar'
import { isActive } from './outline'
import type { NavLink, SidebarLink } from '../config'

export function usePrevNext() {
  const { page, theme, frontmatter } = useData()

  return computed(() => {
    const sidebar = theme.value.sidebar

    const candidates = getFlatSideBarLinks(sidebar)

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
