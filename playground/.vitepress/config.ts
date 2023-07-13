import { defineConfigWithTheme } from 'vitepress'
import { ThemeConfig } from '../../src'
import config from '../../src/baseConfig'

export default defineConfigWithTheme<ThemeConfig>({
  extends: config,

  title: 'Laravel Nova',
  description: 'Master Your Universe',
  base: '/docs/4.0/',

  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo-dark.svg',
    },
    nav: [
      { text: 'Docs', link: 'https://nova.laravel.com/docs' },
      { text: 'Releases', link: 'https://nova.laravel.com' },
      { text: 'Course', link: 'https://laracasts.com/' },
    ],
    githubUrl: 'https://github.com/laravel/nova-issues',
    editLink: {
      pattern:
        'https://github.com/davidhemphill/pilgrim-theme/edit/main/playground/:path',
      text: 'Edit this page on GitHub',
    },
    showVersionPicker: true,
    versions: [
      {
        text: 'v4.0',
        link: 'https://nova.laravel.com/docs/4.0',
        current: true,
      },
      { text: 'v2.0', link: '/docs/2.0' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Installation', link: '/installation' },
          { text: 'Prev/Next Test', link: '/short' },
        ],
      },
      {
        text: 'About',
        items: [{ text: 'Upgrade Guide', link: '/upgrade' }],
      },
    ],
    search: {
      // Local version...
      provider: 'local',
      options: {
        placeholder: 'Search the Nova docs...',
      },

      // Algolia version...
      // provider: 'algolia',
      // options: {
      //   placeholder: 'Search the Nova docs...',
      //   indexName: 'laravel_nova',
      //   appId: 'FGRCZANQVY',
      //   apiKey: '7c0aaf326992f08ed7bfc461a1b61ef3',
      // },
    },
  },
})
