export interface ThemeConfig {
  logo: ThemeableImage
  nav?: NavLink[]
  versions: Version[]
  showVersionPicker: boolean
  sidebar?: SidebarSectionConfig[]
  algolia?: AlgoliaSearchOptions
  githubUrl?: string
}

export interface AlgoliaSearchOptions {
  appId?: string
  apiKey: string
  indexName: string
  placeholder?: string
}

export type SidebarItem = {
  text: string
  link: string
}

export type SidebarSectionConfig = {
  text: string
  link: string
  items?: SidebarItem[]
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

export type MenuItem = {
  level: number
  title: string
  link: string
  children?: MenuItem[]
}
