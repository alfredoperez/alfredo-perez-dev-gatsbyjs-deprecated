export interface WebsiteData {
  basePath: string
  digitalGardenPath: string
  notesSourcePath: string
  notesUrlPrefix: string
  mocsUrlPrefix: string
  tagsUrlPrefix: string
  externalLinks: {
    name: string
    url: string
  }[]
  navigation: {
    title: string
    slug: string
  }[]
  showLineNumbers: boolean
  showCopyButton: boolean
}

export interface SiteConfig {
  websiteData: WebsiteData
  siteMetadata: SiteMetadata
}

export interface SiteMetadata {
  siteTitle: string
  siteTitleAlt: string
  feedTitle: string
  siteHeadline: string
  siteUrl: string
  siteDescription: string
  siteLanguage: string
  siteImage: string
  author: string
}
