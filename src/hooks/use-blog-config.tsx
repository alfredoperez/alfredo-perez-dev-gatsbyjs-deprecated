import { graphql, useStaticQuery } from 'gatsby'
import { BlogConfig } from '../models/blog-config.model'

type BlogConfigProps = {
  blogConfig: BlogConfig
}

export const useBlogConfig = () => {
  const data = useStaticQuery<BlogConfigProps>(graphql`
    query {
      blogConfig {
        basePath
        pagesPath
        digitalGardenPath
        notesPath
        tagsPath
        externalLinks {
          name
          url
        }
        navigation {
          title
          slug
        }
        showLineNumbers
        showCopyButton
      }
    }
  `)

  return data.blogConfig
}
