import { graphql } from 'gatsby'
import DigitalGardenPage from '../pages/digital-garden-page'

export default DigitalGardenPage

export const query = graphql`
  query($formatString: String!) {
    allNote(filter: { type: { ne: "moc" } }, sort: { fields: created, order: DESC }) {
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
