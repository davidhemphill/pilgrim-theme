import type { PageData } from 'vitepress'

export interface ThemeConfig {
  logo: ThemeableImage
  nav?: NavLink[]
  versions?: Version[]
  editLink?: EditLink
  sidebar?: SidebarItem[]
  search:
    | { provider: 'local'; options?: SearchOptions }
    | { provider: 'algolia'; options?: AlgoliaSearchOptions }
  githubUrl?: string
}

export interface EditLink {
  pattern: string | ((payload: PageData) => string)
  text?: string
}

export interface SearchOptions {
  placeholder?: string
}

export interface AlgoliaSearchOptions {
  appId?: string
  apiKey: string
  indexName: string
  placeholder?: string
}

export type SidebarItem = {
  text: string
  items: SidebarLink[]
}

export type SidebarLink = {
  text: string
  link: string
}

export type NavLink = {
  text: string
  link: string
}

export type Version = {
  text: string
  link: string
  current?: boolean
}

export interface ThemeableImage {
  light: string
  dark?: string
}

export type HeadingLink = {
  level: number
  title: string
  link: string
  children?: HeadingLink[]
}
