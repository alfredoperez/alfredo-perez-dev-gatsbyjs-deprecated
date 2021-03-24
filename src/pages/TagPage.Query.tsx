import { graphql } from 'gatsby'
import TagComponent from './TagPage'

export default TagComponent

export const query = graphql`
  query($slug: String!, $formatString: String!) {
    allNote(
      sort: { fields: created, order: DESC }
      filter: { tags: { elemMatch: { slug: { eq: $slug } } } }
    ) {
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
