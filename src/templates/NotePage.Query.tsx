import { graphql } from 'gatsby'
import NotePage from '../pages/NotePage'

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
      parent {
        ... on Mdx {
          inboundReferences {
            ... on Mdx {
              childMdxNote {
                id
                slug
                title
              }
            }
          }
          outboundReferences {
            ... on Mdx {
              childMdxNote {
                id
                slug
                title
              }
            }
          }
        }
      }
    }
  }
`
