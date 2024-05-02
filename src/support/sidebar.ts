import type { SidebarItem, SidebarLink } from '../types'

export function getFlatSideBarLinks(sidebar: SidebarItem[]): SidebarLink[] {
  let links: SidebarLink[] = []

  for (const group of sidebar) {
    for (const item of group.items) {
      links.push(item)
    }
  }

  return links
}
