import { graphql } from 'gatsby'
import DigitalGarden from '../components/digital-garden'

export default DigitalGarden

export const query = graphql`
  query($formatString: String!) {
    allNote(filter: { type: { eq: "note" } }, sort: { fields: created, order: DESC }) {
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
