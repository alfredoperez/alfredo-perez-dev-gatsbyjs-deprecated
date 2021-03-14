import { graphql } from 'gatsby'
import DigitalGardenPage from '../pages/digital-garden-page'

export default DigitalGardenPage

export const query = graphql`
  query {
    allNote(filter: { type: { ne: "moc" } }, sort: { fields: created, order: DESC }) {
      nodes {
        slug
        title
        created
        updated
        status
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
