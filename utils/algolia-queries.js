const notesQuery = `{
  notes:  allNote {
      nodes {
        objectID: id
        slug
        title
        created
        updated
        status
        type
        excerpt
        timeToRead
        description
        tags {
          name
          slug
        }
      }
    }
}
`

const flatten = (arr) => {
  return arr
}

const settings = {
  attributesToSnippet: ['excerpt:20'],
  attributeForDistinct: 'type',
}

const queries = [
  {
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME || 'Notes',
    query: notesQuery,
    settings,
    transformer: ({ data }) => flatten(data.notes.nodes),
  },
]

module.exports = queries
