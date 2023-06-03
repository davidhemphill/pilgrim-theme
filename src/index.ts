import './index.css'
import Layout from './components/Layout.vue'
import type { Theme } from 'vitepress'

const LNTheme: Theme = { Layout }

export { LNTheme as Theme }

export type { ThemeConfig } from './config'
