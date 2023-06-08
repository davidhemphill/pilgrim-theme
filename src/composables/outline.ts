import type { Ref } from 'vue'
import { onMounted, onUnmounted, onUpdated } from 'vue'
import { throttleAndDebounce } from '../support/utils'
import type { MenuItem } from '../config'

const PAGE_OFFSET: number = 33

export function getHeaders(range: number[] = [1, 6]): MenuItem[] {
  const headers = [...document.querySelectorAll('.PilgrimDoc h2,h3,h4,h5,h6')]
    .filter((el: Element) => el.id && el.hasChildNodes())
    .map((el: Element): MenuItem => {
      const level: number = Number(el.tagName[1])
      return {
        title: serializeHeader(el),
        link: '#' + el.id,
        level,
      }
    })

  return resolveHeaders(headers, range)
}

function serializeHeader(h: Element): string {
  let ret: string = ''
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if (
        (node as Element).classList.contains('VPBadge') ||
        (node as Element).classList.contains('header-anchor')
      ) {
        continue
      }
      ret += node.textContent
    } else if (node.nodeType === 3) {
      ret += node.textContent
    }
  }
  return ret.trim()
}

export function resolveHeaders(
  headers: MenuItem[],
  range?: false | [number, number]
): MenuItem[] {
  if (range === false) {
    return []
  }

  const levelsRange =
    (typeof range === 'object' && !Array.isArray(range)
      ? range.level
      : range) || 2

  const [high, low]: [number, number] =
    typeof levelsRange === 'number'
      ? [levelsRange, levelsRange]
      : levelsRange === 'deep'
      ? [2, 6]
      : levelsRange

  headers = headers.filter((h: MenuItem) => h.level >= high && h.level <= low)

  const ret: MenuItem[] = []

  outer: for (let i: number = 0; i < headers.length; i++) {
    const cur = headers[i]
    if (i === 0) {
      ret.push(cur)
    } else {
      for (let j: number = i - 1; j >= 0; j--) {
        const prev: MenuItem = headers[j]
        if (prev.level < cur.level) {
          ;(prev.children || (prev.children = [])).push(cur)
          continue outer
        }
      }
      ret.push(cur)
    }
  }

  return ret
}

export const HASH_RE: RegExp = /#.*$/
export const EXT_RE: RegExp = /(index)?\.(md|html)$/

export function isActive(currentPath: string, matchPath: string): boolean {
  currentPath = normalize(`/${currentPath}`)

  return normalize(matchPath) === currentPath
}

function normalize(path: string): string {
  return decodeURI(path).replace(HASH_RE, '').replace(EXT_RE, '')
}

export function useActiveAnchor(container: Ref<HTMLElement>) {
  const onScroll = throttleAndDebounce(setActiveLink, 100)

  let prevActiveLink: HTMLAnchorElement | null = null

  onMounted((): void => {
    requestAnimationFrame(setActiveLink)
    window.addEventListener('scroll', onScroll)
  })

  onUpdated((): void => {
    // sidebar update means a route change
    activateLink(location.hash)
  })

  onUnmounted((): void => {
    window.removeEventListener('scroll', onScroll)
  })

  function setActiveLink(): void {
    const links: HTMLAnchorElement[] = [].slice.call(
      container.value.querySelectorAll('.outline-link')
    ) as HTMLAnchorElement[]

    const anchors: HTMLAnchorElement[] = [].slice
      .call(document.querySelectorAll('.content .header-anchor'))
      .filter((anchor: HTMLAnchorElement) => {
        return links.some((link: HTMLAnchorElement) => {
          return link.hash === anchor.hash && anchor.offsetParent !== null
        })
      }) as HTMLAnchorElement[]

    const scrollY: number = window.scrollY
    const innerHeight: number = window.innerHeight
    const offsetHeight: number = document.body.offsetHeight
    const isBottom: boolean = Math.abs(scrollY + innerHeight - offsetHeight) < 1

    // page bottom - highlight last one
    if (anchors.length && isBottom) {
      activateLink(anchors[anchors.length - 1].hash)
      return
    }

    for (let i: number = 0; i < anchors.length; i++) {
      const anchor: HTMLAnchorElement = anchors[i]
      const nextAnchor: HTMLAnchorElement = anchors[i + 1]

      const [isActive, hash] = isAnchorActive(i, anchor, nextAnchor)

      if (isActive) {
        activateLink(hash)
        return
      }
    }
  }

  function activateLink(hash: string | null) {
    if (prevActiveLink) {
      prevActiveLink.classList.remove('!text-blue-500')
    }

    if (hash !== null) {
      prevActiveLink = container.value.querySelector(
        `a[href="${decodeURIComponent(hash)}"]`
      )
    }

    const activeLink: HTMLAnchorElement | null = prevActiveLink

    if (activeLink) {
      activeLink.classList.add('!text-blue-500')
    }
  }
}

function getAnchorTop(anchor: HTMLAnchorElement): number {
  return anchor.parentElement!.offsetTop - PAGE_OFFSET
}

function isAnchorActive(
  index: number,
  anchor: HTMLAnchorElement,
  nextAnchor: HTMLAnchorElement | undefined
): [boolean, string | null] {
  const scrollTop: number = window.scrollY

  if (index === 0 && scrollTop === 0) {
    return [true, null]
  }

  if (scrollTop < getAnchorTop(anchor)) {
    return [false, null]
  }

  if (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)) {
    return [true, anchor.hash]
  }

  return [false, null]
}
