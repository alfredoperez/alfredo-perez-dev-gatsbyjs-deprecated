import { graphql } from 'gatsby'
import HomePage from '../pages/HomePage'

export default HomePage

export const query = graphql`
  query {
    allNote(
      filter: { status: { in: ["evergreen", "bud"] }, type: { ne: "moc" } }
      sort: { fields: created, order: ASC }
      limit: 10
    ) {
      nodes {
        id
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
    allMoc: allNote(
      filter: { type: { eq: "moc" } }
      sort: { order: DESC, fields: created }
      limit: 10
    ) {
      nodes {
        slug
        title
        status
      }
    }
  }
`
