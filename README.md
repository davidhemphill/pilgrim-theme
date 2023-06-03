# Pilgrim for Vitepress

Pilgrim is a documentation theme for Vitepress.


To use this theme in your own Vitepress project

In your `.vitepress/theme/index.ts`:

```ts
import { Theme } from "pilgrim-theme";

export default Theme
```

Customize the configuration for your uses:

```ts
import { defineConfigWithTheme } from "vitepress";
import type { ThemeConfig } from 'pilgrim-theme'
import config from 'pilgrim-theme/config'

export default defineConfigWithTheme<ThemeConfig>({
  extends: config,
  title: 'Laravel Nova',
  description: 'Master Your Universe',
  base: '/docs',
  srcDir: 'src',

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
    sidebar: {
      '1.0': [
        {
            title: '',
            path: '',
            items: [
                {
                    title: '',
                    path: '1.0',
                }
            ]
        }
      ]
    },
    // algolia: {
    //   indexName: 'laravel_nova',
    //   appId: 'FGRCZANQVY',
    //   apiKey: '7c0aaf326992f08ed7bfc461a1b61ef3',
    //   placeholder: 'Search Nova Docs...',
    // },
  },
})
```

The theme configuration is of the following type:

```ts


```