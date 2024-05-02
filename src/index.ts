import './index.css'
import Layout from './components/Layout.vue'

import type { Theme } from 'vitepress'

const PilgrimTheme: Theme = { Layout }

export { PilgrimTheme as Theme }

export type { ThemeConfig } from './types'