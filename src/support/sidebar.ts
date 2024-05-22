import type { SidebarItem, SidebarLink } from '../types'

export function getFlatSideBarLinks(sidebarGroups: SidebarItem[]): SidebarLink[] {
  let links: SidebarLink[] = []

  for (const { items } of sidebarGroups) {
    items.forEach(value => {
      links.push(value)
    })
  }

  return links
}
