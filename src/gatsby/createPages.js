const options = require(`./default-options`)
const kebabCase = require(`lodash.kebabcase`)

// These template are only data-fetching wrappers that import components
const homepageTemplate = require.resolve(`../templates/home-page-query.tsx`)
const tagTemplate = require.resolve(`../templates/tag-query.tsx`)
const tagsTemplate = require.resolve(`../templates/tags-query.tsx`)
const noteTemplate = require.resolve(`../templates/note-query.tsx`)
const mocTemplate = require.resolve(`../templates/note-query.tsx`)
const digitalGardenTemplate = require.resolve(`../templates/digital-garden-query.tsx`)

module.exports = async ({ actions, graphql, reporter }) => {
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
      notesQuery: allNote(filter: { type: { ne: "moc" } }, sort: { order: DESC, fields: created }) {
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
