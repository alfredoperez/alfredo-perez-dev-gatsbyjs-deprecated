import { graphql } from 'gatsby'
import Moc from '../components/moc'

export default Moc

export const query = graphql`
  query($slug: String!) {
    note(slug: { eq: $slug }) {
      slug
      title
      created
      updated
      tags {
        name
        slug
      }
      description
      canonicalUrl
      body
      excerpt
      timeToRead
    }
  }
`
