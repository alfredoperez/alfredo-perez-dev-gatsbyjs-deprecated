import { SiteConfig } from './types'

const defaultOptions = {
  websiteData: {
    basePath: '/',
    digitalGardenPath: '/digital-garden',
    notesSourcePath: 'node_modules/alfredos-obsidian-vault/notes',
    notesUrlPrefix: '/notes/',
    mocsUrlPrefix: '/mocs/',
    tagsUrlPrefix: '/tags',
    externalLinks: [
      {
        name: 'Twitter',
        url: 'https://twitter.com/alfrodo_perez',
      },
      {
        name: 'GitHub',
        url: 'https://github.com/alfredoperez',
      },
    ],
    navigation: [
      {
        title: 'Digital Garden',
        slug: '/digital-garden',
      },
      {
        title: 'About',
        slug: '/notes/how-this-works',
      },
    ],
    showLineNumbers: true,
    showCopyButton: true,
    formatString: 'DD/MM/YYYY',
  },
  siteMetadata: {
    siteTitle: 'Alfredo Perez',
    siteTitleAlt: 'Alfredo Perez - Digital Garden',
    feedTitle: 'Alfredo Perez - Digital Garden',
    siteHeadline: 'This is a beautiful digital garden',
    siteUrl: 'https://alfredo-perez.dev',
    siteDescription: 'Digital garden where ideas can flourish',
    siteLanguage: 'en',
    siteImage: '/logo.png',
    author: '@alfredo-perez',
  },
} as SiteConfig
export default defaultOptions
