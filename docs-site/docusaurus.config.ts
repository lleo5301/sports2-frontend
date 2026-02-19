import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Sports2 User Guide',
  tagline: 'Collegiate baseball scouting and team management',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.sports2.com',
  baseUrl: '/',

  organizationName: 'sports2',
  projectName: 'sports2-frontend',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/sports2-social-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Sports2',
      logo: {
        alt: 'Sports2 Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'User Guide',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Getting Started',
          items: [
            {label: 'Overview', to: '/docs/getting-started/overview'},
            {label: 'Logging in', to: '/docs/getting-started/login'},
            {label: 'Dashboard', to: '/docs/getting-started/your-dashboard'},
          ],
        },
        {
          title: 'Reference',
          items: [
            {label: 'Roles & permissions', to: '/docs/reference/roles-permissions'},
            {label: 'FAQ', to: '/docs/reference/faq'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sports2. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
