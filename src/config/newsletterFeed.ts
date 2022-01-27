/* eslint arrow-body-style: 0 */

const newsletterFeed = (title) => ({
  query: `
    {
      site {
        siteMetadata {
          title: siteTitle
          description: siteDescription
          siteUrl
          site_url: siteUrl
        }
      }
    }
  `,
  feeds: [
    {
      serialize: ({ query: { site, allNote } }) => {
        return allNote.nodes.map((post) => {
          return {
            title: post.title,
            created: post.date,
            excerpt: post.excerpt,
            url: site.siteMetadata.siteUrl + post.slug,
            guid: site.siteMetadata.siteUrl + post.slug,
            custom_elements: [{ 'content:encoded': post.html }],
          }
        })
      },
      query: `
        {
          allNote(sort: { fields: created, order: DESC }) {
            nodes {
              title
              created(formatString: "MMMM D, YYYY")
              excerpt
              slug
            }
          }
        }
      `,
      output: `rss.xml`,
      title,
    },
  ],
})

export default newsletterFeed
