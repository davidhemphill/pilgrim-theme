export function getFlatSideBarLinks(sidebar) {
  const links = []

  for (const item of sidebar) {
    if (item.link) {
      links.push(item)
    }

    if (item.items) {
      links.push(...getFlatSideBarLinks(item.items))
    }
  }

  return links
}
