import { graphql } from 'gatsby'
import HomePage from '../pages/HomePage'

export default HomePage

export const query = graphql`
  query {
    allNote(
      filter: { status: { in: ["evergreen", "bud", "seed", "snag"] }, type: { ne: "moc" } }
      sort: { fields: updated, order: DESC }
      limit: 10
    ) {
      nodes {
        slug
        title
        created
        updated
        excerpt
        status
        timeToRead
        description
        tags {
          name
          slug
        }
      }
    }
    allMoc: allNote(filter: { type: { eq: "moc" } }, sort: { order: DESC, fields: created }, limit: 10) {
      nodes {
        slug
        title
        status
      }
    }
  }
`
