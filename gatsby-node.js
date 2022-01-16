const kebabCase = require(`lodash.kebabcase`)

const options = {
  basePath: '/',
  postsPrefix: `/`,
  digitalGardenPath: `/digital-garden`,
  notesPath: `node_modules/obsidian-pkm/notes`,
  notesPrefix: `/notes/`,
  mocsPrefix: `/notes/`,
  // pagesPath: `content/pages`,
  tagsPath: `/tags`,
  externalLinks: [
    {
      name: `Twitter`,
      url: `https://twitter.com/alfrodo_perez`,
    },
    {
      name: `GitHub`,
      url: `https://github.com/alfredoperez`,
    },
  ],
  navigation: [
    {
      title: `Digital Garden`,
      slug: `/digital-garden`,
    },
    {
      title: `About`,
      slug: `/notes/how-this-works`,
    },
  ],
  showLineNumbers: true,
  showCopyButton: true,
  formatString: `DD/MM/YYYY`,
}
// These template are only data-fetching wrappers that import components_deprecated
const homepageTemplate = require.resolve(`./src/templates/HomePage.Query.tsx`)
const tagTemplate = require.resolve(`./src/templates/TagPage.Query.tsx`)
const tagsTemplate = require.resolve(`./src/templates/TagsPage.Query.tsx`)
const noteTemplate = require.resolve(`./src/templates/NotePage.Query.tsx`)
const mocTemplate = require.resolve(`./src/templates/MocPage.Query.tsx`)
const digitalGardenTemplate = require.resolve(`./src/templates/DigitalGardenPage.Query.tsx`)

exports.createPages = async ({ actions, graphql, reporter }) => {
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
  })

  const result = await graphql(`
    query {
      tags: allNote(sort: { fields: tags___name, order: DESC }) {
        group(field: tags___name) {
          fieldValue
        }
      }
      allNote: allNote(filter: { type: { ne: "moc" } }, sort: { order: DESC, fields: created }) {
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

exports.sourceNodes = ({ actions, createContentDigest }) => {
  const { createNode } = actions

  createNode({
    ...options,
    id: `blog-config`,
    parent: null,
    children: [],
    internal: {
      type: `BlogConfig`,
      contentDigest: createContentDigest(options),
      content: JSON.stringify(options),
      description: `Options for the blog`,
    },
  })
}

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
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
  const { createNode, createParentChildLink, createNodeField } = actions
  const { notesPath } = options

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
  if (
    node.internal.type === `Mdx` &&
    source === notesPath &&
    // Makes sure to not include any note from the folders that include `00 - `
    // These folders are used for obsidian templates
    !fileNode.relativePath.includes('00 - ')
  ) {
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
      title: title ? title.replace(/_/g, '') : '',
      created,
      updated,
      tags,
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
}

// Create general interfaces that you could can use to leverage other data sources
// The core theme sets up MDX as a type for the general interface
exports.createSchemaCustomization = ({ actions }) => {
  const mdxResolverPasstrough = (fieldName) => async (source, args, context, info) => {
    const type = info.schema.getType(`Mdx`)
    const mdxNode = context.nodeModel.getNodeById({
      id: source.parent,
    })
    const fields = type.getFields()

    const resolver = fields[fieldName].resolve
    const result = await resolver(mdxNode, args, context, {
      fieldName,
    })

    return result
  }

  const slugify = (source) => {
    const slug = source.slug ? source.slug : kebabCase(source.title)

    return `/${options.basePath}/${slug}`.replace(/\/\/+/g, `/`)
  }

  const { createTypes, createFieldExtension } = actions
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
    """
    Markdown Node
    """
    type MarkdownRemark implements Node @infer {
      frontmatter: Frontmatter
    }
    
    """
    Markdown Frontmatter
    """
    type Frontmatter @infer {
      title: String
      date: Date @dateformat
      tags: [NoteTag]
      slug: String
    }
    
    type NoteReference {
      id: String
      name: String
      title: String
      slug: String
    }
    
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
    }
    
    type NoteTag {
      name: String
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
