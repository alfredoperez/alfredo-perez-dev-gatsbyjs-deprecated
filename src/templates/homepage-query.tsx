import { graphql } from 'gatsby'
import Homepage from '../components/homepage'

export default Homepage

export const query = graphql`
  query($formatString: String!) {
    allNote(filter: { type: { ne: "moc" } }, sort: { fields: updated, order: DESC }, limit: 7) {
      nodes {
        slug
        title
        created(formatString: $formatString)
        excerpt
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
