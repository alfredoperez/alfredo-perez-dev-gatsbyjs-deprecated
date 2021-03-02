export interface BlogConfig {
  basePath: string
  pagesPath: string
  digitalGardenPath: string
  notesPath: string
  tagsPath: string
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
