import { graphql } from 'gatsby'
import Note from '../components/note'

export default Note

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
      banner {
        childImageSharp {
          resize(width: 1200, quality: 90) {
            src
          }
        }
      }
    }
  }
`
