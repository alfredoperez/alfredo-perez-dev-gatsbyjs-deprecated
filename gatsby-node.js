const kebabCase = require(`lodash.kebabcase`)
const options = require(`./utils/default-options`)

const mdxResolverPassthrough = (fieldName) => async (source, args, context, info) => {
  const type = info.schema.getType(`Mdx`)
  const mdxNode = context.nodeModel.getNodeById({
    id: source.parent,
  })
  const resolver = type.getFields()[fieldName].resolve
  const result = await resolver(mdxNode, args, context, {
    fieldName,
  })
  return result
}

// Create general interfaces that you could can use to leverage other data sources
// The core theme sets up MDX as a type for the general interface
exports.createSchemaCustomization = ({ actions, schema }) => {
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
        resolve: mdxResolverPassthrough(fieldName),
      }
    },
  })

  createTypes(`
     interface Note implements Node {
      id: ID!
      slug: String! @slugify
      title: String!
      created: Date! @dateformat
      updated: Date! @dateformat
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
    }
    
     type NoteTag {
      name: String
      slug: String
    }

   
    interface Page implements Node {
      id: ID!
      slug: String!
      title: String!
      excerpt(pruneLength: Int = 160): String!
      body: String!
    }

     type MdxNote implements Node & Note {
      slug: String! @slugify
      title: String!
      created: Date! @dateformat
      updated: Date! @dateformat
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
    }
    
    type MdxPage implements Node & Page {
      slug: String!
      title: String!
      excerpt(pruneLength: Int = 140): String! @mdxpassthrough(fieldName: "excerpt")
      body: String! @mdxpassthrough(fieldName: "body")
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

exports.sourceNodes = ({ actions, createContentDigest }) => {
  const { createNode } = actions
  const {
    basePath,
    digitalGardenPath,
    notesPath,
    pagesPath,
    tagsPath,
    externalLinks,
    navigation,
    showLineNumbers,
    showCopyButton,
  } = options

  const config = {
    basePath,
    pagesPath,
    digitalGardenPath,
    notesPath,
    tagsPath,
    externalLinks,
    navigation,
    showLineNumbers,
    showCopyButton,
  }

  createNode({
    ...config,
    id: `blog-config`,
    parent: null,
    children: [],
    internal: {
      type: `BlogConfig`,
      contentDigest: createContentDigest(config),
      content: JSON.stringify(config),
      description: `Options for the blog`,
    },
  })
}

const processTags = (tags) => {
  let results = null
  if (!tags) {
    return results
  }

  results = tags.map((tag) => ({
    name: tag,
    slug: kebabCase(tag),
  }))

  return results
}

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
  const { createNode, createParentChildLink, createNodeField } = actions
  const { postsPath, pagesPath, notesPath } = options

  // Make sure that it's an MDX node
  if (node.internal.type !== `Mdx`) {
    return
  }

  // Create a source field
  // And grab the sourceInstanceName to differentiate the different sources
  // In this case "postsPath" and "pagesPath"
  const fileNode = getNode(node.parent)
  const source = fileNode.sourceInstanceName

  // Check for "notes" and create the "Note" type
  if (node.internal.type === `Mdx` && source === notesPath) {
    const tags = processTags(node.frontmatter.tags)

    const {
      title,
      slug,
      type,
      status,
      description,
      canonicalUrl,
      created,
      updated,
    } = node.frontmatter

    const fieldData = {
      slug,
      title: title.replace(/_/g, ''),
      created,
      updated,
      tags,
      slug,
      type,
      status,
      description,
      canonicalUrl,
    }

    const mdxNoteId = createNodeId(`${node.id} >>> MdxNote`)

    createNode({
      ...fieldData,
      // Required fields
      id: mdxNoteId,
      parent: node.id,
      children: [],
      internal: {
        type: `MdxNote`,
        contentDigest: createContentDigest(fieldData),
        content: JSON.stringify(fieldData),
        description: `Mdx implementation of the Note interface`,
      },
    })

    createNodeField({
      name: 'status',
      node,
      value: fieldData.status,
    })

    createNodeField({
      name: 'type',
      node,
      value: fieldData.type,
    })

    createParentChildLink({ parent: node, child: getNode(mdxNoteId) })
  }
  // Check for "pages" and create the "Page" type
  if (node.internal.type === `Mdx` && source === pagesPath) {
    const fieldData = {
      title: node.frontmatter.title,
      slug: node.frontmatter.slug,
    }

    const mdxPageId = createNodeId(`${node.id} >>> MdxPage`)

    createNode({
      ...fieldData,
      // Required fields
      id: mdxPageId,
      parent: node.id,
      children: [],
      internal: {
        type: `MdxPage`,
        contentDigest: createContentDigest(fieldData),
        content: JSON.stringify(fieldData),
        description: `Mdx implementation of the Page interface`,
      },
    })

    createParentChildLink({ parent: node, child: getNode(mdxPageId) })
  }
}

// These template are only data-fetching wrappers that import components
const homepageTemplate = require.resolve(`./src/templates/homepage-query.tsx`)
const pageTemplate = require.resolve(`./src/templates/page-query.tsx`)
const tagTemplate = require.resolve(`./src/templates/tag-query.tsx`)
const tagsTemplate = require.resolve(`./src/templates/tags-query.tsx`)
const noteTemplate = require.resolve(`./src/templates/note-query.tsx`)
const mocTemplate = require.resolve(`./src/templates/note-query.tsx`)
const digitalGardenTemplate = require.resolve(`./src/templates/digital-garden-query.tsx`)

exports.createPages = async ({ actions, graphql, reporter }, themeOptions) => {
  const { createPage } = actions

  const { basePath, tagsPath, formatString, notesPrefix, mocsPrefix, digitalGardenPath } = options

  createPage({
    path: basePath,
    component: homepageTemplate,
    context: {
      formatString,
    },
  })

  createPage({
    path: `/${basePath}/${tagsPath}`.replace(/\/\/+/g, `/`),
    component: tagsTemplate,
  })

  createPage({
    path: `/${basePath}/${digitalGardenPath}`.replace(/\/\/+/g, `/`),
    component: digitalGardenTemplate,
    context: {
      formatString,
    },
  })

  const result = await graphql(`
    query {
      allPage {
        nodes {
          slug
        }
      }
      tags: allNote(sort: { fields: tags___name, order: DESC }) {
        group(field: tags___name) {
          fieldValue
        }
      }
      allNote: allNote(filter: { type: { eq: "note" } }, sort: { order: DESC, fields: created }) {
        nodes {
          slug
          title
          status
        }
      }
      notesQuery: allNote(
        filter: { type: { eq: "note" } }
        sort: { order: DESC, fields: created }
      ) {
        nodes {
          slug
          title
          status
        }
      }
      allMoc: allNote(filter: { type: { eq: "moc" } }, sort: { order: DESC, fields: created }) {
        nodes {
          slug
          title
          status
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your posts or pages`, result.errors)
    return
  }

  const notes = result.data.allNote.nodes

  notes.forEach((note) => {
    createPage({
      path: `/${notesPrefix}${note.slug}`.replace(/\/\/+/g, `/`),
      component: noteTemplate,
      context: {
        slug: note.slug,
        formatString,
      },
    })
  })

  const pages = result.data.allPage.nodes

  if (pages.length > 0) {
    pages.forEach((page) => {
      createPage({
        path: `/${basePath}/${page.slug}`.replace(/\/\/+/g, `/`),
        component: pageTemplate,
        context: {
          slug: page.slug,
        },
      })
    })
  }

  const tags = result.data.tags.group

  if (tags.length > 0) {
    tags.forEach((tag) => {
      const path = `/${basePath}/${tagsPath}/${kebabCase(tag.fieldValue)}`.replace(/\/\/+/g, `/`)

      createPage({
        path,
        component: tagTemplate,
        context: {
          slug: kebabCase(tag.fieldValue),
          name: tag.fieldValue,
          formatString,
        },
      })
    })
  }

  const mocs = result.data.allMoc.nodes

  mocs.forEach((moc) => {
    createPage({
      path: `${mocsPrefix}${moc.slug}`.replace(/\/\/+/g, `/`),
      component: mocTemplate,
      context: {
        slug: moc.slug,
        formatString,
      },
    })
  })
}
