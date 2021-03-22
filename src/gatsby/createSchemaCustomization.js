const options = require(`./default-options`)
const kebabCase = require(`lodash.kebabcase`)

// Create general interfaces that you could can use to leverage other data sources
// The core theme sets up MDX as a type for the general interface
module.exports = ({ actions }) => {
  const { createTypes, createFieldExtension } = actions

  const { basePath } = options

  const slugify = (source) => {
    const slug = source.slug ? source.slug : kebabCase(source.title)

    return `/${basePath}/${slug}`.replace(/\/\/+/g, `/`)
  }

  createFieldExtension({
    name: `slugify`,
    extend() {
      return {
        resolve: slugify,
      }
    },
  })

  createFieldExtension({
    name: `mdxpassthrough`,
    args: {
      fieldName: `String!`,
    },
    extend({ fieldName }) {
      return {
        resolve: mdxResolverPasstrough(fieldName),
      }
    },
  })

  createTypes(`
     interface Note implements Node {
      id: ID!
      slug: String! @slugify
      title: String!
      created: Date! @dateformat
      updated: Date @dateformat
      excerpt(pruneLength: Int = 160): String!
      body: String!
      html: String
      timeToRead: Int
      tags: [NoteTag]
      banner: File @fileByRelativePath
      description: String
      canonicalUrl: String
      status: String
      type: String
      inboundReferences: [InboundReference]
    }
    
     type NoteTag {
      name: String
      slug: String
    }
    
    type InboundReference {
      id: String
      slug: String
    }
   
   type MdxNote implements Node & Note {
    slug: String! @slugify
    title: String!
    created: Date! @dateformat
    updated: Date @dateformat
    excerpt(pruneLength: Int = 140): String! @mdxpassthrough(fieldName: "excerpt")
    body: String! @mdxpassthrough(fieldName: "body")
    html: String! @mdxpassthrough(fieldName: "html")
    timeToRead: Int @mdxpassthrough(fieldName: "timeToRead")
    tags: [NoteTag]
    banner: File @fileByRelativePath
    status: String
    type: String
    description: String
    canonicalUrl: String
    inboundReferences: [InboundReference]  @mdxpassthrough(fieldName: "inboundReferences")
  }
    
    
    
    
    type BlogConfig implements Node {
      basePath: String
      digitalGardenPath: String
      notesPath: String
      pagesPath: String
      tagsPath: String
      externalLinks: [ExternalLink]
      navigation: [NavigationEntry]
      showLineNumbers: Boolean
      showCopyButton: Boolean
    }

    type ExternalLink {
      name: String!
      url: String!
    }

    type NavigationEntry {
      title: String!
      slug: String!
    }
  `)
}
