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
  query($slug: String!, $formatString: String!) {
    note(slug: { eq: $slug }) {
      slug
      title
      created(formatString: $formatString)
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
