const options = require(`./src/gatsby/default-options`)
const kebabCase = require(`lodash.kebabcase`)

exports.sourceNodes = require('./src/gatsby/sourceNodes')

// exports.onCreateNode = require('./src/gatsby/onCreateNode')

exports.createPages = require('./src/gatsby/createPages')

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

exports.onCreateNode = ({
  node,
  actions,
  getNode,
  createNodeId,
  createContentDigest,
  getNodes,
}) => {
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

    // fieldData.inboundReferences = [{ title: 'test-title', slug: ' test-slug' }]
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

    // createNodeField({
    //   name: 'inboundReferences',
    //   node,
    //   value: fieldData.inboundReferences,
    // })

    createParentChildLink({ parent: node, child: getNode(mdxNoteId) })
  }
}

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

// Create general interfaces that you could can use to leverage other data sources
// The core theme sets up MDX as a type for the general interface
exports.createSchemaCustomization = ({ actions }) => {
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
      name: String
      title: String
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
    inboundReferences: [InboundReference]
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
