const options = require(`./default-options`)

module.exports = ({ actions, createContentDigest }) => {
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
