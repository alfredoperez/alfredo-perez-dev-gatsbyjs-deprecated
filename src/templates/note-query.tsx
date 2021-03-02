import Note from '../components/note'
import { graphql } from 'gatsby'

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
