import { graphql } from 'gatsby'
import Homepage from '../components/homepage'

export default Homepage

export const query = graphql`
  query($formatString: String!) {
    allNote(sort: { fields: created, order: DESC }, limit: 3) {
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
  }
`
