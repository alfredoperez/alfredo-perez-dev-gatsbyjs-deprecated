import { graphql } from 'gatsby'
import NotePage from '../pages/note-page'

export default NotePage

// inboundReferences {
// ... on Mdx {
//     frontmatter {
//       title
//     }
//     slug
//   }
// }
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
    mdx(slug: { eq: $slug }) {
      inboundReferences {
        ... on Mdx {
          frontmatter {
            title
          }
          slug
        }
      }
    }
  }
`
